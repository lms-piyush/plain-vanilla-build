
import { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import ProtectedRoute from "@/components/ProtectedRoute";
import NotFound from "@/pages/NotFound";

// Landing and Dashboard pages
import Index from "@/pages/dashboard/Index";
import Dashboard from "@/pages/Dashboard";
import StudentEntry from "@/pages/StudentEntry";
import TutorEntry from "@/pages/TutorEntry";

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

// Student pages
import StudentDashboardPage from "@/pages/student/Dashboard";
import StudentMyClasses from "@/pages/student/MyClasses";
import ExploreClasses from "@/pages/student/ExploreClasses";
import ClassDetail from "@/pages/student/ClassDetail";
import Profile from "@/pages/student/Profile";
import Help from "@/pages/student/Help";
import StudentMessages from "@/pages/student/Messages";
import TutorProfile from "@/pages/student/TutorProfile";
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

const AppRoutes = () => {
  return (
    <Routes>
      {/* Landing page with complete experience */}
      <Route path="/" element={<Index />} />
      
      {/* Dashboard selection page */}
      <Route path="/dashboard" element={<Dashboard />} />
      
      {/* Entry points that redirect to respective dashboards */}
      <Route path="/student" element={<StudentEntry />} />
      <Route path="/tutor" element={<TutorEntry />} />
      
      {/* Auth */}
      <Route path="/auth/login" element={<Login />} />
      <Route path="/auth/signup" element={<SignUp />} />
      <Route path="/auth/forgot-password" element={<ForgotPassword />} />
      
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
        element={<ProtectedRoute><TutorDashboard /></ProtectedRoute>} 
      />
      <Route 
        path="/tutor-dashboard/earnings" 
        element={<ProtectedRoute><Earnings /></ProtectedRoute>} 
      />
      <Route 
        path="/tutor-dashboard/classes" 
        element={<ProtectedRoute><MyClasses /></ProtectedRoute>} 
      />
      <Route 
        path="/tutor-dashboard/classes/:id" 
        element={<ProtectedRoute><ClassDetails /></ProtectedRoute>} 
      />
      <Route 
        path="/tutor-dashboard/messages" 
        element={<ProtectedRoute><Messages /></ProtectedRoute>} 
      />
      <Route 
        path="/tutor-dashboard/feedback" 
        element={<ProtectedRoute><Feedback /></ProtectedRoute>} 
      />
      
      {/* Tutor Routes with Layout */}
      <Route element={<Layout />}>
        <Route path="/tutor/dashboard" element={<TutorDashboardMain />} />
        <Route path="/tutor/classes" element={<TutorClasses />} />
        <Route path="/tutor/earnings" element={<TutorEarnings />} />
        <Route path="/tutor/messages" element={<TutorMessages />} />
        <Route path="/tutor/feedback" element={<TutorFeedback />} />
        <Route path="/tutor/help" element={<TutorHelp />} />
      </Route>
      
      {/* Student Routes with Layout - with /student/ prefix */}
      <Route element={<Layout />}>
        <Route path="/student/dashboard" element={<StudentDashboardPage />} />
        <Route path="/student/my-classes" element={<StudentMyClasses />} />
        <Route path="/student/explore" element={<ExploreClasses />} />
        <Route path="/student/classes/:id" element={<ClassDetail />} />
        <Route path="/student/checkout/:id" element={<CourseCheckout />} />
        <Route path="/student/profile" element={<Profile />} />
        <Route path="/student/help" element={<Help />} />
        <Route path="/student/messages" element={<StudentMessages />} />
        <Route path="/student/tutor/:id" element={<TutorProfile />} />
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
      
      {/* 404 Not Found */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
