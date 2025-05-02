
import * as React from "react";
import { cn } from "@/lib/utils";
import { useChart } from "../../ChartContainer";
import { TooltipItem } from "./TooltipItem";
import { TooltipLabel } from "./TooltipLabel";

export type TooltipContentProps = {
  active?: boolean;
  payload?: any[];
  className?: string;
  indicator?: "line" | "dot" | "dashed";
  hideLabel?: boolean;
  hideIndicator?: boolean;
  label?: string;
  labelFormatter?: (value: any, payload: any[]) => React.ReactNode;
  labelClassName?: string;
  formatter?: (value: any, name: any, props: any, index: number, payload: any) => React.ReactNode;
  color?: string;
  nameKey?: string;
  labelKey?: string;
}

export const TooltipContent = React.forwardRef<
  HTMLDivElement,
  TooltipContentProps
>(
  (
    {
      active,
      payload,
      className,
      indicator = "dot",
      hideLabel = false,
      hideIndicator = false,
      label,
      labelFormatter,
      labelClassName,
      formatter,
      color,
      nameKey,
      labelKey,
    },
    ref
  ) => {
    const tooltipLabel = (
      <TooltipLabel
        label={label}
        payload={payload}
        labelFormatter={labelFormatter}
        labelClassName={labelClassName}
        hideLabel={hideLabel}
        labelKey={labelKey}
      />
    );

    if (!active || !payload?.length) {
      return null;
    }

    const nestLabel = payload.length === 1 && indicator !== "dot";

    return (
      <div
        ref={ref}
        className={cn(
          "grid min-w-[8rem] max-w-[90vw] items-start gap-1.5 rounded-lg border border-border/50 bg-background px-2.5 py-1.5 text-xs shadow-xl",
          className
        )}
        style={{ maxWidth: "100%" }}
      >
        {!nestLabel ? tooltipLabel : null}
        <div className="grid gap-1.5">
          {payload.map((item, index) => (
            <TooltipItem
              key={item.dataKey}
              item={item}
              index={index}
              formatter={formatter}
              indicator={indicator}
              nestLabel={nestLabel}
              hideIndicator={hideIndicator}
              color={color}
              nameKey={nameKey}
            />
          ))}
        </div>
      </div>
    );
  }
);
TooltipContent.displayName = "TooltipContent";
