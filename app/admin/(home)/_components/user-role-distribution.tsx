"use client";

import { Card } from "@/components/ui/card";
import { Tooltip, PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

interface UserRoleDistributionProps {
  pieChartData: { name: string; value: number }[];
  COLORS: string[];
}

export default function UserRoleDistribution({
  pieChartData,
  COLORS,
}: UserRoleDistributionProps) {
  return (
    <Card>
      <div className="px-6">
        <h3 className="text-lg font-semibold text-muted-foreground mb-4">
          User Role Distribution
        </h3>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={pieChartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) =>
                `${name} ${(percent * 100).toFixed(0)}%`
              }
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {pieChartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
