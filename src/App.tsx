
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import TutorDashboard from "./pages/tutor/Dashboard";
import Classes from "./pages/tutor/Classes";
import Earnings from "./pages/tutor/Earnings";
import TutorMessages from "./pages/tutor/Messages";
import Feedback from "./pages/tutor/Feedback";
import TutorHelp from "./pages/tutor/Help";
import Layout from "./components/Layout";
import NotFound from "./pages/NotFound";

import Dashboard from "./pages/student/Dashboard";
import MyClasses from "./pages/student/MyClasses";
import ExploreClasses from "./pages/student/ExploreClasses";
import ClassDetail from "./pages/student/ClassDetail";
import Profile from "./pages/student/Profile";
import Help from "./pages/student/Help";
import Messages from "./pages/student/Messages";
import TutorProfile from "./pages/student/TutorProfile";
import CourseCheckout from "./pages/student/CourseCheckout";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/tutor/" element={<TutorDashboard />} />
            <Route path="/tutor/classes" element={<Classes />} />
            <Route path="/tutor/earnings" element={<Earnings />} />
            <Route path="/tutor/messages" element={<TutorMessages />} />
            <Route path="/tutor/feedback" element={<Feedback />} />
            <Route path="/tutor/help" element={<TutorHelp />} />
          </Route>
          <Route path="/" element={<Dashboard />} />
          <Route path="/my-classes" element={<MyClasses />} />
          <Route path="/explore" element={<ExploreClasses />} />
          <Route path="/classes/:id" element={<ClassDetail />} />
          <Route path="/checkout/:id" element={<CourseCheckout />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/help" element={<Help />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/tutor/:id" element={<TutorProfile />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
