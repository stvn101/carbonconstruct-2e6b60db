
import { ComplianceData } from "../types";

export interface ComplianceStatusProps {
  nccData: ComplianceData | null;
  nabersData: ComplianceData | null;
  onRunCheck?: () => void;
  isLoading?: boolean;
  className?: string;
}

export interface ComplianceDetailProps {
  details: Record<string, any> | null | undefined;
}

export interface ComplianceTipProps {
  children: React.ReactNode;
}

export interface ComplianceSectionProps {
  title: string;
  compliant: boolean;
  badgeText: string;
  children: React.ReactNode;
}
