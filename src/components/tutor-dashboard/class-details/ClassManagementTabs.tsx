
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SessionsTab from "./SessionsTab";
import StudentsTab from "./StudentsTab";
import MaterialsTab from "./MaterialsTab";
import ClassSettingsCard from "./ClassSettingsCard";
import { ClassDetails } from "@/types/class-details";

interface ClassManagementTabsProps {
  classDetails: ClassDetails;
  selectedSessionFilter: string;
  onSessionFilterChange: (filter: string) => void;
  onEditSession: (session: any) => void;
  onDeleteSession: (sessionId: string) => void;
  onNewSession: () => void;
  onEditMaterial: (material: any) => void;
  onNewMaterial: () => void;
}

const ClassManagementTabs = ({
  classDetails,
  selectedSessionFilter,
  onSessionFilterChange,
  onEditSession,
  onDeleteSession,
  onNewSession,
  onEditMaterial,
  onNewMaterial,
}: ClassManagementTabsProps) => {
  return (
    <Tabs defaultValue="sessions" className="w-full">
      <TabsList className="w-full bg-white border-b border-[#1F4E79]/10 rounded-none p-0 h-auto">
        <TabsTrigger 
          value="sessions"
          className="rounded-none text-sm py-3 px-4 data-[state=active]:text-[#1F4E79] data-[state=active]:border-b-2 data-[state=active]:border-[#1F4E79] font-medium data-[state=active]:shadow-none"
        >
          Sessions
        </TabsTrigger>
        <TabsTrigger 
          value="students"
          className="rounded-none text-sm py-3 px-4 data-[state=active]:text-[#1F4E79] data-[state=active]:border-b-2 data-[state=active]:border-[#1F4E79] font-medium data-[state=active]:shadow-none"
        >
          Students
        </TabsTrigger>
        <TabsTrigger 
          value="materials"
          className="rounded-none text-sm py-3 px-4 data-[state=active]:text-[#1F4E79] data-[state=active]:border-b-2 data-[state=active]:border-[#1F4E79] font-medium data-[state=active]:shadow-none"
        >
          Materials
        </TabsTrigger>
        <TabsTrigger 
          value="settings"
          className="rounded-none text-sm py-3 px-4 data-[state=active]:text-[#1F4E79] data-[state=active]:border-b-2 data-[state=active]:border-[#1F4E79] font-medium data-[state=active]:shadow-none"
        >
          Settings
        </TabsTrigger>
      </TabsList>

      <TabsContent value="sessions" className="pt-4">
        <SessionsTab
          classDetails={classDetails}
          onEditSession={onEditSession}
          onDeleteSession={onDeleteSession}
          onNewSession={onNewSession}
        />
      </TabsContent>

      <TabsContent value="students" className="pt-4">
        <StudentsTab classDetails={classDetails} />
      </TabsContent>

      <TabsContent value="materials" className="pt-4">
        <MaterialsTab
          classDetails={classDetails}
          selectedSessionFilter={selectedSessionFilter}
          onSessionFilterChange={onSessionFilterChange}
          onEditMaterial={onEditMaterial}
          onNewMaterial={onNewMaterial}
        />
      </TabsContent>

      <TabsContent value="settings" className="pt-4">
        <ClassSettingsCard classDetails={classDetails} />
      </TabsContent>
    </Tabs>
  );
};

export default ClassManagementTabs;
