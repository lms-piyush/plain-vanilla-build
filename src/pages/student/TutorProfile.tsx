import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import CourseCard from '@/components/dashboard/CourseCard';
import { 
  ArrowLeft, 
  Book, 
  Star, 
  Users, 
  Globe, 
  Clock 
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  ResponsiveContainer, 
  Legend 
} from 'recharts';

// Mock data for the tutor profile
const tutorData = {
  tutor1: {
    id: 'tutor1',
    name: 'Dr. Alex Johnson',
    profileImage: undefined,
    qualifications: 'PhD in Mathematics, Stanford University',
    bio: 'Dr. Johnson is a passionate mathematician with over 15 years of teaching experience. Specializes in calculus, differential equations, and advanced algebra.',
    yearsExperience: 15,
    languages: ['English', 'Spanish', 'French'],
    totalCourses: 8,
    averageRating: 4.8,
    totalStudents: 520,
    monthlyEngagement: [
      { month: 'Jan', students: 42 },
      { month: 'Feb', students: 48 },
      { month: 'Mar', students: 53 },
      { month: 'Apr', students: 57 },
      { month: 'May', students: 62 },
      { month: 'Jun', students: 58 }
    ],
    ratings: [
      { month: 'Jan', offlineRating: 4.5, onlineRating: 4.6 },
      { month: 'Feb', offlineRating: 4.6, onlineRating: 4.7 },
      { month: 'Mar', offlineRating: 4.6, onlineRating: 4.7 },
      { month: 'Apr', offlineRating: 4.7, onlineRating: 4.8 },
      { month: 'May', offlineRating: 4.8, onlineRating: 4.9 },
      { month: 'Jun', offlineRating: 4.7, onlineRating: 4.8 }
    ],
    courses: [
      {
        id: 'course1',
        title: 'Calculus Fundamentals',
        tutor: 'Dr. Alex Johnson',
        rating: 4.9,
        image: 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&w=300',
        description: 'Master the basics of calculus with this comprehensive course designed for beginners.',
        mode: 'Online',
        format: 'Live',
        classSize: 'Group',
        students: 42,
        price: '₹4,500',
        isSubscription: false,
      },
      {
        id: 'course2',
        title: 'Advanced Differential Equations',
        tutor: 'Dr. Alex Johnson',
        rating: 4.7,
        image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=300',
        description: 'Dive deep into solving complex differential equations with practical applications.',
        mode: 'Online',
        format: 'Recorded',
        classSize: '1-on-1',
        price: '₹6,000/month',
        isSubscription: true,
      },
      {
        id: 'course3',
        title: 'Linear Algebra for Machine Learning',
        tutor: 'Dr. Alex Johnson',
        rating: 4.8,
        image: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=300',
        description: 'Learn the essential linear algebra concepts required for understanding machine learning algorithms.',
        mode: 'Offline',
        format: 'Inbound',
        classSize: 'Group',
        students: 15,
        price: '₹7,500',
        isSubscription: false,
      }
    ]
  },
  tutor2: {
    id: 'tutor2',
    name: 'Prof. Sarah Williams',
    profileImage: undefined,
    qualifications: 'PhD in Physics, MIT',
    bio: 'Experienced physics professor with a focus on quantum mechanics and theoretical physics. Known for making complex concepts accessible to students.',
    yearsExperience: 12,
    languages: ['English', 'German'],
    totalCourses: 5,
    averageRating: 4.6,
    totalStudents: 380,
    monthlyEngagement: [
      { month: 'Jan', students: 35 },
      { month: 'Feb', students: 38 },
      { month: 'Mar', students: 42 },
      { month: 'Apr', students: 46 },
      { month: 'May', students: 50 },
      { month: 'Jun', students: 52 }
    ],
    ratings: [
      { month: 'Jan', offlineRating: 4.4, onlineRating: 4.5 },
      { month: 'Feb', offlineRating: 4.4, onlineRating: 4.5 },
      { month: 'Mar', offlineRating: 4.5, onlineRating: 4.6 },
      { month: 'Apr', offlineRating: 4.5, onlineRating: 4.6 },
      { month: 'May', offlineRating: 4.6, onlineRating: 4.7 },
      { month: 'Jun', offlineRating: 4.5, onlineRating: 4.6 }
    ],
    courses: [
      {
        id: 'course4',
        title: 'Quantum Mechanics: An Introduction',
        tutor: 'Prof. Sarah Williams',
        rating: 4.6,
        image: 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&w=300',
        description: 'Explore the fascinating world of quantum mechanics in this introductory course.',
        mode: 'Online',
        format: 'Live',
        classSize: 'Group',
        students: 38,
        price: '₹5,500',
        isSubscription: false,
      },
      {
        id: 'course5',
        title: 'Classical Mechanics Deep Dive',
        tutor: 'Prof. Sarah Williams',
        rating: 4.7,
        image: 'https://images.unsplash.com/photo-1500673922987-e212871fec22?auto=format&fit=crop&w=300',
        description: 'Advanced exploration of Newtonian mechanics and its applications in various physical systems.',
        mode: 'Online',
        format: 'Recorded',
        classSize: 'Group',
        students: 25,
        price: '₹4,000',
        isSubscription: false,
      }
    ]
  },
  tutor3: {
    id: 'tutor3',
    name: 'Michael Chen',
    profileImage: undefined,
    qualifications: 'MS in Computer Science, UC Berkeley',
    bio: 'Full-stack developer and educator specializing in web development, algorithms, and software engineering principles. Creates practical, project-based learning experiences.',
    yearsExperience: 8,
    languages: ['English', 'Mandarin', 'Cantonese'],
    totalCourses: 7,
    averageRating: 4.9,
    totalStudents: 430,
    monthlyEngagement: [
      { month: 'Jan', students: 40 },
      { month: 'Feb', students: 45 },
      { month: 'Mar', students: 52 },
      { month: 'Apr', students: 58 },
      { month: 'May', students: 65 },
      { month: 'Jun', students: 72 }
    ],
    ratings: [
      { month: 'Jan', offlineRating: 4.7, onlineRating: 4.8 },
      { month: 'Feb', offlineRating: 4.7, onlineRating: 4.8 },
      { month: 'Mar', offlineRating: 4.8, onlineRating: 4.9 },
      { month: 'Apr', offlineRating: 4.8, onlineRating: 4.9 },
      { month: 'May', offlineRating: 4.8, onlineRating: 4.9 },
      { month: 'Jun', offlineRating: 4.9, onlineRating: 5.0 }
    ],
    courses: [
      {
        id: 'course6',
        title: 'Full Stack Web Development',
        tutor: 'Michael Chen',
        rating: 4.9,
        image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=300',
        description: 'Comprehensive course covering both frontend and backend technologies for modern web development.',
        mode: 'Online',
        format: 'Live',
        classSize: 'Group',
        students: 45,
        price: '₹8,000',
        isSubscription: false,
      },
      {
        id: 'course7',
        title: 'Data Structures & Algorithms',
        tutor: 'Michael Chen',
        rating: 4.8,
        image: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=300',
        description: 'Master essential algorithms and data structures used in software development and technical interviews.',
        mode: 'Online',
        format: 'Recorded',
        classSize: '1-on-1',
        price: '₹6,500/month',
        isSubscription: true,
      },
      {
        id: 'course8',
        title: 'Mobile App Development',
        tutor: 'Michael Chen',
        rating: 4.7,
        image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=300',
        description: 'Learn to build cross-platform mobile applications using modern frameworks and best practices.',
        mode: 'Offline',
        format: 'Outbound',
        classSize: '1-on-1',
        price: '₹9,000',
        isSubscription: false,
      }
    ]
  }
};

