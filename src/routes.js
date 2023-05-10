import { Navigate, useRoutes } from 'react-router-dom';
// layouts
import DashboardLayout from './layouts/dashboard';
import LogoOnlyLayout from './layouts/LogoOnlyLayout';
//
import Login from './pages/Login';
import Register from './pages/Register';
import DashboardApp from './pages/DashboardApp';
import Blog from './pages/Blog';
import User from './pages/User';
import NotFound from './pages/Page404';
import SubjectProfilePage from './pages/SubjectProfilePage';
import SubjectProfiles from './pages/Profiles';
import CreateUser from './pages/CreateUser';
import AccessManagement from './pages/AccessManagement';
import MyInquiries from './pages/MyInquiries';
import MyCases from './pages/MyCases';
import SearchSubject from './pages/SearchSubject';
import MyTasks from './pages/MyTasks';
import CommDashboard from './pages/CommDashboard';
import BatchProfiles from './pages/SearchBatch';
import CaseHistory from './pages/CaseHistory';
import AuditTrail from './pages/AuditTrail';

// ----------------------------------------------------------------------

export default function Router() {
  return useRoutes([
    {
      path: '/dashboard',
      element: <DashboardLayout />,
      children: [
        { path: 'app', element: <DashboardApp /> },
        { path: 'profile/:id', element: <SubjectProfilePage />},
        { path: 'user', element: <User /> },
        { path: 'my-inquiries', element: <MyInquiries /> },
        { path: 'blog', element: <Blog /> },
        { path: 'profile', element: <SubjectProfilePage />},
        { path: 'all-profiles', element: <SubjectProfiles />},
        { path: 'profile/:type/:id', element: <SubjectProfilePage />},
        { path: 'add-user', element: <CreateUser /> },
        { path: 'access-management', element: <AccessManagement /> },
        { path: 'my-cases', element : <MyCases />},
        { path: 'view-case/:type/:id', element: <SubjectProfilePage />},
        { path: 'search-subject', element:<SearchSubject/>},
        { path: 'my-tasks', element: <MyTasks />},
        { path: 'comm', element: <CommDashboard /> },
        { path: 'search-batch', element: <BatchProfiles /> },
        { path: 'case-history', element: <CaseHistory /> },
        { path: 'audit-trail', element: <AuditTrail /> }

      ]
    },
    {
      path: '/',
      element: <LogoOnlyLayout />,
      children: [
        
        { path: '/', element: <Navigate to="/dashboard/app" /> },
        { path: 'login', element: <Login /> },
        { path: 'register', element: <Register /> },
        { path: '404', element: <NotFound /> },
        { path: '*', element: <Navigate to="/404" /> }
      ]
    },
    { path: '*', element: <Navigate to="/404" replace /> }
  ]);
}
