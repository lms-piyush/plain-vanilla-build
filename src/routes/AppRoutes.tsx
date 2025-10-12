import { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import ProtectedRoute from "@/components/ProtectedRoute";
import AdminRoute from "@/components/admin/AdminRoute";
import AuthRedirect from "@/components/AuthRedirect";
import NotFound from "@/pages/NotFound";

// Landing and Dashboard pages
import Index from "@/pages/dashboard/Index";
import Dashboard from "@/pages/Dashboard";
import StudentEntry from "@/pages/StudentEntry";
import TutorEntry from "@/pages/TutorEntry";

// Stripe Demo
import StripeDemo from "@/pages/StripeDemo";

// Layouts
import Layout from "@/components/layout/Layout";

// Auth Pages
import Login from "@/pages/dashboard/auth/Login";
import SignUp from "@/pages/dashboard/auth/SignUp";
import ForgotPassword from "@/pages/dashboard/auth/ForgotPassword";

// Dashboard Pages
import UserDashboard from "@/pages/dashboard/dashboard/UserDashboard";
import EnrolledClasses from "@/pages/dashboard/dashboard/EnrolledClasses";
import SavedClasses from "@/pages/dashboard/dashboard/SavedClasses";
import UserProfile from "@/pages/dashboard/dashboard/UserProfile";
import AccountSettings from "@/pages/dashboard/dashboard/AccountSettings";

// Tutor Dashboard Pages
import TutorDashboard from "@/pages/dashboard/tutor-dashboard/TutorDashboard";
import MyClasses from "@/pages/dashboard/tutor-dashboard/MyClasses";
import ClassDetails from "@/pages/dashboard/tutor-dashboard/ClassDetails";
import Earnings from "@/pages/dashboard/tutor-dashboard/Earnings";
import Messages from "@/pages/dashboard/tutor-dashboard/Messages";
import Feedback from "@/pages/dashboard/tutor-dashboard/Feedback";

// Tutor pages
import TutorDashboardMain from "@/pages/tutor/Dashboard";
import TutorClasses from "@/pages/tutor/Classes";
import TutorEarnings from "@/pages/tutor/Earnings";
import TutorMessages from "@/pages/tutor/Messages";
import TutorFeedback from "@/pages/tutor/Feedback";
import TutorHelp from "@/pages/tutor/Help";
import TutorProfilePage from "@/pages/tutor/Profile";

// Student pages
import StudentDashboardPage from "@/pages/student/Dashboard";
import StudentMyClasses from "@/pages/student/MyClasses";
import ExploreClasses from "@/pages/student/ExploreClasses";
import ClassDetail from "@/pages/student/ClassDetail";
import Profile from "@/pages/student/Profile";
import Help from "@/pages/student/Help";
import StudentMessages from "@/pages/student/Messages";
import SubscriptionSuccess from "@/pages/student/SubscriptionSuccess";
import Subscription from "@/pages/student/Subscription";
import EnhancedTutorProfile from "@/pages/student/EnhancedTutorProfile";
import CourseCheckout from "@/pages/student/CourseCheckout";

// Explore Pages
import AcademicSubjects from "@/pages/dashboard/explore/AcademicSubjects";
import ArtsCreativity from "@/pages/dashboard/explore/ArtsCreativity";
import LifeSkills from "@/pages/dashboard/explore/LifeSkills";
import TechnologyCoding from "@/pages/dashboard/explore/TechnologyCoding";

// How It Works Pages
import ClassFormats from "@/pages/dashboard/how-it-works/ClassFormats";
import ForParents from "@/pages/dashboard/how-it-works/ForParents";
import SafetyQuality from "@/pages/dashboard/how-it-works/SafetyQuality";

// For Tutors Pages
import BecomeTutor from "@/pages/dashboard/for-tutors/BecomeTutor";
import SuccessStories from "@/pages/dashboard/for-tutors/SuccessStories";
import TutorResources from "@/pages/dashboard/for-tutors/TutorResources";

// Resources Pages
import BlogArticles from "@/pages/dashboard/resources/BlogArticles";
import HelpCenter from "@/pages/dashboard/resources/HelpCenter";
import LearningGuides from "@/pages/dashboard/resources/LearningGuides";

// Class Pages
import BookClass from "@/pages/dashboard/classes/BookClass";
import { default as PublicClassDetails } from "@/pages/dashboard/classes/ClassDetails";
import ClassManageDetails from "@/pages/tutor/ClassManageDetails";

// Admin Pages
import AdminDashboard from "@/pages/admin/Dashboard";
import AdminUsers from "@/pages/admin/Users";
import AdminClasses from "@/pages/admin/Classes";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Landing page with complete experience */}
      <Route path="/" element={<Index />} />
      
      {/* Stripe Demo */}
      <Route path="/stripe-demo" element={<StripeDemo />} />
      
      {/* Dashboard selection page */}
      <Route path="/dashboard" element={<Dashboard />} />
      
      {/* Entry points that redirect to respective dashboards */}
      <Route path="/student" element={<StudentEntry />} />
      <Route path="/tutor" element={<TutorEntry />} />
      
      {/* Auth */}
      <Route path="/auth/login" element={<Login />} />
      <Route path="/auth/signup" element={<SignUp />} />
      <Route path="/auth/forgot-password" element={<ForgotPassword />} />
      <Route path="/auth/redirect" element={<AuthRedirect />} />
      
      {/* User Dashboard */}
      <Route 
        path="/dashboard/user" 
        element={<ProtectedRoute><UserDashboard /></ProtectedRoute>} 
      />
      <Route 
        path="/dashboard/profile" 
        element={<ProtectedRoute><UserProfile /></ProtectedRoute>} 
      />
      <Route 
        path="/dashboard/enrolled-classes" 
        element={<ProtectedRoute><EnrolledClasses /></ProtectedRoute>} 
      />
      <Route 
        path="/dashboard/saved-classes" 
        element={<ProtectedRoute><SavedClasses /></ProtectedRoute>} 
      />
      <Route 
        path="/dashboard/settings" 
        element={<ProtectedRoute><AccountSettings /></ProtectedRoute>} 
      />
      
      {/* Tutor Dashboard */}
      <Route 
        path="/tutor-dashboard" 
        element={<ProtectedRoute allowedRoles={["tutor"]}><TutorDashboard /></ProtectedRoute>} 
      />
      <Route 
        path="/tutor-dashboard/earnings" 
        element={<ProtectedRoute allowedRoles={["tutor"]}><Earnings /></ProtectedRoute>} 
      />
      <Route 
        path="/tutor-dashboard/classes" 
        element={<ProtectedRoute allowedRoles={["tutor"]}><MyClasses /></ProtectedRoute>} 
      />
      <Route 
        path="/tutor-dashboard/classes/:id" 
        element={<ProtectedRoute allowedRoles={["tutor"]}><ClassDetails /></ProtectedRoute>} 
      />
      <Route 
        path="/tutor-dashboard/messages" 
        element={<ProtectedRoute allowedRoles={["tutor"]}><Messages /></ProtectedRoute>} 
      />
      <Route 
        path="/tutor-dashboard/feedback" 
        element={<ProtectedRoute allowedRoles={["tutor"]}><Feedback /></ProtectedRoute>} 
      />
      
      {/* Tutor Routes with Layout */}
      <Route element={<Layout />}>
        <Route 
          path="/tutor/dashboard" 
          element={<ProtectedRoute allowedRoles={["tutor"]}><TutorDashboardMain /></ProtectedRoute>} 
        />
        <Route 
          path="/tutor/classes" 
          element={<ProtectedRoute allowedRoles={["tutor"]}><TutorClasses /></ProtectedRoute>} 
        />
        <Route 
          path="/tutor/classes/:id" 
          element={<ProtectedRoute allowedRoles={["tutor"]}><ClassManageDetails /></ProtectedRoute>} 
        />
        <Route 
          path="/tutor/earnings" 
          element={<ProtectedRoute allowedRoles={["tutor"]}><TutorEarnings /></ProtectedRoute>} 
        />
        <Route 
          path="/tutor/messages" 
          element={<ProtectedRoute allowedRoles={["tutor"]}><TutorMessages /></ProtectedRoute>} 
          // element={<ProtectedRoute allowedRoles={["tutor"]}> <Messages /></ProtectedRoute>} 
        />
        <Route 
          path="/tutor/feedback" 
          element={<ProtectedRoute allowedRoles={["tutor"]}><TutorFeedback /></ProtectedRoute>} 
        />
        <Route 
          path="/tutor/help" 
          element={<ProtectedRoute allowedRoles={["tutor"]}><TutorHelp /></ProtectedRoute>} 
        />
        <Route 
          path="/tutor/profile" 
          element={<ProtectedRoute allowedRoles={["tutor"]}><TutorProfilePage /></ProtectedRoute>} 
        />
      </Route>
      
      {/* Student Routes with Layout - with /student/ prefix */}
      <Route element={<Layout />}>
        <Route 
          path="/student/dashboard" 
          element={<ProtectedRoute allowedRoles={["student", "parent"]}><StudentDashboardPage /></ProtectedRoute>} 
        />
        <Route 
          path="/student/my-classes" 
          element={<ProtectedRoute allowedRoles={["student", "parent"]}><StudentMyClasses /></ProtectedRoute>} 
        />
        <Route 
          path="/student/explore" 
          element={<ProtectedRoute allowedRoles={["student", "parent"]}><ExploreClasses /></ProtectedRoute>} 
        />
        <Route 
          path="/student/classes/:id" 
          element={<ProtectedRoute allowedRoles={["student", "parent"]}><ClassDetail /></ProtectedRoute>} 
        />
        <Route 
          path="/student/checkout/:id" 
          element={<ProtectedRoute allowedRoles={["student", "parent"]}><CourseCheckout /></ProtectedRoute>} 
        />
        <Route 
          path="/student/profile" 
          element={<ProtectedRoute allowedRoles={["student", "parent"]}><Profile /></ProtectedRoute>} 
        />
        <Route 
          path="/student/help" 
          element={<ProtectedRoute allowedRoles={["student", "parent"]}><Help /></ProtectedRoute>} 
        />
        <Route 
          path="/student/messages" 
          element={<ProtectedRoute allowedRoles={["student", "parent"]}><StudentMessages /></ProtectedRoute>} 
        />
        <Route 
          path="/student/tutor/:id" 
          element={<ProtectedRoute allowedRoles={["student", "parent"]}><EnhancedTutorProfile /></ProtectedRoute>} 
        />
        <Route 
          path="/student/subscription" 
          element={<ProtectedRoute allowedRoles={["student", "parent"]}><Subscription /></ProtectedRoute>} 
        />
        <Route 
          path="/student/subscription-success" 
          element={<ProtectedRoute allowedRoles={["student", "parent"]}><SubscriptionSuccess /></ProtectedRoute>} 
        />
      </Route>
      
      {/* Explore */}
      <Route path="/explore/academic-subjects" element={<AcademicSubjects />} />
      <Route path="/explore/arts-creativity" element={<ArtsCreativity />} />
      <Route path="/explore/life-skills" element={<LifeSkills />} />
      <Route path="/explore/technology-coding" element={<TechnologyCoding />} />
      
      {/* How It Works */}
      <Route path="/how-it-works/class-formats" element={<ClassFormats />} />
      <Route path="/how-it-works/for-parents" element={<ForParents />} />
      <Route path="/how-it-works/safety-quality" element={<SafetyQuality />} />
      
      {/* For Tutors */}
      <Route path="/for-tutors/become-tutor" element={<BecomeTutor />} />
      <Route path="/for-tutors/success-stories" element={<SuccessStories />} />
      <Route path="/for-tutors/tutor-resources" element={<TutorResources />} />
      
      {/* Resources */}
      <Route path="/resources/blog-articles" element={<BlogArticles />} />
      <Route path="/resources/help-center" element={<HelpCenter />} />
      <Route path="/resources/learning-guides" element={<LearningGuides />} />
      
      {/* Classes */}
      <Route path="/classes/:id" element={<PublicClassDetails />} />
      <Route path="/classes/:id/book" element={<BookClass />} />
      
      {/* Admin Routes */}
      <Route 
        path="/admin/dashboard" 
        element={<AdminRoute><AdminDashboard /></AdminRoute>} 
      />
      <Route 
        path="/admin/users" 
        element={<AdminRoute><AdminUsers /></AdminRoute>} 
      />
      <Route 
        path="/admin/classes" 
        element={<AdminRoute><AdminClasses /></AdminRoute>} 
      />
      
      {/* 404 Not Found */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
