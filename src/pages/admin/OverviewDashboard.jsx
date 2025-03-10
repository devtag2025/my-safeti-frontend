import { useState, useEffect } from "react";
import { UsersRound, FileText, TrendingUp, ArrowUpRight, ArrowDownRight } from "lucide-react";

const OverviewDashboard = () => {
  const [metrics, setMetrics] = useState({
    activeUsers: 0,
    newSignups: { daily: 0, weekly: 0, monthly: 0 },
    reportsSubmitted: { daily: 0, weekly: 0, monthly: 0 },
    revenueMetrics: { media: 0, advertising: 0, total: 0 }
  });
  
  // In a real implementation, this would fetch data from your API
  useEffect(() => {
    // Simulate API call with dummy data
    const fetchDashboardData = () => {
      // Dummy data for demonstration
      const data = {
        activeUsers: 1458,
        newSignups: { daily: 34, weekly: 156, monthly: 578 },
        reportsSubmitted: { daily: 78, weekly: 345, monthly: 1240 },
        revenueMetrics: { media: 3450.75, advertising: 5820.25, total: 9271.00 }
      };
      
      // Add artificial loading delay for demo purposes
      setTimeout(() => {
        setMetrics(data);
      }, 500);
    };
    
    fetchDashboardData();
  }, []);

  // Track month-over-month changes
  const changes = {
    activeUsers: { value: 12.5, positive: true },
    newSignups: { value: 8.7, positive: true },
    reportsSubmitted: { value: 15.3, positive: true },
    revenue: { value: 5.2, positive: true }
  };

  // Fixed data for revenue chart
  const revenueData = [
    { month: "Jan", amount: 15420 },
    { month: "Feb", amount: 18250 },
    { month: "Mar", amount: 17840 },
    { month: "Apr", amount: 19220 },
    { month: "May", amount: 21450 },
    { month: "Jun", amount: 24598 }
  ];

  // Find the maximum value to calculate percentages
  const maxAmount = Math.max(...revenueData.map(item => item.amount));

  return (
    <div className="p-6">
      {/* <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-700 mb-2">Platform Health</h2>
        <p className="text-gray-500">Platform performance metrics overview</p>
      </div> */}
      
      {/* Top stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {/* Active Users Card */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 mb-1">Active Users</p>
              <h3 className="text-2xl font-bold">{metrics.activeUsers.toLocaleString()}</h3>
              
              <div className={`flex items-center mt-2 ${changes.activeUsers.positive ? 'text-green-500' : 'text-red-500'}`}>
                {changes.activeUsers.positive ? 
                  <ArrowUpRight className="w-4 h-4 mr-1" /> : 
                  <ArrowDownRight className="w-4 h-4 mr-1" />
                }
                <span className="text-sm font-medium">{changes.activeUsers.value}% from last month</span>
              </div>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <UsersRound className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
        
        {/* New Signups Card */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 mb-1">New Signups</p>
              <h3 className="text-2xl font-bold">{metrics.newSignups.monthly.toLocaleString()}</h3>
              
              <div className={`flex items-center mt-2 ${changes.newSignups.positive ? 'text-green-500' : 'text-red-500'}`}>
                {changes.newSignups.positive ? 
                  <ArrowUpRight className="w-4 h-4 mr-1" /> : 
                  <ArrowDownRight className="w-4 h-4 mr-1" />
                }
                <span className="text-sm font-medium">{changes.newSignups.value}% from last month</span>
              </div>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
          </div>
          
          <div className="mt-4 grid grid-cols-3 gap-2 text-sm">
            <div className="bg-gray-50 p-2 rounded">
              <p className="text-gray-500">Daily</p>
              <p className="font-semibold">{metrics.newSignups.daily}</p>
            </div>
            <div className="bg-gray-50 p-2 rounded">
              <p className="text-gray-500">Weekly</p>
              <p className="font-semibold">{metrics.newSignups.weekly}</p>
            </div>
            <div className="bg-gray-50 p-2 rounded">
              <p className="text-gray-500">Monthly</p>
              <p className="font-semibold">{metrics.newSignups.monthly}</p>
            </div>
          </div>
        </div>
        
        {/* Reports Submitted Card */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 mb-1">Reports Submitted</p>
              <h3 className="text-2xl font-bold">{metrics.reportsSubmitted.monthly.toLocaleString()}</h3>
              
              <div className={`flex items-center mt-2 ${changes.reportsSubmitted.positive ? 'text-green-500' : 'text-red-500'}`}>
                {changes.reportsSubmitted.positive ? 
                  <ArrowUpRight className="w-4 h-4 mr-1" /> : 
                  <ArrowDownRight className="w-4 h-4 mr-1" />
                }
                <span className="text-sm font-medium">{changes.reportsSubmitted.value}% from last month</span>
              </div>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <FileText className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          
          <div className="mt-4 grid grid-cols-3 gap-2 text-sm">
            <div className="bg-gray-50 p-2 rounded">
              <p className="text-gray-500">Daily</p>
              <p className="font-semibold">{metrics.reportsSubmitted.daily}</p>
            </div>
            <div className="bg-gray-50 p-2 rounded">
              <p className="text-gray-500">Weekly</p>
              <p className="font-semibold">{metrics.reportsSubmitted.weekly}</p>
            </div>
            <div className="bg-gray-50 p-2 rounded">
              <p className="text-gray-500">Monthly</p>
              <p className="font-semibold">{metrics.reportsSubmitted.monthly}</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Revenue Section */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-700 mb-2">Revenue Overview</h2>
        <p className="text-gray-500">Monthly revenue performance metrics</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Stats */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h3 className="text-lg font-semibold mb-4">Revenue Breakdown</h3>
            
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-gray-600">Media Requests</span>
                  <span className="text-gray-800 font-medium">${metrics.revenueMetrics.media.toLocaleString()}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{width: `${(metrics.revenueMetrics.media / metrics.revenueMetrics.total) * 100}%`}}></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-gray-600">Advertising</span>
                  <span className="text-gray-800 font-medium">${metrics.revenueMetrics.advertising.toLocaleString()}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{width: `${(metrics.revenueMetrics.advertising / metrics.revenueMetrics.total) * 100}%`}}></div>
                </div>
              </div>
              
              <div className="pt-4 mt-4 border-t">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 font-medium">Total Revenue</span>
                  <span className="text-gray-800 font-bold">${metrics.revenueMetrics.total.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Monthly Trend Chart - FIXED */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow p-6 h-full">
            <h3 className="text-lg font-semibold mb-4">Monthly Revenue Trend</h3>
            
            {/* Fixed bar chart representation */}
            <div className="flex items-end h-64 space-x-2 mt-8">
              {revenueData.map((item) => {
                // Calculate height percentage based on the maximum value
                const heightPercent = (item.amount / maxAmount) * 80;
                return (
                  <div key={item.month} className="flex flex-col items-center flex-1">
                    <div 
                      className="bg-blue-500 w-full rounded-t min-h-2" 
                      style={{height: `${heightPercent}%`}}
                    ></div>
                    <p className="text-xs font-medium mt-2">{item.month}</p>
                    <p className="text-xs text-gray-500">${(item.amount / 1000).toFixed(1)}k</p>
                  </div>
                );
              })}
            </div>
            
            <div className="flex justify-between mt-8 text-sm text-gray-500">
              <div>Last 6 Months</div>
              <div className={`flex items-center ${changes.revenue.positive ? 'text-green-500' : 'text-red-500'}`}>
                {changes.revenue.positive ? 
                  <ArrowUpRight className="w-4 h-4 mr-1" /> : 
                  <ArrowDownRight className="w-4 h-4 mr-1" />
                }
                <span>{changes.revenue.value}% from previous period</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OverviewDashboard;