type TutorId = keyof typeof tutorData;

const TutorProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // Get tutor data based on ID from the URL
  const tutor = id && tutorData[id as TutorId] ? tutorData[id as TutorId] : null;
  
  if (!tutor) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-4rem)] p-6">
        <h1 className="text-2xl font-bold mb-4">Tutor Not Found</h1>
        <p className="mb-6">The tutor profile you're looking for doesn't exist or has been removed.</p>
        <Button 
          onClick={() => navigate(-1)} 
          className="bg-[#8A5BB7] hover:bg-[#8A5BB7]/90"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Go Back
        </Button>
      </div>
    );
  }
  
  // Render star rating
  const renderStarRating = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating - fullStars >= 0.5;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={`full-${i}`} className="h-4 w-4 fill-yellow-400 text-yellow-400" />);
    }
    
    if (hasHalfStar) {
      stars.push(
        <div key="half" className="relative">
          <Star className="h-4 w-4 text-yellow-400" />
          <div className="absolute top-0 left-0 overflow-hidden w-1/2">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
          </div>
        </div>
      );
    }
    
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="h-4 w-4 text-gray-300" />);
    }
    
    return stars;
  };
  
  return (
    <div className="p-6">
      <Button 
        variant="ghost" 
        className="mb-6" 
        onClick={() => navigate(-1)}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back
      </Button>
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-8">
        <Avatar className="h-24 w-24 md:h-32 md:w-32">
          <AvatarImage src={tutor.profileImage} />
          <AvatarFallback className="bg-[#8A5BB7] text-white text-4xl">
            {tutor.name.charAt(0)}
          </AvatarFallback>
        </Avatar>
        
        <div className="text-center md:text-left">
          <h1 className="text-3xl font-bold">{tutor.name}</h1>
          <p className="text-lg text-muted-foreground">{tutor.qualifications}</p>
        </div>
      </div>
      
      {/* Basic Info Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>About the Tutor</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>{tutor.bio}</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-[#8A5BB7]" />
                <div>
                  <p className="font-medium">Years of Experience</p>
                  <p className="text-muted-foreground">{tutor.yearsExperience} years</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-[#8A5BB7]" />
                <div>
                  <p className="font-medium">Languages Spoken</p>
                  <p className="text-muted-foreground">{tutor.languages.join(', ')}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Statistics Card */}
        <Card className="h-full">
          <CardHeader>
            <CardTitle>Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center">
                  <Book className="h-6 w-6 text-[#8A5BB7]" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Courses</p>
                  <p className="text-2xl font-bold">{tutor.totalCourses}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-yellow-100 flex items-center justify-center">
                  <Star className="h-6 w-6 text-yellow-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Average Rating</p>
                  <div className="flex items-center">
                    <p className="text-2xl font-bold mr-2">{tutor.averageRating}</p>
                    <div className="flex">
                      {renderStarRating(tutor.averageRating)}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                  <Users className="h-6 w-6 text-blue-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Students</p>
                  <p className="text-2xl font-bold">{tutor.totalStudents}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Charts Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Monthly Student Engagement</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={tutor.monthlyEngagement} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <RechartsTooltip 
                  formatter={(value) => [`${value} students`, 'Engagement']}
                  labelFormatter={(label) => `${label} 2025`}
                />
                <Bar dataKey="students" fill="#8A5BB7" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Rating Trends</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={tutor.ratings} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis domain={[4, 5]} />
                <RechartsTooltip 
                  formatter={(value) => [`${value}/5.0`, 'Rating']}
                  labelFormatter={(label) => `${label} 2025`}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="onlineRating" 
                  name="Online Classes"
                  stroke="#8A5BB7" 
                  activeDot={{ r: 8 }} 
                  strokeWidth={2}
                />
                <Line 
                  type="monotone" 
                  dataKey="offlineRating" 
                  name="Offline Classes"
                  stroke="#36A2EB" 
                  activeDot={{ r: 8 }} 
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
      
      {/* Courses by this Tutor Section */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Courses by this Tutor</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tutor.courses && tutor.courses.map((course) => (
            <CourseCard
              key={course.id}
              id={course.id}
              title={course.title}
              tutor={course.tutor}
              tutorId={tutor.id}
              rating={course.rating}
              image={course.image}
              description={course.description}
              mode={course.mode}
              format={course.format}
              classSize={course.classSize}
              students={course.students}
              price={course.price}
              isSubscription={course.isSubscription}
              onClick={() => navigate(`/classes/${course.id}`)}
              onTutorClick={() => {}} // No need to navigate as we're already on tutor page
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default TutorProfile;
