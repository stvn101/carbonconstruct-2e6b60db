
import { memo } from "react"
import * as RechartsPrimitive from "recharts"
import { LineChart } from "./LineChart";

export const Line = Object.assign(memo(RechartsPrimitive.Line), { Chart: LineChart });
