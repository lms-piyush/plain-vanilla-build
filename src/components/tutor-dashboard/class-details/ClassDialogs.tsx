
import SessionDialog from "../SessionDialog";
import MaterialDialog from "../MaterialDialog";
import { ClassDetails } from "@/types/class-details";

interface ClassDialogsProps {
  classDetails: ClassDetails;
  classId: string;
  sessionDialogOpen: boolean;
  setSessionDialogOpen: (open: boolean) => void;
  materialDialogOpen: boolean;
  setMaterialDialogOpen: (open: boolean) => void;
  selectedSession: any;
  selectedMaterial: any;
  isNewSession: boolean;
  nextSessionNumber: number;
  onSuccess: () => void;
}

const ClassDialogs = ({
  classDetails,
  classId,
  sessionDialogOpen,
  setSessionDialogOpen,
  materialDialogOpen,
  setMaterialDialogOpen,
  selectedSession,
  selectedMaterial,
  isNewSession,
  nextSessionNumber,
  onSuccess,
}: ClassDialogsProps) => {
  return (
    <>
      <SessionDialog
        open={sessionDialogOpen}
        onOpenChange={setSessionDialogOpen}
        session={selectedSession}
        classId={classId}
        isNewSession={isNewSession}
        nextSessionNumber={nextSessionNumber}
        classDetails={classDetails}
        onSuccess={() => {
          onSuccess();
          setSessionDialogOpen(false);
        }}
      />

      <MaterialDialog
        open={materialDialogOpen}
        onOpenChange={setMaterialDialogOpen}
        material={selectedMaterial}
        classId={classId}
        sessions={classDetails.class_syllabus || []}
        onSuccess={() => {
          onSuccess();
          setMaterialDialogOpen(false);
        }}
      />
    </>
  );
};

export default ClassDialogs;
