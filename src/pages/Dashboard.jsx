import { useState, useEffect } from "react";
import Navigation from "@/components/Navigation";
import { Card } from "@/components/ui/card";

const Dashboard = () => {
  // Mock data - you'll replace this with real API calls
  const [metricsData] = useState({
    totalApplications: 127,
    thisMonth: 34,
    hired: 8,
    rejected: 89,
    inProcess: 30,
    avgTimeToHire: 14, // days
    conversionRate: 6.3, // percentage
    topSources: [
      { name: "LinkedIn", count: 45 },
      { name: "Company Website", count: 32 },
      { name: "Job Boards", count: 28 },
      { name: "Referrals", count: 22 }
    ],
    monthlyTrend: [
      { month: "Jan", applications: 23, hired: 2 },
      { month: "Feb", applications: 31, hired: 3 },
      { month: "Mar", applications: 28, hired: 1 },
      { month: "Apr", applications: 34, hired: 8 },
    ]
  });

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-extrabold text-foreground">Analytics Dashboard</h1>
          <p className="text-muted-foreground">Overview of your hiring performance and metrics</p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="p-6 text-center bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <h3 className="text-2xl font-bold text-blue-700">{metricsData.totalApplications}</h3>
            <p className="text-blue-600 font-medium">Total Applications</p>
          </Card>
          <Card className="p-6 text-center bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <h3 className="text-2xl font-bold text-green-700">{metricsData.hired}</h3>
            <p className="text-green-600 font-medium">Hired</p>
          </Card>
          <Card className="p-6 text-center bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200">
            <h3 className="text-2xl font-bold text-amber-700">{metricsData.inProcess}</h3>
            <p className="text-amber-600 font-medium">In Process</p>
          </Card>
          <Card className="p-6 text-center bg-gradient-to-br from-red-50 to-red-100 border-red-200">
            <h3 className="text-2xl font-bold text-red-700">{metricsData.rejected}</h3>
            <p className="text-red-600 font-medium">Rejected</p>
          </Card>
        </div>

        {/* Performance Metrics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-6">
            <h3 className="text-lg font-bold mb-4 text-card-foreground">Hiring Funnel</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Applications Received</span>
                <span className="font-bold">{metricsData.totalApplications}</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{width: '100%'}}></div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Under Review</span>
                <span className="font-bold">{metricsData.inProcess}</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div className="bg-amber-500 h-2 rounded-full" style={{width: `${(metricsData.inProcess/metricsData.totalApplications)*100}%`}}></div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Hired</span>
                <span className="font-bold">{metricsData.hired}</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{width: `${(metricsData.hired/metricsData.totalApplications)*100}%`}}></div>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-bold mb-4 text-card-foreground">Key Performance Metrics</h3>
            <div className="space-y-6">
              <div className="text-center p-4 bg-muted/30 rounded-lg">
                <div className="text-2xl font-bold text-primary">{metricsData.avgTimeToHire}</div>
                <div className="text-sm text-muted-foreground">Average Days to Hire</div>
              </div>
              <div className="text-center p-4 bg-muted/30 rounded-lg">
                <div className="text-2xl font-bold text-primary">{metricsData.conversionRate}%</div>
                <div className="text-sm text-muted-foreground">Application to Hire Rate</div>
              </div>
            </div>
          </Card>
        </div>

        {/* Application Sources */}
        <Card className="p-6">
          <h3 className="text-lg font-bold mb-4 text-card-foreground">Top Application Sources</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {metricsData.topSources.map((source, index) => (
              <div key={index} className="text-center p-4 bg-muted/20 rounded-lg">
                <div className="text-xl font-bold text-card-foreground">{source.count}</div>
                <div className="text-sm text-muted-foreground">{source.name}</div>
              </div>
            ))}
          </div>
        </Card>

        {/* Monthly Trend */}
        <Card className="p-6">
          <h3 className="text-lg font-bold mb-4 text-card-foreground">Monthly Application Trend</h3>
          <div className="flex items-end justify-between gap-4 h-48">
            {metricsData.monthlyTrend.map((month, index) => (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div className="w-full bg-muted rounded-t flex flex-col justify-end mb-2" style={{height: '150px'}}>
                  <div 
                    className="bg-blue-500 rounded-t w-full mb-1" 
                    style={{height: `${(month.applications/40)*100}%`}}
                  ></div>
                  <div 
                    className="bg-green-500 rounded-t w-full" 
                    style={{height: `${(month.hired/40)*100}%`}}
                  ></div>
                </div>
                <div className="text-xs text-muted-foreground">{month.month}</div>
                <div className="text-xs font-bold">{month.applications}/{month.hired}</div>
              </div>
            ))}
          </div>
          <div className="flex justify-center gap-4 mt-4 text-xs">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-blue-500 rounded"></div>
              <span>Applications</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-green-500 rounded"></div>
              <span>Hired</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;