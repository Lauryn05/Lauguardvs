
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Index from "./pages/Index";
import ChatPage from "./pages/ChatPage";
import AdminDashboard from "./pages/AdminDashboard";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import AdminLayout from "./layouts/AdminLayout";
import RuleSettings from "./pages/admin/RuleSettings";
import Departments from "./pages/admin/Departments";
import PromptLogs from "./pages/admin/PromptLogs";
import AdversarialPrompts from "./pages/admin/AdversarialPrompts";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="rules" element={<RuleSettings />} />
            <Route path="departments" element={<Departments />} />
            <Route path="logs" element={<PromptLogs />} />
            <Route path="adversarial" element={<AdversarialPrompts />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
