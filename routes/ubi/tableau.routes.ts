import express from 'express';
import cron from 'node-cron';
import { addFavoriteApiResponse, authTokenRefreshHandler, authTokenResponse, deleteFavoriteApiResponse, environmentProjectsResoponse, jwtTokenResponse, listFavoriteApiResponse, recentsResponse, refreshTokenJob, thumbnailProxyResponse } from '../../controllers';
import { commonHeaders } from '../../middleware';
import { tableauSecrets } from '../../services';

const router = express.Router();


(async () => {
    const tableauConfig = await tableauSecrets();
    router.use((req: any, res, next) => {
      req.tableauConfig = tableauConfig;
      next();
    });
    router.post('/view-thumbnail', commonHeaders, thumbnailProxyResponse);
    router.get('/auth-token', commonHeaders, authTokenResponse);
    router.get('/jwt', commonHeaders, jwtTokenResponse);
    router.get('/environment-projects', commonHeaders, environmentProjectsResoponse);
    router.get('/recents', commonHeaders, recentsResponse);
    router.get('/favorites', commonHeaders, listFavoriteApiResponse);
    router.put('/favorites', commonHeaders, addFavoriteApiResponse);
    router.delete('/favorites/:viewId', commonHeaders, deleteFavoriteApiResponse);
    router.get('/auth-token/refresh', commonHeaders, authTokenRefreshHandler);
})();

cron.schedule("0 */3 * * *", async () => {
  const now = new Date();
  console.log("⏰ Running every 3 hours (IST):", now.toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }));
  await refreshTokenJob();
}, {
  timezone: "Asia/Kolkata"
});

export default router;