import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { GraduationCap, User, BookOpen, DollarSign, MessageSquare, Star, Home, ArrowRight } from 'lucide-react';
import DashboardNavigation from '@/components/navbar/DashboardNavigation';

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100">
      {/* Unified Dashboard Navbar */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo and Home Link */}
            <div className="flex items-center space-x-6">
              <Link to="/" className="flex items-center">
                <GraduationCap className="h-8 w-8 text-[#8A5BB7]" />
                <h1 className="ml-2 text-2xl font-bold text-gray-900">TalentSchool</h1>
              </Link>
              
              <Link to="/" className="flex items-center text-gray-600 hover:text-[#8A5BB7] transition-colors">
                <Home className="h-5 w-5 mr-2" />
                <span className="text-sm font-medium">Home</span>
              </Link>
            </div>

            {/* Navigation Menu */}
            <DashboardNavigation />

            {/* Right Section - Auth Buttons */}
            <div className="flex items-center space-x-4">
              <Button variant="outline" asChild>
                <Link to="/auth/login">Login</Link>
              </Button>
              <Button className="bg-[#8A5BB7] hover:bg-[#8A5BB7]/90" asChild>
                <Link to="/auth/signup">Sign Up</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Welcome to Your
            <span className="text-[#8A5BB7]"> Learning Dashboard</span>
          </h2>
          <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
            Access your personalized learning experience or teaching portal. 
            Choose your role to continue your educational journey.
          </p>
        </div>
      </section>

      {/* Role Selection Cards */}
      <section className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-4xl mx-auto">
            {/* Student Dashboard Card */}
            <Card className="relative overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-[1.02] border-2 hover:border-[#8A5BB7]">
              <CardHeader className="text-center pb-4 bg-gradient-to-br from-blue-50 to-purple-50">
                <div className="mx-auto mb-6 p-4 bg-white rounded-full w-fit shadow-lg">
                  <User className="h-12 w-12 text-[#8A5BB7]" />
                </div>
                <CardTitle className="text-3xl mb-2">Student Dashboard</CardTitle>
                <CardDescription className="text-lg text-gray-600">
                  Access your courses, track progress, and continue learning
                </CardDescription>
              </CardHeader>
              <CardContent className="p-8">
                <div className="space-y-4 mb-8">
                  <div className="flex items-center text-gray-700">
                    <BookOpen className="h-5 w-5 text-[#8A5BB7] mr-3" />
                    <span>Browse and enroll in courses</span>
                  </div>
                  <div className="flex items-center text-gray-700">
                    <MessageSquare className="h-5 w-5 text-[#8A5BB7] mr-3" />
                    <span>Communicate with tutors</span>
                  </div>
                  <div className="flex items-center text-gray-700">
                    <Star className="h-5 w-5 text-[#8A5BB7] mr-3" />
                    <span>Track your learning progress</span>
                  </div>
                </div>
                <Button 
                  className="w-full bg-[#8A5BB7] hover:bg-[#8A5BB7]/90 text-lg py-6" 
                  asChild
                >
                  <Link to="/student/dashboard" className="flex items-center justify-center">
                    Enter Student Dashboard
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Tutor Dashboard Card */}
            <Card className="relative overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-[1.02] border-2 hover:border-[#8A5BB7]">
              <CardHeader className="text-center pb-4 bg-gradient-to-br from-green-50 to-blue-50">
                <div className="mx-auto mb-6 p-4 bg-white rounded-full w-fit shadow-lg">
                  <GraduationCap className="h-12 w-12 text-[#8A5BB7]" />
                </div>
                <CardTitle className="text-3xl mb-2">Tutor Dashboard</CardTitle>
                <CardDescription className="text-lg text-gray-600">
                  Manage your classes, track earnings, and teach students
                </CardDescription>
              </CardHeader>
              <CardContent className="p-8">
                <div className="space-y-4 mb-8">
                  <div className="flex items-center text-gray-700">
                    <BookOpen className="h-5 w-5 text-[#8A5BB7] mr-3" />
                    <span>Create and manage courses</span>
                  </div>
                  <div className="flex items-center text-gray-700">
                    <DollarSign className="h-5 w-5 text-[#8A5BB7] mr-3" />
                    <span>Track your earnings</span>
                  </div>
                  <div className="flex items-center text-gray-700">
                    <MessageSquare className="h-5 w-5 text-[#8A5BB7] mr-3" />
                    <span>Connect with students</span>
                  </div>
                </div>
                <Button 
                  className="w-full bg-[#8A5BB7] hover:bg-[#8A5BB7]/90 text-lg py-6" 
                  asChild
                >
                  <Link to="/tutor/dashboard" className="flex items-center justify-center">
                    Enter Tutor Dashboard
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Quick Stats Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-white/70 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-2xl font-bold text-center text-gray-900 mb-8">
            Platform Statistics
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-[#8A5BB7] mb-2">10,000+</div>
              <div className="text-gray-600">Active Students</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-[#8A5BB7] mb-2">2,500+</div>
              <div className="text-gray-600">Expert Tutors</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-[#8A5BB7] mb-2">50,000+</div>
              <div className="text-gray-600">Classes Completed</div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center mb-4">
            <GraduationCap className="h-6 w-6 text-[#8A5BB7]" />
            <span className="ml-2 text-xl font-bold">TalentSchool</span>
          </div>
          <p className="text-gray-400">
            Empowering education through technology. © 2024 TalentSchool. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;
