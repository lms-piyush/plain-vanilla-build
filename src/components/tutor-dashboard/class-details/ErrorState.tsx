
import { Button } from "@/components/ui/button";

interface ErrorStateProps {
  error: string;
  onRetry: () => void;
}

const ErrorState = ({ error, onRetry }: ErrorStateProps) => {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <p className="text-red-500 mb-4">Error loading class: {error}</p>
        <Button onClick={onRetry}>Retry</Button>
      </div>
    </div>
  );
};

export default ErrorState;
