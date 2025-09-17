import React, { useState } from 'react';
import { Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Search, FileText, AlertCircle } from 'lucide-react';
import { apiService } from '../services/api';
import { Button } from './ui/Button';
import { Card } from './ui/Card';
import { StatCard } from './ui/StatCard';
import type { StatusSummaryFormData, StatusSummaryResponse } from '../types';

const COUNTRIES = [
  'USA', 'AUS', 'AUT', 'BEL', 'BLR',
  'BRA', 'CAN', 'CHE', 'COL', 'CUB', 'CZE',
  'DEU', 'DNK', 'ESP', 'FIN', 'FRA', 'GBR',
  'GRC', 'HKG', 'HRV', 'IND', 'IRL', 'ITA',
  'JPN', 'KOR', 'LBN', 'LTU', 'MEX', 'MYS',
  'NLD', 'NZL', 'PAN', 'PER', 'PHL', 'POL',
  'PRT', 'RUS', 'SAU', 'SGP', 'SLV', 'SRB',
  'SVN', 'SWE', 'TUN', 'TUR', 'AND'
];

const STATUS_COLORS: { [key: string]: string } = {
  'Terminated': '#6b7280',
  'Completed': '#2563eb',
  'Open, Classified': '#f59e0b',
  'Under Investigation': '#ef4444'
};

export const StatusSummary: React.FC = () => {
  const [formData, setFormData] = useState<StatusSummaryFormData>({
    country: '',
    deviceName: ''
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<StatusSummaryResponse | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);
    setResult(null);

    try {
      const response = await apiService.getStatusSummary(formData);

      // Handle API response with error key
      if (response.error === "Device not found") {
        setErrorMessage("🚫 We couldn't find the device! Maybe it's hiding somewhere else.");
        return;
      }

      setResult(response);
    } catch (error: any) {
      console.error("API call failed:", error);
      setErrorMessage("Something went wrong. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const statusChartData = result
    ? Object.entries(result.statusCounts).map(([status, count]) => ({
        name: status,
        value: count,
        color: STATUS_COLORS[status] || '#6b7280'
      }))
    : [];

  const totalEvents = result
    ? Object.values(result.statusCounts).reduce((sum, count) => sum + count, 0)
    : 0;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return 'blue';
      case 'Open, Classified': return 'yellow';
      case 'Under Investigation': return 'red';
      case 'Terminated': return 'gray';
      default: return 'gray';
    }
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium">{payload[0].payload.name}</p>
          <p className="text-sm text-gray-600">Events: {payload[0].value}</p>
        </div>
      );
    }
    return null;
  };

  const hasResult = result && !result.error;

  return (
    <div className="space-y-8">
      {/* Filter Section */}
      <Card title="Device Status Summary">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
            <select
              value={formData.country}
              onChange={(e) => setFormData({ ...formData, country: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="">Select a country</option>
              {COUNTRIES.map(country => (
                <option key={country} value={country}>{country}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Device Name</label>
            <input
              type="text"
              value={formData.deviceName}
              onChange={(e) => setFormData({ ...formData, deviceName: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter device name"
              required
            />
          </div>

          <div>
            <Button type="submit" loading={loading} className="w-full">
              <Search className="w-4 h-4" />
              Get Summary
            </Button>
          </div>
        </form>
      </Card>

      {/* Error Message */}
      {errorMessage && (
        <Card title="Oops! Something went wrong">
          <div className="text-center py-6 text-gray-600 space-y-4">
            <AlertCircle className="mx-auto w-12 h-12 text-red-500" />
            <p>{errorMessage}</p>
          </div>
        </Card>
      )}

      {/* Result Section */}
      {hasResult && (
        <>
          {/* Status Counts */}
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-6">Event Status Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {Object.entries(result!.statusCounts).map(([status, count]) => (
                <StatCard
                  key={status}
                  title={status}
                  value={count}
                  color={getStatusColor(status)}
                  icon={<FileText />}
                />
              ))}
            </div>
          </div>

          {/* Status Distribution Chart */}
          <Card title="Status Distribution">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={statusChartData}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      label={(entry) => `${entry.name}: ${entry.value}`}
                    >
                      {statusChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-4">
                <h4 className="font-medium text-gray-800">Summary Statistics</h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Total Events:</span>
                    <span className="font-bold text-gray-800">{totalEvents}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Most Common Status:</span>
                    <span className="font-bold text-gray-800">
                      {Object.entries(result!.statusCounts).sort(([, a], [, b]) => b - a)[0][0]}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Active Events:</span>
                    <span className="font-bold text-orange-600">
                      {(result!.statusCounts['Open, Classified'] || 0) + (result!.statusCounts['Under Investigation'] || 0)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Top 5 Events */}
          <Card title="Recent Events">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-700">ID</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Action</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Status</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {result!.top5Events.map((event, index) => (
                    <tr key={event.id} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                      <td className="py-3 px-4 font-mono text-sm">{event.id}</td>
                      <td className="py-3 px-4 max-w-xs truncate" title={event.action}>
                        {event.action}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                          event.status === 'Completed' ? 'bg-blue-100 text-blue-800' :
                          event.status === 'Open, Classified' ? 'bg-yellow-100 text-yellow-800' :
                          event.status === 'Under Investigation' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {event.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {new Date(event.date).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Manufacturers */}
          <Card title="Manufacturers">
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {(
                Array.isArray(result!.manufacturers)
                  ? result!.manufacturers
                  : typeof result!.manufacturers === "string"
                  ? [result!.manufacturers]
                  : typeof result!.manufacturers === "object" && result!.manufacturers !== null
                  ? Object.values(result!.manufacturers)
                  : []
              ).map((m: any, i: number) => (
                <li key={i} style={{ display: "flex", alignItems: "center", marginBottom: 8 }}>
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: "50%",
                      background: "#1890ff",
                      color: "#fff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginRight: 8,
                      fontWeight: 600,
                    }}
                  >
                    {String(m).charAt(0).toUpperCase()}
                  </div>
                  <span>{m}</span>
                </li>
              ))}
            </ul>
          </Card>
        </>
      )}
    </div>
  );
};
