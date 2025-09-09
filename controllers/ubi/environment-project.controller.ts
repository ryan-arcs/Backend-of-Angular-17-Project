import { Response } from 'express';
import axios from 'axios';
import { TableauRequest } from '../../interfaces';
import { commmonResponse, errorResponse } from '../../utilities';

export const environmentProjectsResoponse = async (req: TableauRequest, res: Response) => {
  try {
    let { environmentName } = req?.query;
    let { tableauAppApiUrl, tableauAppEnvironments } = req.tableauConfig || {};

    tableauAppEnvironments = tableauAppEnvironments ? JSON.parse(atob(tableauAppEnvironments)?.replace(/'/g, '"')) : [];

    if (!tableauAppApiUrl) {
      throw Error('Invalid configuration!');
    }

    const tableauAuthToken = req?.headers?.['x-tableau-auth-token'] || '';
    const siteId = req?.headers?.['x-tableau-site-id'] || '';
    const userId = req?.headers?.['x-tableau-user-id'] || '';

    if (!siteId || !tableauAuthToken || !userId) {
      throw Error('Invalid access!');
    }

    const [allProjects, allWorkbooks, allViews, favoriteViews] = await Promise.all([getAllGlobalProjects(req), getAllGlobalWorkBooks(req), getAllGlobalViews(req), getFavoritesOfUser(req)]);

    // Build lookup maps for userAllWorkbooks and userAllProjects
    const mapWorkbook = new Map(allWorkbooks?.map(item => [item.id, item]));
    const mapProject = new Map(allProjects?.map(item => [item.id, item]));

    // Perform two-level left join
    const result = allViews?.map(item => {
      const matchWorkbook = mapWorkbook.get(item.workbook?.id) || {};

      const matchProject = mapProject.get(item.project?.id) || {};

      const { topProjectName, projectPath, envName } = getProjectPathAndTopProjectName(matchProject?.id, mapProject);
      const viewDescription = `${matchProject?.description || ''} ${matchWorkbook?.description || ''}`;
      return {
        id: item.id,
        name: item.name,
        viewUrlName: item.viewUrlName,
        tags: item.tags,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
        isFavorite: favoriteViews.has(item.id),
        description: viewDescription?.trim(),
        workbook: {
          id: matchWorkbook?.id,
          name: matchWorkbook?.name,
          contentUrl: matchWorkbook?.contentUrl
        },
        project: {
          id: matchProject?.id,
          name: matchProject?.name,
          topPrName: topProjectName,
          prPath: projectPath,
          envName: envName
        }
      };
    });

    if (!environmentName || !tableauAppEnvironments?.includes(environmentName as string)) {
      environmentName = tableauAppEnvironments?.[0] || '';
    }

    const dataByEnvironmentAndXApps = filterByEnvNameAndXApps(result, environmentName as string);

    //Evaluate Groups/Persona
    const groupsMap: any = {};
    dataByEnvironmentAndXApps.forEach((item: { tags: { tag: never[]; }; id: any; }) => {
      const tags = item.tags?.tag || [];
      tags.forEach((tag: { label: string; }) => {
        const label = tag.label;
        if (label.startsWith("XAPPS:GROUP=")) {
          const groupName = label.split("=")[1];

          if (!groupsMap[groupName]) {
            groupsMap[groupName] = [];
          }

          groupsMap[groupName].push(item.id);
        }
      });
    });

    const userGroups = Object.entries(groupsMap).map(([name, reports]) => ({
      name,
      reports
    }));

    const groupByProject = dataByEnvironmentAndXApps.reduce((acc: any, item: any) => {
      const key = item.project.topPrName;
      if (!acc[key]) {
        acc[key] = {
          ...item.project,
          views: []
        };
      }
      acc[key].views.push(item);
      return acc;
    }, {});

    commmonResponse({
      res,
      data: {
        environments: tableauAppEnvironments,
        groups: userGroups || [],
        selectedEnvironment: {
          name: environmentName,
          projects: groupByProject
        }
      },
      statusCode: 200,
      statusMessage: "Success",
      statusDescription: "Data retrieved successfully"
    })
  } catch (err: any) {
    errorResponse({
      res,
      err
    });
  }
}

// Fileter the data by environment like DEV, VAL etc
const filterByEnvNameAndXApps = (data: any, envName: string) => {
  return data.filter((item: any) => {
    const tags = item.tags?.tag || [];
    return (item.project.envName === envName && tags.some((t: { label: string; }) => t.label === "XAPPS"));
  })
};
const getAllGlobalProjects = async (req: TableauRequest) => {
  const { tableauAppApiUrl } = req.tableauConfig || {};
  const tableauAuthToken = req?.headers?.['x-tableau-auth-token'] || '';
  const siteId = req?.headers?.['x-tableau-site-id'] || '';

  let lprojects: any[] = [];
  let lresponse: any = undefined;
  let pageNumber = 1;
  do {
    lresponse = await axios.get(
      `${tableauAppApiUrl as string}/api/3.22/sites/${siteId}/projects?pageNumber=${pageNumber}&pageSize=1000`,
      {
        headers: {
          'X-Tableau-Auth': tableauAuthToken
        }
      });
    lprojects = lprojects?.concat(lresponse?.data?.projects?.project);
    pageNumber++;
  } while (
    lresponse?.data?.pagination?.totalAvailable &&
    lprojects?.length < lresponse?.data?.pagination?.totalAvailable
  );
  return lprojects;
}

const getAllGlobalWorkBooks = async (req: TableauRequest) => {
  const { tableauAppApiUrl } = req.tableauConfig || {};
  const tableauAuthToken = req?.headers?.['x-tableau-auth-token'] || '';
  const siteId = req?.headers?.['x-tableau-site-id'] || '';

  let lworkbooks: any[] = [];
  let lresponse: any = undefined;
  let pageNumber = 1;
  do {
    lresponse = await axios.get(
      `${tableauAppApiUrl as string}/api/3.22/sites/${siteId}/workbooks?pageNumber=${pageNumber}&pageSize=1000`,
      {
        headers: {
          'X-Tableau-Auth': tableauAuthToken
        }
      });
    lworkbooks = lworkbooks?.concat(lresponse?.data?.workbooks?.workbook);
    pageNumber++;
  } while (
    lresponse?.data?.pagination?.totalAvailable &&
    lworkbooks?.length < lresponse?.data?.pagination?.totalAvailable
  );
  return lworkbooks;
}

const getAllGlobalViews = async (req: TableauRequest) => {
  const { tableauAppApiUrl } = req.tableauConfig || {};
  const tableauAuthToken = req?.headers?.['x-tableau-auth-token'] || '';
  const siteId = req?.headers?.['x-tableau-site-id'] || '';

  let lviews: any[] = [];
  let lresponse: any = undefined;
  let pageNumber = 1;
  do {

    lresponse = await axios.get(
      `${tableauAppApiUrl as string}/api/3.22/sites/${siteId}/views?pageNumber=${pageNumber}&pageSize=1000`,
      {
        headers: {
          'X-Tableau-Auth': tableauAuthToken
        }
      });

    lviews = lviews?.concat(lresponse?.data?.views?.view);
    pageNumber++;
  } while (
    lresponse?.data?.pagination?.totalAvailable &&
    lviews?.length < lresponse?.data?.pagination?.totalAvailable
  );
  return lviews;
}

//Find root folder name, folder path and environment name function
const getProjectPathAndTopProjectName = (folderId: string, mapProject: any) => {
  const path = [];
  let current = mapProject.get(folderId);
  let envName = '';
  while (current) {
    const parentProject = mapProject.get(current.parentProjectId);

    if (!parentProject) {
      envName = current.name;
      break;
    }
    path.unshift(current.name);
    current = parentProject;
  }

  return {
    topProjectName: path?.[0] || '',
    projectPath: path?.join('/') || '',
    envName: envName
  };
}

const getFavoritesOfUser = async (req: TableauRequest) => {
  const { tableauAppApiUrl } = req.tableauConfig || {};
  const siteId = req?.headers?.['x-tableau-site-id'] || '';
  const tableauAuthToken = req?.headers?.['x-tableau-auth-token'] || '';
  const userId = req?.headers?.['x-tableau-user-id'] || '';


  let allFavorites: any[] = [];
  let lresponse: any = undefined;
  let pageNumber = 1;

  do {

    lresponse = await axios.get(
      `${tableauAppApiUrl as string}/api/3.22/sites/${siteId}/favorites/${userId}?pageNumber=${pageNumber}&pageSize=1000`,
      {
        headers: {
          'X-Tableau-Auth': tableauAuthToken
        }
      });

    allFavorites = allFavorites?.concat(lresponse?.data?.favorites?.favorite);
    pageNumber++;
  } while (
    lresponse?.data?.pagination?.totalAvailable &&
    allFavorites?.length < lresponse?.data?.pagination?.totalAvailable
  );

  // Final transformation: Filter only views and return a Map with id as key
  const favoriteViews = new Map(
    allFavorites
      .filter(item => item.view && item.view.id)
      .map(item => [
        item.view.id,
        {
          name: item.view.name,
          contentUrl: item.view.contentUrl,
          viewUrlName: item.view.viewUrlName
        }
      ])
  );
  return favoriteViews;
}