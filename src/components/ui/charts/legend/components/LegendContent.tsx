
import React from "react";
import { cn } from "@/lib/utils";
import { LegendItem } from "./LegendItem";

export type LegendContentProps = React.ComponentProps<"div"> & {
  payload?: Array<{
    value: string;
    dataKey?: string | number;
    color?: string;
    [key: string]: any;
  }>;
  verticalAlign?: string;
  hideIcon?: boolean;
  nameKey?: string;
  layout?: 'vertical' | 'horizontal';
};

export const LegendContent = React.forwardRef<
  HTMLDivElement,
  LegendContentProps
>(
  (
    { className, hideIcon = false, payload, verticalAlign = "bottom", nameKey, layout = "horizontal" },
    ref
  ) => {
    if (!payload?.length) {
      return null;
    }

    const isVertical = layout === 'vertical';

    return (
      <div
        ref={ref}
        className={cn(
          "flex items-center justify-center gap-4",
          isVertical ? "flex-col" : "flex-row",
          verticalAlign === "top" ? "pb-3" : "pt-3",
          className
        )}
      >
        {payload.map((item, index) => (
          <LegendItem 
            key={`legend-item-${index}`}
            item={item}
            hideIcon={hideIcon}
            nameKey={nameKey}
          />
        ))}
      </div>
    );
  }
);

LegendContent.displayName = "LegendContent";
