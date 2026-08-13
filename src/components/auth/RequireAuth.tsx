import { Navigate, Outlet } from 'react-router-dom';
import { getUser, homePathForRole, isAuthenticated } from '@/lib/auth';

export function RequireAuth() {
  if (!isAuthenticated()) return <Navigate to="/sign-in" replace />;
  return <Outlet />;
}

export function GuestOnly() {
  if (isAuthenticated()) return <Navigate to={homePathForRole(getUser()?.role)} replace />;
  return <Outlet />;
}
