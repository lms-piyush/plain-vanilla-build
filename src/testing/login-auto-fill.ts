
import { delay } from "./utils";

// Login auto-fill functions with faster execution
export const autoFillLogin = async (
  role: "student" | "tutor", 
  setValue: (field: string, value: any) => void,
  submit: () => void
) => {
  console.log(`Starting auto-fill for ${role} login...`);
  
  // Fill email field
  setValue("email", role === "tutor" ? "tutor@example.com" : "student@example.com");
  await delay(100);
  
  // Fill password field
  setValue("password", "password123");
  await delay(100);
  
  // Select role
  setValue("role", role);
  await delay(100);
  
  // Check "Remember me"
  setValue("rememberMe", true);
  await delay(100);
  
  // Submit the form
  submit();
};
