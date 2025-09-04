'use client';

import { useState, useEffect } from 'react';
import { AuthGuard } from '@/components/AuthGuard';
import AdminLayout from '@/components/Layout/AdminLayout';
import { Order } from '@/types';
import { orderAPI } from '@/lib/api';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, LineChart, Line, CartesianGrid 
} from 'recharts';
import { Calendar, Download, BarChart3, PiggyBank } from 'lucide-react';

export default function ReportsPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState({ startDate: '', endDate: '' });

  useEffect(() => {
    fetchOrders();
  }, [dateRange]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const filters = {
        startDate: dateRange.startDate || undefined,
        endDate: dateRange.endDate || undefined,
        pageSize: 1000
      };
      const response = await orderAPI.getAll(filters);
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const sourceData = Object.entries(
    orders.reduce((acc, order) => {
      acc[order.source] = (acc[order.source] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  ).map(([source, count]) => ({ source, count }));

  const revenueData = Object.entries(
    orders.reduce((acc, order) => {
      const date = new Date(order.date).toLocaleDateString();
      acc[date] = (acc[date] || 0) + order.amount;
      return acc;
    }, {} as Record<string, number>)
  ).map(([date, revenue]) => ({ date, revenue }));

  if (loading) {
    return (
      <AuthGuard>
        <AdminLayout>
          <p>Loading...</p>
        </AdminLayout>
      </AuthGuard>
    );
  }

  return (
    <AuthGuard>
      <AdminLayout>
        <div className="mb-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Reports & Analytics</h1>
          <button
            onClick={async () => {
              try {
                const blob = await orderAPI.exportCsv({
                  startDate: dateRange.startDate || undefined,
                  endDate: dateRange.endDate || undefined
                });
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `reports-${new Date().toISOString().slice(0, 10)}.csv`;
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
                document.body.removeChild(a);
              } catch (err) {
                console.error(err);
              }
            }}
            className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded"
          >
            <Download className="h-4 w-4 mr-2" /> Export Report
          </button>
        </div>
        <div className="grid grid-cols-2 gap-4 mb-8">
          <input
            type="date"
            value={dateRange.startDate}
            onChange={(e) => setDateRange(prev => ({ ...prev, startDate: e.target.value }))}
            className="border px-3 py-2 rounded"
          />
          <input
            type="date"
            value={dateRange.endDate}
            onChange={(e) => setDateRange(prev => ({ ...prev, endDate: e.target.value }))}
            className="border px-3 py-2 rounded"
          />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Orders by Source */}
          <div className="bg-white p-5 rounded shadow">
            <h2 className="text-lg font-medium mb-4 flex items-center"><BarChart3 className="mr-2" /> Orders by Source</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={sourceData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="source" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#4f46e5" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="bg-white p-5 rounded shadow">
            <h2 className="text-lg font-medium mb-4 flex items-center"><PiggyBank className="mr-2" /> Revenue Trend</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenueData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </AdminLayout>
    </AuthGuard>
  );
}
