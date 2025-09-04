import { Application } from 'express';
import userProfileRoutes from './user-profile.routes';
import loginRoutes from './login.routes';
import userRoutes from './xapps-admin/user.routes';
import roleRoutes from './xapps-admin/role.routes';
import applicationRoutes from './xapps-admin/applications.routes';
import moduleRoutes from './xapps-admin/module.routes';
import submoduleRoutes from './xapps-admin/submodule.routes';
import permissionRoutes from './xapps-admin/permission.routes';
import tableauRoutes from './ubi/tableau.routes';
import departmentRoutes from './asher/departments.routes';
import vendorRoutes from './asher/vendors.routes';
import lifecycleRoutes from './asher/lifecycles.routes';

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
  app.use('/asher/departments', departmentRoutes);
  app.use('/asher/vendors', vendorRoutes);
  app.use('/asher/lifecycles', lifecycleRoutes);
  app.use('/', loginRoutes);
};

export default registerRoutes;