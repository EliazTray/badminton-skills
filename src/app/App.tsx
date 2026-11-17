import { lazy, Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { AppShell } from './AppShell';
import { LoadingScreen } from './LoadingScreen';
import { useAppStore } from '../store/appStore';
import { DashboardPage } from '../features/dashboard/DashboardPage';
import { LogPage } from '../features/sessions/LogPage';
import { SettingsPage } from '../features/settings/SettingsPage';

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

export function App() {
  const hydrated = useAppStore((state) => state.hydrated);

  if (!hydrated) {
    return <LoadingScreen />;
  }

  return (
    <Routes>
      <Route element={<AppShell />}>
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
        <Route path="settings" element={<SettingsPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
