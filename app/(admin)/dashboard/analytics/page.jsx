"use client";
import { apiUrl } from "@/lib/apiUrl";
 import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const Analytics = () => {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState("7daysAgo"); // Default to 7 days
  const dateOptions = [
    { label: "Today", value: "today" },
    { label: "Yesterday", value: "yesterday" },
    { label: "Last 7 days", value: "7daysAgo" },
    { label: "Last 14 days", value: "14daysAgo" },
    { label: "Last 30 days", value: "30daysAgo" },
    { label: "Last 90 days", value: "90daysAgo" },
    { label: "This year", value: "yearToDate" },
  ];
  useEffect(() => {
    fetchAnalyticsData();
  }, [dateRange]);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      let adminToken = localStorage.getItem("adminToken");
      const response = await fetch(`${apiUrl}/admin/post/googleAnalytics`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify({ dateRange }), // Send date range to backend
      });
      const data = await response.json();
      if (data.success) {
        setAnalyticsData(data);
      }
    } catch (error) {
      console.error("Error fetching analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-lg text-gray-500">Loading analytics data...</p>
      </div>
    );
  }

  if (!analyticsData?.data || analyticsData.data.length === 0) {
    return (
      <div className="flex h-full flex-col items-center justify-center p-4 pt-20 text-center">
        <h3 className="text-xl font-semibold text-gray-700">
          No Data Available
        </h3>
        <p className="mt-2 text-gray-500">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="m-auto h-6 w-6 text-center"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
            />
          </svg>
          Analytics data will be updated within the next day or so.
        </p>
      </div>
    );
  }

  const sourceData = Object.entries(analyticsData.trafficSources).map(
    ([name, value]) => ({
      name,
      value,
    }),
  );
 
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  return (
    <div className="space-y-6 rounded-lg bg-white p-6 pt-20 shadow-md">
      {/* Date Filter */}
      <div className="mb-6">
        <select
          value={dateRange}
          onChange={(e) => setDateRange(e.target.value)}
          className="rounded-lg border px-4 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {dateOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        <div className="rounded-lg bg-gray-100 p-4 shadow">
          <h3 className="text-lg font-semibold text-gray-800">
            Total Sessions
          </h3>
        </div>
        <div className="rounded-lg bg-gray-100 p-4 shadow">
          <h3 className="text-lg font-semibold text-gray-800">
            Engaged Sessions
          </h3>
        </div>
        <div className="rounded-lg bg-gray-100 p-4 shadow">
          <h3 className="text-lg font-semibold text-gray-800">Bounce Rate</h3>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="h-[300px]">
          <h3 className="mb-4 text-lg font-semibold">Sessions Over Time</h3>
          <LineChart data={analyticsData.data} width={500} height={300}>
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="sessions"
              stroke="#8884d8"
              name="Total Sessions"
            />
            <Line
              type="monotone"
              dataKey="engagedSessions"
              stroke="#82ca9d"
              name="Engaged Sessions"
            />
            <Line
              type="monotone"
              dataKey="bounceRate"
              stroke="#82ca9d"
              name="Bounce Rate"
            />
          </LineChart>
        </div>

        <div className="h-[300px]">
          <h3 className="mb-4 text-lg font-semibold">Traffic Sources</h3>
          <PieChart width={400} height={300}>
            <Pie
              data={sourceData}
              cx={200}
              cy={150}
              labelLine={false}
              label={({ name, percent }) =>
                `${name} (${(percent * 100).toFixed(0)} traffic)`
              }
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {sourceData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
