import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export const useClassBatchOperations = () => {
  const [isCreatingBatch, setIsCreatingBatch] = useState(false);

  const createClassBatch = async (originalClassId: string) => {
    if (isCreatingBatch) return null;

    setIsCreatingBatch(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error("User not authenticated");
      }

      const { data: classId, error } = await supabase.rpc(
        'create_class_batch',
        {
          original_class_id: originalClassId,
          tutor_id_param: user.id
        }
      );

      if (error) {
        console.error('Error creating class batch:', error);
        throw error;
      }

      toast({
        title: "Success",
        description: "Class batch incremented successfully! You can now edit and publish the new batch.",
      });

      return classId;
    } catch (error: any) {
      console.error("Error creating class batch:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to increment class batch",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsCreatingBatch(false);
    }
  };

  const checkStudentEnrollmentInCurrentBatch = async (classId: string, studentId: string) => {
    try {
      // Get the latest batch number for this class
      const { data: latestBatch } = await supabase
        .from("classes")
        .select("batch_number")
        .eq("id", classId)
        .order("batch_number", { ascending: false })
        .limit(1)
        .single();

      if (!latestBatch) return false;

      // Check if student is enrolled in the latest batch
      const { data: enrollment } = await supabase
        .from("student_enrollments")
        .select("id")
        .eq("class_id", classId)
        .eq("student_id", studentId)
        .eq("batch_number", latestBatch.batch_number)
        .single();

      return !!enrollment;
    } catch (error) {
      console.error("Error checking enrollment:", error);
      return false;
    }
  };

  return {
    createClassBatch,
    checkStudentEnrollmentInCurrentBatch,
    isCreatingBatch,
  };
};