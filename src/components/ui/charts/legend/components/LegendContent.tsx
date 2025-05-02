
import * as React from "react"
import { cn } from "@/lib/utils"
import { LegendItem } from "./LegendItem"

export type LegendContentProps = React.ComponentProps<"div"> & 
  Pick<React.ComponentProps<typeof import("recharts").Legend>, "payload" | "verticalAlign"> & {
    hideIcon?: boolean
    nameKey?: string
  }

export const LegendContent = React.forwardRef<
  HTMLDivElement,
  LegendContentProps
>(
  (
    { className, hideIcon = false, payload, verticalAlign = "bottom", nameKey },
    ref
  ) => {
    if (!payload?.length) {
      return null;
    }

    return (
      <div
        ref={ref}
        className={cn(
          "flex items-center justify-center gap-4",
          verticalAlign === "top" ? "pb-3" : "pt-3",
          className
        )}
      >
        {payload.map((item) => (
          <LegendItem 
            key={item.value}
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
