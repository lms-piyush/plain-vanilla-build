
import { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import ProtectedRoute from "@/components/ProtectedRoute";
import Index from "@/pages/dashboard/Index";
import NotFound from "@/pages/NotFound";

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
      {/* Home */}
      <Route path="/" element={<Index />} />
      
      {/* Auth */}
      <Route path="/auth/login" element={<Login />} />
      <Route path="/auth/signup" element={<SignUp />} />
      <Route path="/auth/forgot-password" element={<ForgotPassword />} />
      
      {/* User Dashboard */}
      <Route 
        path="/dashboard" 
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
