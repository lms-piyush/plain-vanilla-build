
import { LectureType } from "@/types/lecture-types";
import { ClassCreationState } from "@/hooks/use-class-creation-store";

// Auto-fill configurations for different class types
export const classTypeConfigs: Record<LectureType, Partial<ClassCreationState>> = {
  "online-live-one-on-one": {
    deliveryMode: "online",
    classFormat: "live",
    classSize: "one-on-one",
    durationType: "recurring",
    meetingLink: "https://zoom.us/j/1234567890?pwd=abcdefghijklmnopqrstuvwxyz",
    maxStudents: 1
  },
  "online-live-group": {
    deliveryMode: "online",
    classFormat: "live",
    classSize: "group",
    durationType: "recurring",
    meetingLink: "https://zoom.us/j/1234567890?pwd=abcdefghijklmnopqrstuvwxyz",
    maxStudents: 15
  },
  "online-recorded-one-on-one": {
    deliveryMode: "online",
    classFormat: "recorded",
    classSize: "one-on-one",
    durationType: "recurring",
    maxStudents: 1
  },
  "online-recorded-group": {
    deliveryMode: "online",
    classFormat: "recorded",
    classSize: "group",
    durationType: "recurring",
    maxStudents: 25
  },
  "offline-inbound-one-on-one": {
    deliveryMode: "offline",
    classFormat: "inbound",
    classSize: "one-on-one",
    durationType: "recurring",
    maxStudents: 1,
    address: {
      street: "123 Student St",
      city: "San Francisco",
      state: "CA",
      zipCode: "94105",
      country: "United States"
    }
  },
  "offline-outbound-one-on-one": {
    deliveryMode: "offline",
    classFormat: "outbound",
    classSize: "one-on-one",
    durationType: "recurring",
    maxStudents: 1,
    address: {
      street: "456 Tutor St",
      city: "San Francisco",
      state: "CA",
      zipCode: "94105",
      country: "United States"
    }
  },
  "offline-outbound-group": {
    deliveryMode: "offline",
    classFormat: "outbound",
    classSize: "group",
    durationType: "recurring",
    maxStudents: 12,
    address: {
      street: "456 Tutor St",
      city: "San Francisco",
      state: "CA",
      zipCode: "94105",
      country: "United States"
    }
  },
  // Legacy type mappings for backward compatibility
  "live-one-on-one": {
    deliveryMode: "online",
    classFormat: "live",
    classSize: "one-on-one",
    durationType: "recurring",
    meetingLink: "https://zoom.us/j/1234567890?pwd=abcdefghijklmnopqrstuvwxyz",
    maxStudents: 1
  },
  "live-group": {
    deliveryMode: "online",
    classFormat: "live",
    classSize: "group",
    durationType: "recurring",
    meetingLink: "https://zoom.us/j/1234567890?pwd=abcdefghijklmnopqrstuvwxyz",
    maxStudents: 15
  },
  "recorded-on-demand": {
    deliveryMode: "online",
    classFormat: "recorded",
    classSize: "group",
    durationType: "recurring",
    maxStudents: 50
  },
  "offline-student-travels": {
    deliveryMode: "offline",
    classFormat: "outbound",
    classSize: "group",
    durationType: "recurring",
    maxStudents: 8,
    address: {
      street: "456 Tutor St",
      city: "San Francisco",
      state: "CA",
      zipCode: "94105",
      country: "United States"
    }
  },
  "offline-tutor-travels": {
    deliveryMode: "offline",
    classFormat: "inbound",
    classSize: "one-on-one",
    durationType: "recurring",
    maxStudents: 1,
    address: {
      street: "123 Student St",
      city: "San Francisco",
      state: "CA",
      zipCode: "94105",
      country: "United States"
    }
  }
};
