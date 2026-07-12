import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import Spinner from '@/components/ui/Spinner';

interface Props {
  children: React.ReactNode;
  roles?: Array<'student' | 'instructor' | 'admin'>;
}

const ProtectedRoute = ({ children, roles }: Props) => {
  const { user, loading } = useAuthStore();
  const location = useLocation();

  if (loading) return <Spinner full />;
  if (!user) return <Navigate to="/login" state={{ from: location }} replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/" replace />;

  return <>{children}</>;
};

export default ProtectedRoute;
