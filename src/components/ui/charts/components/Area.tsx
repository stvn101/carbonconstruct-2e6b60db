
import { memo } from "react"
import * as RechartsPrimitive from "recharts"
import { AreaChart } from "./AreaChart";

export const Area = Object.assign(memo(RechartsPrimitive.Area), { Chart: AreaChart });
