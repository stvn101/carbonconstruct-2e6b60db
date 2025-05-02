
export type ChartTypeProps = {
  type: string;
  data: any[];
  categories: string[];
  index: string;
  colors: string[];
  valueFormatter?: (value: number) => string;
  showLegend: boolean;
}
