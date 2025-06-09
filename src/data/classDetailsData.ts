
import { LectureType } from "@/types/lecture-types";

export interface ClassData {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  category: string;
  subcategory: string;
  level: string;
  ageRange: string;
  image: string;
  rating: number;
  reviewCount: number;
  price: number;
  priceInterval: string;
  duration: string;
  schedule: string;
  startDate: string;
  spotsAvailable: number;
  totalSpots: number;
  lectureType: LectureType;
  location: string | null;
  tutor: {
    id: string;
    name: string;
    title: string;
    image: string;
    bio: string;
    rating: number;
    classesCount: number;
    studentsCount: number;
    verified: boolean;
  };
  learningObjectives: string[];
  syllabus: Array<{
    week: number;
    title: string;
    description: string;
  }>;
  reviews: Array<{
    id: number;
    user: string;
    avatar: string;
    rating: number;
    date: string;
    comment: string;
  }>;
  requirements: string[];
  faqs: Array<{
    question: string;
    answer: string;
  }>;
}

export const classData: ClassData = {
  id: "python-101",
  title: "Introduction to Python Programming",
  subtitle: "Learn the fundamentals of Python coding in a fun, engaging environment",
  description: "This interactive course introduces children ages 10-14 to the world of programming through Python. Students will learn basic programming concepts like variables, loops, and conditionals while building their own games and applications. No prior coding experience is necessary!",
  category: "technology-coding",
  subcategory: "Programming",
  level: "Beginner",
  ageRange: "10-14 years",
  image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&w=800&h=500&fit=crop",
  rating: 4.9,
  reviewCount: 126,
  price: 149,
  priceInterval: "month",
  duration: "8 weeks",
  schedule: "Tuesdays and Thursdays, 4:00 PM - 5:00 PM ET",
  startDate: "June 15, 2023",
  spotsAvailable: 5,
  totalSpots: 12,
  lectureType: "live-group" as LectureType,
  location: null,
  tutor: {
    id: "michael-chen",
    name: "Michael Chen",
    title: "Computer Science Educator",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=michael",
    bio: "Michael has 7+ years of experience teaching computer science to young learners. He holds a Master's in Computer Science and is passionate about making coding accessible to children.",
    rating: 4.8,
    classesCount: 48,
    studentsCount: 530,
    verified: true
  },
  learningObjectives: [
    "Understand fundamental programming concepts",
    "Write and execute Python code",
    "Build interactive games and applications",
    "Solve problems using computational thinking",
    "Develop debugging skills"
  ],
  syllabus: [
    {
      week: 1,
      title: "Getting Started with Python",
      description: "Introduction to Python, setting up the environment, writing your first program."
    },
    {
      week: 2,
      title: "Variables and Data Types",
      description: "Working with numbers, strings, and basic operations."
    },
    {
      week: 3,
      title: "Control Flow",
      description: "Conditionals, if-statements, and decision making in programs."
    },
    {
      week: 4,
      title: "Loops and Iteration",
      description: "For loops, while loops, and iterating through data."
    },
    {
      week: 5,
      title: "Functions and Modules",
      description: "Creating reusable code with functions and importing modules."
    },
    {
      week: 6,
      title: "Lists and Dictionaries",
      description: "Working with collections of data."
    },
    {
      week: 7,
      title: "Building a Simple Game",
      description: "Apply concepts to build a text-based adventure game."
    },
    {
      week: 8,
      title: "Final Project",
      description: "Create a personal project and showcase your skills."
    }
  ],
  reviews: [
    {
      id: 1,
      user: "Jennifer L.",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=jennifer",
      rating: 5,
      date: "May 2, 2023",
      comment: "My son absolutely loves this class! Michael makes programming fun and engaging. He's now building his own games at home."
    },
    {
      id: 2,
      user: "David W.",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=david",
      rating: 5,
      date: "April 15, 2023",
      comment: "Excellent introduction to Python. The pacing is perfect for beginners and my daughter looks forward to every class."
    },
    {
      id: 3,
      user: "Sarah M.",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sarah",
      rating: 4,
      date: "March 28, 2023",
      comment: "Great curriculum and teaching style. My only suggestion would be to provide more practice exercises between classes."
    }
  ],
  requirements: [
    "Computer or laptop with internet connection",
    "No prior coding experience required",
    "Basic typing skills",
    "Enthusiasm for learning!"
  ],
  faqs: [
    {
      question: "Is this class suitable for complete beginners?",
      answer: "Yes, this class is designed specifically for beginners with no prior coding experience."
    },
    {
      question: "What if my child misses a class?",
      answer: "All classes are recorded and made available for 30 days, so students can catch up on any missed sessions."
    },
    {
      question: "What software will we need to install?",
      answer: "We'll provide detailed setup instructions before the class begins. We use free, beginner-friendly tools that work on both Windows and Mac."
    },
    {
      question: "Is there homework between classes?",
      answer: "Yes, students will have optional practice exercises to reinforce what they've learned. These typically take 30-45 minutes per week."
    }
  ]
};
