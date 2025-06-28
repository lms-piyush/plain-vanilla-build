
import { Badge } from "@/components/ui/badge";

interface SessionStatusBadgeProps {
  status: string;
}

const SessionStatusBadge = ({ status }: SessionStatusBadgeProps) => {
  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'upcoming':
        return 'default';
      case 'completed':
        return 'secondary';
      case 'cancelled':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'upcoming':
        return 'bg-blue-100 text-blue-800 hover:bg-blue-100';
      case 'completed':
        return 'bg-green-100 text-green-800 hover:bg-green-100';
      case 'cancelled':
        return 'bg-red-100 text-red-800 hover:bg-red-100';
      default:
        return '';
    }
  };

  return (
    <Badge 
      variant={getStatusBadgeVariant(status)}
      className={`capitalize ${getStatusBadgeClass(status)}`}
    >
      {status}
    </Badge>
  );
};

export default SessionStatusBadge;
