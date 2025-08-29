export const getUserInfoFromHeader = (headers: any): any => {
  const userInfo = headers['x-user-info'];
  if (!userInfo) return null;

  try {
    return typeof userInfo === 'string' ? JSON.parse(userInfo) : userInfo;
  } catch (err) {
    console.error('Invalid x-user-info header:', err);
    return null;
  }
};