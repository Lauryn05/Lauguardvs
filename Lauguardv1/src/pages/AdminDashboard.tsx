
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, AlertTriangle, MessageSquare, Users } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Monday', prompts: 40, adversarial: 4 },
  { name: 'Tuesday', prompts: 55, adversarial: 7 },
  { name: 'Wednesday', prompts: 60, adversarial: 5 },
  { name: 'Thursday', prompts: 75, adversarial: 10 },
  { name: 'Friday', prompts: 80, adversarial: 12 },
  { name: 'Saturday', prompts: 45, adversarial: 5 },
  { name: 'Sunday', prompts: 30, adversarial: 3 },
];

const AdminDashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Prompts</CardTitle>
            <MessageSquare className="h-4 w-4 text-guard-blue" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2,385</div>
            <p className="text-xs text-muted-foreground">+20.1% from last month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Adversarial Attempts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-guard-red" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">46</div>
            <p className="text-xs text-muted-foreground">-5.2% from last month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Departments</CardTitle>
            <Users className="h-4 w-4 text-guard-green" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-muted-foreground">+2 from last month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Security Rules</CardTitle>
            <Shield className="h-4 w-4 text-guard-amber" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">+4 from last month</p>
          </CardContent>
        </Card>
      </div>
      
      {/* Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Weekly Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="prompts" name="Total Prompts" fill="#3b82f6" />
                <Bar dataKey="adversarial" name="Adversarial Prompts" fill="#ef4444" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      
      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center gap-4 p-2 hover:bg-gray-50 rounded-md">
                <div className={`h-8 w-8 rounded-full flex items-center justify-center ${i % 3 === 0 ? 'bg-red-100' : 'bg-blue-100'}`}>
                  {i % 3 === 0 ? (
                    <AlertTriangle className="h-4 w-4 text-guard-red" />
                  ) : (
                    <MessageSquare className="h-4 w-4 text-guard-blue" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between">
                    <p className="text-sm font-medium">
                      {i % 3 === 0 ? 'Potential adversarial prompt detected' : 'New prompt received'}
                    </p>
                    <span className="text-xs text-gray-500">2 hours ago</span>
                  </div>
                  <p className="text-xs text-gray-500">
                    {i % 3 === 0 
                      ? 'Prompt flagged for potential adversarial intent from Marketing department' 
                      : `User from ${i % 2 === 0 ? 'Engineering' : 'Marketing'} department submitted a new prompt`}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
