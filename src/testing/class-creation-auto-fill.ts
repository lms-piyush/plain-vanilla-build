
import { ClassCreationState } from "@/hooks/use-class-creation-store";
import { LectureType } from "@/types/lecture-types";
import { classTypeConfigs } from "./configs";
import { delay, scrollToTop, generateTestData } from "./utils";
import { defaultTimeSlots, defaultMaterials } from "./curriculum-data";

// Default syllabus with proper structure
const defaultSyllabus = [
  {
    title: "Introduction to Course",
    description: "Course overview and objectives",
    learningObjectives: ["Understand course structure", "Set learning goals"],
    weekNumber: 1,
    sessionDate: "2024-01-15",
    startTime: "10:00",
    endTime: "11:00",
    status: "upcoming",
    notes: "Bring notebook"
  },
  {
    title: "Core Concepts",
    description: "Fundamental concepts and principles",
    learningObjectives: ["Master basic concepts", "Apply principles"],
    weekNumber: 2,
    sessionDate: "2024-01-22",
    startTime: "10:00",
    endTime: "11:00",
    status: "upcoming",
    notes: "Review materials"
  },
  {
    title: "Practical Applications",
    description: "Hands-on practice and exercises",
    learningObjectives: ["Practice skills", "Build confidence"],
    weekNumber: 3,
    sessionDate: "2024-01-29",
    startTime: "10:00",
    endTime: "11:00",
    status: "upcoming",
    notes: "Interactive session"
  },
  {
    title: "Advanced Topics",
    description: "Deep dive into advanced concepts",
    learningObjectives: ["Understand advanced topics", "Critical thinking"],
    weekNumber: 4,
    sessionDate: "2024-02-05",
    startTime: "10:00",
    endTime: "11:00",
    status: "upcoming",
    notes: "Prepare questions"
  }
];

// Auto-fill data for the class creation form with faster typing effects
export const autoFillClassCreation = async (
  classType: LectureType,
  setStep: (step: number) => void, 
  updateFormState: (state: Partial<ClassCreationState>) => void
) => {
  console.log(`Starting auto-fill for ${classType} class creation...`);
  
  // Get class-type specific configuration
  const typeConfig = classTypeConfigs[classType];
  
  if (!typeConfig) {
    console.error(`No configuration found for class type: ${classType}`);
    return;
  }
  
  const testData = generateTestData(classType);
  
  // Scroll to top of form to ensure visibility
  scrollToTop();
  
  // Step 1: Delivery & Type - Fill with minimal delays to simulate faster typing
  console.log("Step 1: Filling Delivery & Type");
  await delay(100);
  updateFormState({ deliveryMode: typeConfig.deliveryMode });
  await delay(100);
  updateFormState({ classFormat: typeConfig.classFormat });
  await delay(100);
  updateFormState({ classSize: typeConfig.classSize });
  await delay(100);
  updateFormState({ durationType: typeConfig.durationType });
  await delay(200);
  setStep(1);
  
  // Ensure form is visible after step change
  scrollToTop();
  
  // Step 2: Details - Fill fields with minimal delays
  console.log("Step 2: Filling Details");
  await delay(100);
  updateFormState({ title: testData.title });
  await delay(100);
  updateFormState({ subject: testData.subject });
  await delay(100);
  updateFormState({ description: testData.description });
  await delay(100);
  updateFormState({ thumbnailUrl: testData.thumbnailUrl });
  await delay(200);
  setStep(2);
  
  // Ensure form is visible after step change
  scrollToTop();
  
  // Step 3: Schedule - Fill with minimal delays
  console.log("Step 3: Filling Schedule");
  await delay(100);
  updateFormState({ frequency: testData.frequency });
  await delay(100);
  updateFormState({ startDate: testData.startDate });
  await delay(100);
  updateFormState({ endDate: testData.endDate });
  await delay(100);
  updateFormState({ totalSessions: testData.totalSessions });
  await delay(100);
  
  // Add time slots quickly
  updateFormState({ timeSlots: [defaultTimeSlots[0]] });
  await delay(100);
  updateFormState({ timeSlots: defaultTimeSlots });
  await delay(200);
  setStep(3);
  
  // Ensure form is visible after step change
  scrollToTop();
  
  // Step 4: Pricing & Capacity
  console.log("Step 4: Filling Pricing & Capacity");
  await delay(100);
  updateFormState({ price: testData.price });
  await delay(100);
  updateFormState({ currency: testData.currency });
  await delay(100);
  updateFormState({ maxStudents: typeConfig.maxStudents });
  await delay(100);
  updateFormState({ autoRenewal: testData.autoRenewal });
  await delay(200);
  setStep(4);
  
  // Ensure form is visible after step change
  scrollToTop();
  
  // Step 5: Location/Links
  console.log("Step 5: Filling Location/Links");
  if (typeConfig.deliveryMode === "online") {
    await delay(100);
    updateFormState({
      meetingLink: typeConfig.meetingLink || "https://zoom.us/j/1234567890?pwd=abcdefghijklmnopqrstuvwxyz"
    });
  } else {
    // Fill address fields quickly for offline classes
    const address = typeConfig.address || {
      street: "123 Main St",
      city: "San Francisco",
      state: "CA",
      zipCode: "94105",
      country: "United States"
    };
    
    await delay(100);
    updateFormState({ address });
  }
  await delay(200);
  setStep(5);
  
  // Ensure form is visible after step change
  scrollToTop();
  
  // Step 6: Curriculum
  console.log("Step 6: Filling Curriculum");
  // Add syllabus items quickly with proper structure
  await delay(100);
  updateFormState({ syllabus: [defaultSyllabus[0]] });
  await delay(100);
  updateFormState({ syllabus: defaultSyllabus.slice(0, 2) });
  await delay(100);
  updateFormState({ syllabus: defaultSyllabus.slice(0, 3) });
  await delay(100);
  updateFormState({ syllabus: defaultSyllabus });
  
  // Add materials quickly with lessonIndex
  await delay(100);
  updateFormState({ materials: [defaultMaterials[0]] });
  await delay(100);
  updateFormState({ materials: defaultMaterials.slice(0, 2) });
  await delay(100);
  updateFormState({ materials: defaultMaterials.slice(0, 3) });
  await delay(100);
  updateFormState({ materials: defaultMaterials });
  await delay(200);
  setStep(6);
  
  console.log("Auto-fill complete!");
};
