
export interface ComplianceStatusProps {
  nccData: {
    compliant: boolean;
    score: number;
    details?: any;
    error?: string;
    grokAnalysis?: string;
  } | null;
  nabersData: {
    compliant: boolean;
    score: number;
    details?: any;
    error?: string;
  } | null;
  onRunCheck?: () => void;
  isLoading?: boolean;
  className?: string;
}
