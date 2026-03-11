import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Suspense, lazy } from "react";
import { ScrollUpButton } from "@/components/ui/ScrollUpButton";

import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/auth/ProtectedRoute";

// Lazy load pages for better performance
const Index = lazy(() => import("./pages/Index"));
const ProjectDetails = lazy(() => import("./pages/ProjectDetails"));
const Login = lazy(() => import("./pages/Login"));
const Dashboard = lazy(() => import("./pages/admin/Dashboard"));
const WorksGallery = lazy(() => import("./pages/admin/WorksGallery"));
const WorkerTracking = lazy(() => import("./pages/admin/WorkerTracking"));
const EnquiryManagement = lazy(() => import("./pages/admin/EnquiryManagement"));
const Settings = lazy(() => import("./pages/admin/Settings"));
const ResetPassword = lazy(() => import("./pages/admin/ResetPassword"));


const AllWorks = lazy(() => import("./pages/AllWorks"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

// Loading fallback component
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-zinc-950">
    <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <ScrollUpButton />
      <BrowserRouter>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/gallery/:id" element={<ProjectDetails />} />
            <Route path="/all-works" element={<AllWorks />} />
            <Route path="/admin/login" element={<Login />} />
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/works"
              element={
                <ProtectedRoute>
                  <WorksGallery />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/workers"
              element={
                <ProtectedRoute>
                  <WorkerTracking />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/enquiries"
              element={
                <ProtectedRoute>
                  <EnquiryManagement />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/settings"
              element={
                <ProtectedRoute>
                  <Settings />
                </ProtectedRoute>
              }
            />

            <Route path="/admin/reset-password" element={<ResetPassword />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
