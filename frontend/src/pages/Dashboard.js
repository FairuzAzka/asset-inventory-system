// src/pages/Dashboard.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  CubeIcon, 
  UsersIcon, 
  ClockIcon, 
  ExclamationCircleIcon 
} from '@heroicons/react/outline';
import Layout from '../components/layout/Layout';
import assetService from '../services/asset.service';
import employeeService from '../services/employee.service';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalAssets: 0,
    availableAssets: 0,
    assignedAssets: 0,
    maintenanceAssets: 0,
    totalEmployees: 0,
    recentActivity: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch stats
        const assetStats = await assetService.getAssetStats();
        const employeeCount = await employeeService.getEmployeeCount();
        const recentActivity = await assetService.getRecentActivity();
        
        setStats({
          totalAssets: assetStats.total,
          availableAssets: assetStats.available,
          assignedAssets: assetStats.assigned,
          maintenanceAssets: assetStats.maintenance,
          totalEmployees: employeeCount,
          recentActivity
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Card with stats
  const StatCard = ({ title, value, icon: Icon, color, bgColor, description }) => (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <div className="p-5">
        <div className="flex items-center">
          <div className={`flex-shrink-0 ${bgColor} rounded-md p-3`}>
            <Icon className={`h-6 w-6 ${color}`} aria-hidden="true" />
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">{title}</dt>
              <dd>
                <div className="text-lg font-medium text-gray-900">{loading ? '...' : value}</div>
              </dd>
            </dl>
          </div>
        </div>
      </div>
      {description && (
        <div className="bg-gray-50 px-5 py-3">
          <div className="text-sm">
            <Link to={description.link} className="font-medium text-blue-700 hover:text-blue-900">
              {description.text}
            </Link>
          </div>
        </div>
      )}
    </div>
  );

  const ActivityItem = ({ activity }) => {
    const getActivityIcon = (type) => {
      switch (type) {
        case 'assigned':
          return <UsersIcon className="h-5 w-5 text-blue-500" />;
        case 'maintenance':
          return <ExclamationCircleIcon className="h-5 w-5 text-yellow-500" />;
        default:
          return <CubeIcon className="h-5 w-5 text-gray-500" />;
      }
    };

    return (
      <li>
        <div className="relative pb-8">
          <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true" />
          <div className="relative flex space-x-3">
            <div>
              <span className="h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white bg-white">
                {getActivityIcon(activity.action)}
              </span>
            </div>
            <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
              <div>
                <p className="text-sm text-gray-500">
                  {activity.description}{' '}
                  <Link to={`/assets/${activity.asset_id}`} className="font-medium text-gray-900">
                    {activity.asset_name}
                  </Link>
                </p>
              </div>
              <div className="text-right text-sm whitespace-nowrap text-gray-500">
                <time dateTime={activity.date}>
                  {new Date(activity.date).toLocaleDateString()}
                </time>
              </div>
            </div>
          </div>
        </div>
      </li>
    );
  };

  return (
    <Layout title="Dashboard">
      <div className="mt-4">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Assets"
            value={stats.totalAssets}
            icon={CubeIcon}
            color="text-indigo-600"
            bgColor="bg-indigo-100"
            description={{ text: 'View all assets', link: '/assets' }}
          />
          <StatCard
            title="Available Assets"
            value={stats.availableAssets}
            icon={CubeIcon}
            color="text-green-600"
            bgColor="bg-green-100"
            description={{ text: 'View available assets', link: '/assets?status=available' }}
          />
          <StatCard
            title="Assigned Assets"
            value={stats.assignedAssets}
            icon={UsersIcon}
            color="text-blue-600"
            bgColor="bg-blue-100"
            description={{ text: 'View assigned assets', link: '/assets?status=assigned' }}
          />
          <StatCard
            title="In Maintenance"
            value={stats.maintenanceAssets}
            icon={ClockIcon}
            color="text-yellow-600"
            bgColor="bg-yellow-100"
            description={{ text: 'View maintenance assets', link: '/assets?status=maintenance' }}
          />
        </div>

        {/* Recent Activity Section */}
        <div className="mt-8">
          <h2 className="text-lg font-medium text-gray-900">Recent Activity</h2>
          <div className="mt-4 bg-white shadow rounded-lg">
            <ul className="divide-y divide-gray-200 p-6">
              {loading ? (
                <p>Loading activities...</p>
              ) : stats.recentActivity.length > 0 ? (
                stats.recentActivity.map((activity, index) => (
                  <ActivityItem key={index} activity={activity} />
                ))
              ) : (
                <p>No recent activities</p>
              )}
            </ul>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;