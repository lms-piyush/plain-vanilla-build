
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

// Default syllabus data for auto-fill
export const defaultSyllabus = [
  {
    title: "Introduction to Programming Fundamentals",
    description: "Basic concepts of programming, variables, data types, and setting up the development environment"
  },
  {
    title: "Control Structures and Logic",
    description: "Loops, conditionals, flow control, and building logical thinking in programming"
  },
  {
    title: "Functions and Modular Programming",
    description: "Creating reusable code blocks, understanding scope, and building modular applications"
  },
  {
    title: "Object-Oriented Programming Concepts",
    description: "Classes, objects, inheritance, polymorphism, and encapsulation principles"
  },
  {
    title: "Final Project and Portfolio Development",
    description: "Creating a complete application using all learned concepts and building a professional portfolio"
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
