"use client";

import { Card } from "@/components/ui/card";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface SeatTypeGraphProps {
  seatTypeChartData: { name: string; value: number }[];
  COLOR: string[];
}

export default function SeatTypeGraph({
  seatTypeChartData,
}: SeatTypeGraphProps) {
  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Seat Type Bookings
      </h3>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={seatTypeChartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="value" fill="#3B82F6" />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
}
