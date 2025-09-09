import { Request } from 'express';
export interface XAppsRdsSecrets {
  user: string;
  host: string;
  database: string;
  password: string;
  port: number;
}

export type ColumnFilterConditionFilterType = 'multi-text' | 'text';
export type ColumnFilterConditionSearchTypeCode =
| 'contains'
| 'does_not_contain'
| 'equals'
| 'does_not_equal'
| 'begins_with'
| 'ends_with'
| 'is_blank'
| 'is_not_blank';

type ColumnFilterConditionSearchTypeName =
  | 'Contains'
  | 'Does not contain'
  | 'Equals'
  | 'Does not equal'
  | 'Begins with'
  | 'Ends with'
  | 'Blank'
  | 'Not blank';

export interface ColumnFilterConditionSearch {
  code: ColumnFilterConditionSearchTypeCode;
  name: ColumnFilterConditionSearchTypeName;
}

type ColumnFilterOperator = 'and' | 'or' | null;

export interface ColumnFilterCondition {
  searchTags: string[];
  type: ColumnFilterConditionSearchTypeCode;
}

export interface ColumnFilter {
  columnName: string;
  filterType: ColumnFilterConditionFilterType;
  conditions: Array<ColumnFilterCondition>;
  operator?: ColumnFilterOperator;  
}