import { Application } from 'express';
import userRoutes from './user.routes';
import roleRoutes from './role.routes';
import applicationRoutes from './applications.routes';
import moduleRoutes from './module.routes';
import submoduleRoutes from './submodule.routes';
import permissionRoutes from './permission.routes';
import userProfileRoutes from './user-profile.routes';
import loginRoutes from './login.routes';
import tableauRoutes from './tableau.routes';

// Register all route modules
const registerRoutes = (app: Application): void => {
  app.use('/xapps-admin/users', userRoutes);
  app.use('/xapps-admin/roles', roleRoutes);
  app.use('/xapps-admin/apps', applicationRoutes);
  app.use('/xapps-admin/modules', moduleRoutes);
  app.use('/xapps-admin/submodules', submoduleRoutes);
  app.use('/xapps-admin/permissions', permissionRoutes);
  app.use('/xapps-admin/user-profile', userProfileRoutes);
  app.use('/tableau', tableauRoutes);
  app.use('/', loginRoutes);
};

export default registerRoutes;