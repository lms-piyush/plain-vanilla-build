
import { useNavigate } from "react-router-dom";
import { useCreateConversation } from "@/hooks/use-messages";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useMessageNavigation = () => {
  const navigate = useNavigate();
  const createConversation = useCreateConversation();
  const { toast } = useToast();

  const handleMessageTutor = async (tutorId: string, classId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Authentication required",
          description: "Please log in to send messages",
          variant: "destructive",
        });
        return;
      }

      // Create or get existing conversation
      const conversation = await createConversation.mutateAsync({
        studentId: user.id,
        tutorId,
        classId,
      });

      // Navigate to messages with the conversation ID
      navigate(`/student/messages?conversation=${conversation.id}`);
    } catch (error: any) {
      console.error("Error creating conversation:", error);
      toast({
        title: "Error",
        description: "Failed to start conversation. Please try again.",
        variant: "destructive",
      });
    }
  };

  return { handleMessageTutor, isLoading: createConversation.isPending };
};
