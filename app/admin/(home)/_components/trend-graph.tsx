"use client";

import { Card } from "@/components/ui/card";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface TrendGraphProps {
  COLOR: string[];
}

export default function TrendGraph({ trendData }) {
  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Overall Booking & Revenue Trend
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={trendData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis yAxisId="left" orientation="left" />
          <YAxis yAxisId="right" orientation="right" />
          <Tooltip
            formatter={(value, name) => [
              name === "revenue" ? `${value.toLocaleString()}` : value,
              name === "revenue" ? "Revenue" : "Bookings",
            ]}
          />
          <Legend />
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="bookings"
            stroke="#10B981"
            strokeWidth={3}
            name="Bookings"
            dot={{ fill: "#10B981", strokeWidth: 2, r: 6 }}
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="revenue"
            stroke="#F59E0B"
            strokeWidth={3}
            name="Revenue (Ksh)"
            dot={{ fill: "#F59E0B", strokeWidth: 2, r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
}
