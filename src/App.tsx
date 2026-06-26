import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { lazy, Suspense, useEffect } from 'react';
import { useAppStore } from '@/store';
import BottomNav from '@/components/ui/BottomNav';

const HomePage = lazy(() => import('@/pages/HomePage'));
const SoothePage = lazy(() => import('@/pages/SoothePage'));
const VentPage = lazy(() => import('@/pages/VentPage'));
const GoodMoodPage = lazy(() => import('@/pages/GoodMoodPage'));

function LoadingFallback() {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100dvh',
      fontSize: '16px',
      color: 'var(--soothe-text-secondary)',
    }}>
      加载中…
    </div>
  );
}

export default function App() {
  const location = useLocation();
  const setMode = useAppStore((s) => s.setMode);

  // Sync app mode based on the current route
  useEffect(() => {
    const path = location.pathname;
    if (path === '/soothe') setMode('soothe');
    else if (path === '/vent') setMode('vent');
    else if (path === '/goodmood') setMode('goodmood');
    else setMode('idle');
  }, [location.pathname, setMode]);

  return (
    <>
      <Suspense fallback={<LoadingFallback />}>
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<HomePage />} />
            <Route path="/soothe" element={<SoothePage />} />
            <Route path="/vent" element={<VentPage />} />
            <Route path="/goodmood" element={<GoodMoodPage />} />
          </Routes>
        </AnimatePresence>
      </Suspense>
      <BottomNav />
    </>
  );
}
