
import * as React from "react";
import { cn } from "@/lib/utils";
import { useChart } from "../../ChartContainer";
import { getPayloadConfigFromPayload } from "../utils/getPayloadConfig";

interface TooltipLabelProps {
  label?: string;
  payload?: any[];
  labelFormatter?: (value: any, payload: any[]) => React.ReactNode;
  labelClassName?: string;
  hideLabel?: boolean;
  labelKey?: string;
}

export const TooltipLabel: React.FC<TooltipLabelProps> = ({
  label,
  payload,
  labelFormatter,
  labelClassName,
  hideLabel,
  labelKey,
}) => {
  const { config } = useChart();

  if (hideLabel || !payload?.length) {
    return null;
  }

  const [item] = payload;
  const key = `${labelKey || item.dataKey || item.name || "value"}`;
  const itemConfig = getPayloadConfigFromPayload(config, item, key);
  const value =
    !labelKey && typeof label === "string"
      ? config[label as keyof typeof config]?.label || label
      : itemConfig?.label;

  if (labelFormatter) {
    return (
      <div className={cn("font-medium", labelClassName)}>
        {labelFormatter(value, payload)}
      </div>
    );
  }

  if (!value) {
    return null;
  }

  return <div className={cn("font-medium", labelClassName)}>{value}</div>;
};
