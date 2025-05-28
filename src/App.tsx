import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { lazy, Suspense } from 'react';

const Index = lazy(() => import('./pages/Index'));
const Tendances = lazy(() => import('./pages/Tendances'));
const Createurs = lazy(() => import('./pages/Createurs'));
const Upload = lazy(() => import('./pages/Upload'));
const Monetisation = lazy(() => import('./pages/Monetisation'));
const Analytics = lazy(() => import('./pages/Analytics'));
const Parametres = lazy(() => import('./pages/Parametres'));
const NotFound = lazy(() => import('./pages/NotFound'));
const Auth = lazy(() => import('./pages/Auth'));
const AuthLogin = lazy(() => import('./pages/AuthLogin'));
const AuthRegister = lazy(() => import('./pages/AuthRegister'));

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Suspense fallback={<div>Chargement...</div>}>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/auth/login" element={<AuthLogin />} />
            <Route path="/auth/register" element={<AuthRegister />} />
            <Route path="/tendances" element={<Tendances />} />
            <Route path="/createurs" element={<Createurs />} />
            <Route path="/upload" element={<Upload />} />
            <Route path="/monetisation" element={<Monetisation />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/parametres" element={<Parametres />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
