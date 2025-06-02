
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { GraduationCap, User, BookOpen, DollarSign, MessageSquare, Star } from 'lucide-react';

const Landing = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <GraduationCap className="h-8 w-8 text-[#8A5BB7]" />
              <h1 className="ml-2 text-2xl font-bold text-gray-900">TalentSchool</h1>
            </div>
            <div className="flex space-x-4">
              <Button variant="outline" asChild>
                <Link to="/dashboard">Dashboard</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link to="/student">Student Login</Link>
              </Button>
              <Button asChild className="bg-[#8A5BB7] hover:bg-[#8A5BB7]/90">
                <Link to="/tutor">Tutor Login</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Learn from the Best,
            <span className="text-[#8A5BB7]"> Teach with Purpose</span>
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Connect with expert tutors or share your knowledge with eager students. 
            TalentSchool makes quality education accessible to everyone.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button size="lg" asChild className="bg-[#8A5BB7] hover:bg-[#8A5BB7]/90 w-full sm:w-auto">
              <Link to="/dashboard" className="flex items-center">
                <GraduationCap className="mr-2 h-5 w-5" />
                Access Dashboard
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="border-[#8A5BB7] text-[#8A5BB7] hover:bg-[#E5D0FF] w-full sm:w-auto">
              <Link to="/student" className="flex items-center">
                <User className="mr-2 h-5 w-5" />
                Start Learning
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Why Choose TalentSchool?
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardHeader>
                <BookOpen className="h-12 w-12 text-[#8A5BB7] mx-auto mb-4" />
                <CardTitle>Expert Tutors</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Learn from experienced professionals and subject matter experts
                </CardDescription>
              </CardContent>
            </Card>
            
            <Card className="text-center">
              <CardHeader>
                <MessageSquare className="h-12 w-12 text-[#8A5BB7] mx-auto mb-4" />
                <CardTitle>Interactive Learning</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Real-time messaging and live sessions for personalized education
                </CardDescription>
              </CardContent>
            </Card>
            
            <Card className="text-center">
              <CardHeader>
                <DollarSign className="h-12 w-12 text-[#8A5BB7] mx-auto mb-4" />
                <CardTitle>Earn While Teaching</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Monetize your expertise and help students achieve their goals
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Role Selection Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Choose Your Path
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Student Card */}
            <Card className="relative overflow-hidden hover:shadow-lg transition-shadow">
              <CardHeader className="text-center pb-2">
                <div className="mx-auto mb-4 p-3 bg-[#E5D0FF] rounded-full w-fit">
                  <User className="h-8 w-8 text-[#8A5BB7]" />
                </div>
                <CardTitle className="text-2xl">I'm a Student</CardTitle>
                <CardDescription className="text-lg">
                  Ready to learn and grow
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <ul className="text-left space-y-2 mb-6">
                  <li className="flex items-center">
                    <Star className="h-4 w-4 text-[#8A5BB7] mr-2" />
                    Browse thousands of courses
                  </li>
                  <li className="flex items-center">
                    <Star className="h-4 w-4 text-[#8A5BB7] mr-2" />
                    Connect with expert tutors
                  </li>
                  <li className="flex items-center">
                    <Star className="h-4 w-4 text-[#8A5BB7] mr-2" />
                    Track your learning progress
                  </li>
                </ul>
                <Button className="w-full bg-[#8A5BB7] hover:bg-[#8A5BB7]/90" asChild>
                  <Link to="/student">Enter as Student</Link>
                </Button>
              </CardContent>
            </Card>

            {/* Tutor Card */}
            <Card className="relative overflow-hidden hover:shadow-lg transition-shadow">
              <CardHeader className="text-center pb-2">
                <div className="mx-auto mb-4 p-3 bg-[#E5D0FF] rounded-full w-fit">
                  <GraduationCap className="h-8 w-8 text-[#8A5BB7]" />
                </div>
                <CardTitle className="text-2xl">I'm a Tutor</CardTitle>
                <CardDescription className="text-lg">
                  Ready to share knowledge
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <ul className="text-left space-y-2 mb-6">
                  <li className="flex items-center">
                    <Star className="h-4 w-4 text-[#8A5BB7] mr-2" />
                    Create and manage courses
                  </li>
                  <li className="flex items-center">
                    <Star className="h-4 w-4 text-[#8A5BB7] mr-2" />
                    Earn from your expertise
                  </li>
                  <li className="flex items-center">
                    <Star className="h-4 w-4 text-[#8A5BB7] mr-2" />
                    Build your teaching reputation
                  </li>
                </ul>
                <Button className="w-full bg-[#8A5BB7] hover:bg-[#8A5BB7]/90" asChild>
                  <Link to="/tutor">Enter as Tutor</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
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

export default Landing;
