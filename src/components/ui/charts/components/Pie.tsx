
import { memo } from "react"
import * as RechartsPrimitive from "recharts"
import { PieChart } from "./PieChart";

export const Pie = Object.assign(memo(RechartsPrimitive.Pie), { Chart: PieChart });
