import { lazy, Suspense } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { LoadingScreen } from './LoadingScreen';
import { useAppStore } from '../store/appStore';
import { DashboardPage } from '../features/dashboard/DashboardPage';
import { LogPage } from '../features/sessions/LogPage';
import { SettingsPage } from '../features/settings/SettingsPage';
import { AccountPage } from '../features/auth/AccountPage';
import { AccessGate } from '../features/auth/AccessGate';
import { OnboardingPage } from '../features/onboarding/OnboardingPage';
import { SharedProfilePage } from '../features/share/SharedProfilePage';

const MapPage = lazy(() =>
  import('../features/map/MapPage').then((module) => ({ default: module.MapPage })),
);
const SkillDetailPage = lazy(() =>
  import('../features/skill/SkillDetailPage').then((module) => ({
    default: module.SkillDetailPage,
  })),
);

function RouteLoading() {
  return (
    <div className="app-card flex min-h-[320px] items-center justify-center p-8 text-sm text-muted">
      正在加载图谱…
    </div>
  );
}

function AppLayout() {
  return <AccessGate />;
}

export function App() {
  const hydrated = useAppStore((state) => state.hydrated);
  const location = useLocation();
  const isShareRoute = location.pathname.startsWith('/share/');

  if (!hydrated && !isShareRoute) {
    return <LoadingScreen />;
  }

  return (
    <Routes>
      <Route path="share/:shareId" element={<SharedProfilePage />} />
      <Route element={<AppLayout />}>
        <Route index element={<DashboardPage />} />
        <Route
          path="map"
          element={
            <Suspense fallback={<RouteLoading />}>
              <MapPage />
            </Suspense>
          }
        />
        <Route
          path="map/:skillId"
          element={
            <Suspense fallback={<RouteLoading />}>
              <SkillDetailPage />
            </Suspense>
          }
        />
        <Route path="log" element={<LogPage />} />
        <Route path="welcome" element={<OnboardingPage />} />
        <Route path="account" element={<AccountPage />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
