
interface SessionInfoCardProps {
  sessionDate: string;
  startTime: string;
  endTime: string;
}

const SessionInfoCard = ({ sessionDate, startTime, endTime }: SessionInfoCardProps) => {
  return (
    <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
      <div className="text-sm text-blue-800">
        <p><strong>Auto-calculated details:</strong></p>
        <p>Date: {new Date(sessionDate).toLocaleDateString()}</p>
        <p>Time: {startTime} - {endTime}</p>
        <p className="text-xs mt-1 text-blue-600">
          Based on your class schedule and frequency
        </p>
      </div>
    </div>
  );
};

export default SessionInfoCard;
