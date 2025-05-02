
import { memo } from "react"
import * as RechartsPrimitive from "recharts"
import { BarChart } from "./BarChart";

export const Bar = Object.assign(memo(RechartsPrimitive.Bar), { Chart: BarChart });
