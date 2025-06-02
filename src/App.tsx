
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Landing and Dashboard pages
import Index from "./pages/dashboard/Index";
import Dashboard from "./pages/Dashboard";
import StudentEntry from "./pages/StudentEntry";
import TutorEntry from "./pages/TutorEntry";

// Tutor pages
import TutorDashboard from "./pages/tutor/Dashboard";
import Classes from "./pages/tutor/Classes";
import Earnings from "./pages/tutor/Earnings";
import TutorMessages from "./pages/tutor/Messages";
import Feedback from "./pages/tutor/Feedback";
import TutorHelp from "./pages/tutor/Help";

// Student pages
import StudentDashboardPage from "./pages/student/Dashboard";
import MyClasses from "./pages/student/MyClasses";
import ExploreClasses from "./pages/student/ExploreClasses";
import ClassDetail from "./pages/student/ClassDetail";
import Profile from "./pages/student/Profile";
import Help from "./pages/student/Help";
import Messages from "./pages/student/Messages";
import TutorProfile from "./pages/student/TutorProfile";
import CourseCheckout from "./pages/student/CourseCheckout";

// Layouts
import Layout from "./components/layout/Layout";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Landing page with complete experience */}
          <Route path="/" element={<Index />} />
          
          {/* Dashboard selection page */}
          <Route path="/dashboard" element={<Dashboard />} />
          
          {/* Entry points that redirect to respective dashboards */}
          <Route path="/student" element={<StudentEntry />} />
          <Route path="/tutor" element={<TutorEntry />} />
          
          {/* Tutor Routes with Layout */}
          <Route element={<Layout />}>
            <Route path="/tutor/dashboard" element={<TutorDashboard />} />
            <Route path="/tutor/classes" element={<Classes />} />
            <Route path="/tutor/earnings" element={<Earnings />} />
            <Route path="/tutor/messages" element={<TutorMessages />} />
            <Route path="/tutor/feedback" element={<Feedback />} />
            <Route path="/tutor/help" element={<TutorHelp />} />
          </Route>
          
          {/* Student Routes with Layout */}
          <Route element={<Layout />}>
            <Route path="/student/dashboard" element={<StudentDashboardPage />} />
            <Route path="/my-classes" element={<MyClasses />} />
            <Route path="/explore" element={<ExploreClasses />} />
            <Route path="/classes/:id" element={<ClassDetail />} />
            <Route path="/checkout/:id" element={<CourseCheckout />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/help" element={<Help />} />
            <Route path="/messages" element={<Messages />} />
            <Route path="/tutor/:id" element={<TutorProfile />} />
          </Route>
          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
