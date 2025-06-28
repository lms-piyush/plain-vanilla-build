
import { useState } from "react";
import { useClassSessions } from "./use-class-sessions";
import { ClassDetails } from "@/types/class-details";

export const useClassManagement = (refetch: () => void) => {
  const { deleteSession } = useClassSessions();
  
  const [sessionDialogOpen, setSessionDialogOpen] = useState(false);
  const [materialDialogOpen, setMaterialDialogOpen] = useState(false);
  const [selectedSession, setSelectedSession] = useState<any>(null);
  const [selectedMaterial, setSelectedMaterial] = useState<any>(null);
  const [selectedSessionFilter, setSelectedSessionFilter] = useState<string>('all');
  const [isNewSession, setIsNewSession] = useState(false);

  const handleEditSession = (session: any) => {
    setSelectedSession(session);
    setIsNewSession(false);
    setSessionDialogOpen(true);
  };

  const handleDeleteSession = async (sessionId: string) => {
    try {
      await deleteSession(sessionId);
      refetch();
    } catch (error) {
      console.error('Error deleting session:', error);
    }
  };

  const handleEditMaterial = (material: any) => {
    setSelectedMaterial(material);
    setMaterialDialogOpen(true);
  };

  const handleNewSession = () => {
    setSelectedSession(null);
    setIsNewSession(true);
    setSessionDialogOpen(true);
  };

  const handleNewMaterial = () => {
    setSelectedMaterial(null);
    setMaterialDialogOpen(true);
  };

  const getNextSessionNumber = (classDetails: ClassDetails | null) => {
    if (!classDetails?.class_syllabus || classDetails.class_syllabus.length === 0) {
      return 1;
    }
    return Math.max(...classDetails.class_syllabus.map(s => s.week_number || 1)) + 1;
  };

  const calculateStats = (classDetails: ClassDetails | null) => {
    const enrolledCount = classDetails?.enrolled_students?.length || 0;
    const totalSessions = classDetails?.class_syllabus?.length || 0;
    const completedSessions = totalSessions > 0 ? totalSessions - 1 : 0;
    const completionRate = totalSessions > 0 ? Math.round((completedSessions / totalSessions) * 100) : 0;

    return { enrolledCount, totalSessions, completedSessions, completionRate };
  };

  return {
    sessionDialogOpen,
    setSessionDialogOpen,
    materialDialogOpen,
    setMaterialDialogOpen,
    selectedSession,
    selectedMaterial,
    selectedSessionFilter,
    setSelectedSessionFilter,
    isNewSession,
    handleEditSession,
    handleDeleteSession,
    handleEditMaterial,
    handleNewSession,
    handleNewMaterial,
    getNextSessionNumber,
    calculateStats,
  };
};
