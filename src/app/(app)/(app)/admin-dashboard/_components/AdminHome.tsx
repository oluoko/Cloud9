"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Plane, Calendar, CreditCard } from "lucide-react";
// Import the UserButton directly from Clerk's client components
import { UserButton } from "@clerk/nextjs";

interface DashboardStats {
  totalUsers: number;
  totalFlights: number;
  totalBookings: number;
  totalRevenue: number;
  activeBookings: number;
}

interface AdminHomeProps {
  initialData: DashboardStats | null;
}

export default function AdminHome({ initialData }: AdminHomeProps) {
  const [stats, setStats] = useState<DashboardStats>(
    initialData || {
      totalUsers: 0,
      totalFlights: 0,
      totalBookings: 0,
      totalRevenue: 0,
      activeBookings: 0,
    }
  );

  const [loading, setLoading] = useState(!initialData);

  // Fetch data on the client side if initialData is not available
  useEffect(() => {
    if (!initialData) {
      const fetchDashboardStats = async () => {
        try {
          const response = await fetch("/api/admin/dashboard-stats");
          if (!response.ok) {
            throw new Error(`Failed to fetch: ${response.status}`);
          }
          const data = await response.json();
          if (data.success) {
            setStats(data.data);
          }
        } catch (error) {
          console.error("Failed to fetch dashboard stats:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchDashboardStats();
    }
  }, [initialData]);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <UserButton afterSignOutUrl="/" />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="h-8 w-16 animate-pulse bg-gray-200 rounded"></div>
            ) : (
              <div className="text-2xl font-bold">{stats.totalUsers}</div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Total Flights</CardTitle>
            <Plane className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="h-8 w-16 animate-pulse bg-gray-200 rounded"></div>
            ) : (
              <div className="text-2xl font-bold">{stats.totalFlights}</div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">
              Total Bookings
            </CardTitle>
            <Calendar className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="h-8 w-16 animate-pulse bg-gray-200 rounded"></div>
            ) : (
              <div className="text-2xl font-bold">{stats.totalBookings}</div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <CreditCard className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="h-8 w-16 animate-pulse bg-gray-200 rounded"></div>
            ) : (
              <div className="text-2xl font-bold">
                ${stats.totalRevenue.toLocaleString()}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Recent Bookings</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-2">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="h-12 w-full animate-pulse bg-gray-200 rounded"
                  ></div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                Recent bookings will appear here
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Popular Flights</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-2">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="h-12 w-full animate-pulse bg-gray-200 rounded"
                  ></div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                Popular flights will appear here
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
