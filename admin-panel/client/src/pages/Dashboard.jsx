import React, { useState } from 'react';
import { useQuery } from 'react-query';
import {
  ShoppingCartIcon,
  UsersIcon,
  PackageIcon,
  CurrencyDollarIcon,
  TrendingUpIcon,
  TrendingDownIcon,
  ClockIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { useAuth } from '../contexts/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();
  const [selectedPeriod, setSelectedPeriod] = useState('30');

  const { data: stats, isLoading, error } = useQuery(
    ['dashboard-stats', selectedPeriod],
    async () => {
      const response = await fetch(`/api/dashboard/stats?period=${selectedPeriod}`);
      return response.json();
    }
  );

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatNumber = (num) => {
    return new Intl.NumberFormat('en-IN').format(num);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-600">Error loading dashboard data</div>
      </div>
    );
  }

  const { overview, today, monthly, yearly, recentOrders, topProducts, orderStatusStats, paymentMethodStats, charts, alerts } = stats?.data || {};

  const statCards = [
    {
      title: 'Total Users',
      value: formatNumber(overview?.totalUsers || 0),
      icon: UsersIcon,
      color: 'bg-blue-500',
      change: today?.users - (monthly?.users / 30) || 0,
      changeType: today?.users > (monthly?.users / 30) ? 'increase' : 'decrease',
    },
    {
      title: 'Total Products',
      value: formatNumber(overview?.totalProducts || 0),
      icon: PackageIcon,
      color: 'bg-green-500',
      change: 0,
      changeType: 'neutral',
    },
    {
      title: 'Total Orders',
      value: formatNumber(overview?.totalOrders || 0),
      icon: ShoppingCartIcon,
      color: 'bg-purple-500',
      change: today?.orders - (monthly?.orders / 30) || 0,
      changeType: today?.orders > (monthly?.orders / 30) ? 'increase' : 'decrease',
    },
    {
      title: 'Total Revenue',
      value: formatCurrency(overview?.totalRevenue || 0),
      icon: CurrencyDollarIcon,
      color: 'bg-orange-500',
      change: today?.revenue - (monthly?.revenue / 30) || 0,
      changeType: today?.revenue > (monthly?.revenue / 30) ? 'increase' : 'decrease',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Welcome back, {user?.firstName}!</p>
        </div>
        <div className="flex items-center space-x-4">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 px-3 py-2 text-sm"
          >
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 90 days</option>
            <option value="365">Last year</option>
          </select>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <div key={index} className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <stat.icon className={`h-6 w-6 ${stat.color} text-white rounded-full p-2`} />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">{stat.title}</dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-gray-900">{stat.value}</div>
                      {stat.change !== 0 && (
                        <div className={`ml-2 flex items-baseline text-sm font-medium ${
                          stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {stat.changeType === 'increase' ? (
                            <TrendingUpIcon className="h-4 w-4 flex-shrink-0 self-center" />
                          ) : (
                            <TrendingDownIcon className="h-4 w-4 flex-shrink-0 self-center" />
                          )}
                          <span className="sr-only">
                            {stat.changeType === 'increase' ? 'Increased' : 'Decreased'} by{' '}
                            {Math.abs(stat.change)}
                          </span>
                          <span className="ml-1">
                            {Math.abs(stat.change) > 0 && '+'}
                            {Math.abs(stat.change)}
                          </span>
                        </div>
                      )}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Chart */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Sales Overview</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={charts?.monthlySales || []}>
              <XAxis dataKey="_id" />
              <YAxis />
              <CartesianGrid strokeDasharray="3 3 0 0" />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="revenue" 
                stroke="#f97316" 
                strokeWidth={2}
                dot={{ fill: '#f97316' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Order Status Chart */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Order Status</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={orderStatusStats || []}>
              <CartesianGrid strokeDasharray="3 3 0 0" />
              <XAxis dataKey="_id" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#8b5cf6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg font-medium text-gray-900">Recent Orders</h3>
        </div>
        <div className="overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order #
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recentOrders?.map((order) => (
                <tr key={order._id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {order.orderNumber}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {order.customer?.firstName} {order.customer?.lastName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatCurrency(order.pricing?.total || 0)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      order.status === 'delivered'
                        ? 'bg-green-100 text-green-800'
                        : order.status === 'shipped'
                        ? 'bg-blue-100 text-blue-800'
                        : order.status === 'processing'
                        ? 'bg-yellow-100 text-yellow-800'
                        : order.status === 'pending'
                        ? 'bg-gray-100 text-gray-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Alerts */}
      {alerts?.lowStockProducts > 0 && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <ExclamationTriangleIcon className="h-5 w-5 text-yellow-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">
                Low Stock Alert
              </h3>
              <div className="mt-2 text-sm text-yellow-700">
                <p>{alerts.lowStockProducts} products are running low on stock. Please restock soon.</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
