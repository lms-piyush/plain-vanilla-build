
import { DayOfWeek } from "./types";

// Default time slots for auto-fill
export const defaultTimeSlots = [
  {
    dayOfWeek: "monday" as DayOfWeek,
    startTime: "18:00",
    endTime: "19:30"
  },
  {
    dayOfWeek: "wednesday" as DayOfWeek,
    startTime: "18:00",
    endTime: "19:30"
  }
];

// Default syllabus data for auto-fill - now includes all required LessonItem properties
export const defaultSyllabus = [
  {
    id: "lesson-1",
    title: "Introduction to Programming Fundamentals",
    description: "Basic concepts of programming, variables, data types, and setting up the development environment",
    weekNumber: 1,
    learningObjectives: ["Understand basic programming concepts", "Set up development environment", "Learn about variables and data types"],
    startTime: "18:00",
    endTime: "19:30",
    status: "upcoming",
    notes: "Bring laptop and install required software"
  },
  {
    id: "lesson-2",
    title: "Control Structures and Logic",
    description: "Loops, conditionals, flow control, and building logical thinking in programming",
    weekNumber: 2,
    learningObjectives: ["Master if/else statements", "Understand loops", "Build logical thinking"],
    startTime: "18:00",
    endTime: "19:30",
    status: "upcoming",
    notes: "Practice exercises will be provided"
  },
  {
    id: "lesson-3",
    title: "Functions and Modular Programming",
    description: "Creating reusable code blocks, understanding scope, and building modular applications",
    weekNumber: 3,
    learningObjectives: ["Create and use functions", "Understand scope", "Build modular code"],
    startTime: "18:00",
    endTime: "19:30",
    status: "upcoming",
    notes: "Focus on code organization"
  },
  {
    id: "lesson-4",
    title: "Object-Oriented Programming Concepts",
    description: "Classes, objects, inheritance, polymorphism, and encapsulation principles",
    weekNumber: 4,
    learningObjectives: ["Understand OOP concepts", "Create classes and objects", "Apply inheritance"],
    startTime: "18:00",
    endTime: "19:30",
    status: "upcoming",
    notes: "Advanced programming concepts"
  },
  {
    id: "lesson-5",
    title: "Final Project and Portfolio Development",
    description: "Creating a complete application using all learned concepts and building a professional portfolio",
    weekNumber: 5,
    learningObjectives: ["Complete final project", "Build portfolio", "Demonstrate skills"],
    startTime: "18:00",
    endTime: "19:30",
    status: "upcoming",
    notes: "Project presentation required"
  }
];

// Default materials data for auto-fill
export const defaultMaterials = [
  {
    name: "Course Handbook & Setup Guide",
    type: "pdf",
    url: "https://example.com/handbook.pdf",
    lessonIndex: 0
  },
  {
    name: "Starter Code Repository",
    type: "link",
    url: "https://github.com/example/starter-code",
    lessonIndex: 1
  },
  {
    name: "Practice Exercises Collection",
    type: "pdf",
    url: "https://example.com/exercises.pdf",
    lessonIndex: 2
  },
  {
    name: "OOP Examples and Templates",
    type: "link",
    url: "https://github.com/example/oop-examples",
    lessonIndex: 3
  }
];
