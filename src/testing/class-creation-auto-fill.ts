
import { ClassCreationState } from "@/hooks/use-class-creation-store";
import { LectureType } from "@/types/lecture-types";
import { classTypeConfigs } from "./configs";
import { delay, scrollToTop, generateTestData } from "./utils";
import { defaultTimeSlots, defaultSyllabus, defaultMaterials } from "./curriculum-data";

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
  updateFormState({ startDate: new Date(testData.startDate) });
  await delay(100);
  updateFormState({ endDate: new Date(testData.endDate) });
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
  
  // Create proper LessonItem objects with all required properties
  const completeSyllabus = defaultSyllabus.map((item, index) => ({
    id: item.id,
    title: item.title,
    description: item.description,
    weekNumber: index + 1,
    learningObjectives: item.learningObjectives || [],
    sessionDate: item.sessionDate,
    startTime: item.startTime || "09:00",
    endTime: item.endTime || "10:00",
    status: item.status || "upcoming",
    notes: item.notes || ""
  }));
  
  // Add syllabus items quickly
  await delay(100);
  updateFormState({ syllabus: [completeSyllabus[0]] });
  await delay(100);
  updateFormState({ syllabus: completeSyllabus.slice(0, 2) });
  await delay(100);
  updateFormState({ syllabus: completeSyllabus.slice(0, 3) });
  await delay(100);
  updateFormState({ syllabus: completeSyllabus.slice(0, 4) });
  await delay(100);
  updateFormState({ syllabus: completeSyllabus });
  
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
