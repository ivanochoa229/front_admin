import { Navigate, Route, Routes } from 'react-router-dom';

import ProtectedRoute from './components/ProtectedRoute';
import AppLayout from './modules/shared/layout/AppLayout';
import DashboardPage from './modules/dashboard/pages/DashboardPage';
import LoginPage from './modules/auth/pages/LoginPage';
import ProjectDetailPage from './modules/projects/pages/ProjectDetailPage';
import ProjectsPage from './modules/projects/pages/ProjectsPage';
import TeamsPage from './modules/teams/pages/TeamsPage';

const App = () => (
  <Routes>
    <Route path="/login" element={<LoginPage />} />
    <Route
      path="/"
      element={
        <ProtectedRoute>
          <AppLayout />
        </ProtectedRoute>
      }
    >
      <Route index element={<DashboardPage />} />
      <Route path="projects" element={<ProjectsPage />} />
      <Route path="projects/:projectId" element={<ProjectDetailPage />} />
      <Route path="teams" element={<TeamsPage />} />
    </Route>
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
);

export default App;