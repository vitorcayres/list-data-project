import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

interface ChartAreaInteractiveProps {
  chartData: Array<{
    date: string;
    total: number;
  }>;
}

export function ChartAreaInteractive({ chartData }: ChartAreaInteractiveProps) {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Total de Vendas por Dia</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid />
            <XAxis
              dataKey="date"
              angle={0}
              textAnchor="end"
              height={50}
              tick={{ fontSize: 12 }}
            />
            <YAxis />
            <Tooltip
              formatter={(v: number) => `R$ ${v}`}
              contentStyle={{
                backgroundColor: "black",
              }}
            />
            <Bar dataKey="total" fill="green" name="Total de Vendas" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
