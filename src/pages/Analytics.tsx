import Navigation from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Users, Clock, TrendingUp, Award, Download, Calendar, Eye, Settings, BarChart3 } from "lucide-react";

// Mock data for analytics
const applicationsByRole = [
  { role: "Software Engineer", applications: 45, interviews: 12, hired: 3 },
  { role: "Product Manager", applications: 32, interviews: 8, hired: 2 },
  { role: "UX Designer", applications: 28, interviews: 10, hired: 4 },
  { role: "Data Scientist", applications: 24, interviews: 6, hired: 1 },
  { role: "Marketing Manager", applications: 18, interviews: 5, hired: 2 },
];

const conversionFunnel = [
  { stage: "Applied", count: 147, percentage: 100 },
  { stage: "Screened", count: 89, percentage: 61 },
  { stage: "Interviewed", count: 41, percentage: 28 },
  { stage: "Hired", count: 12, percentage: 8 },
];

const timeInStage = [
  { stage: "Application Review", avgDays: 2.5 },
  { stage: "Screening", avgDays: 4.2 },
  { stage: "Interview Process", avgDays: 8.7 },
  { stage: "Final Decision", avgDays: 3.1 },
];

const monthlyTrends = [
  { month: "Oct", applications: 32, hired: 2 },
  { month: "Nov", applications: 45, hired: 4 },
  { month: "Dec", applications: 38, hired: 3 },
  { month: "Jan", applications: 52, hired: 5 },
];

const statusDistribution = [
  { name: "Pending", value: 24, color: "hsl(43, 96%, 56%)" },
  { name: "In Progress", value: 18, color: "hsl(213, 94%, 68%)" },
  { name: "Passed", value: 12, color: "hsl(142, 76%, 36%)" },
  { name: "Rejected", value: 8, color: "hsl(0, 84%, 60%)" },
];

const Analytics = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Analytics Dashboard</h1>
            <p className="text-lg text-muted-foreground">
              Recruitment insights and performance metrics
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Select defaultValue="30days">
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7days">Last 7 days</SelectItem>
                <SelectItem value="30days">Last 30 days</SelectItem>
                <SelectItem value="90days">Last 90 days</SelectItem>
                <SelectItem value="1year">Last year</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Role-based Access Mockup */}
        <div className="mb-6 p-4 bg-accent rounded-lg border border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Badge variant="secondary">
                <Eye className="w-3 h-3 mr-1" />
                Recruiter View
              </Badge>
              <span className="text-sm text-muted-foreground">
                Full access to all recruitment metrics and candidate data
              </span>
            </div>
            <Button variant="outline" size="sm">
              <Settings className="w-4 h-4 mr-2" />
              Switch to Interviewer View
            </Button>
          </div>
        </div>

        {/* Key Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="p-6 border-card-border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Applications</p>
                <p className="text-3xl font-bold text-foreground">147</p>
                <p className="text-xs text-status-passed flex items-center mt-1">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  +12% from last month
                </p>
              </div>
              <div className="w-12 h-12 bg-primary-light rounded-full flex items-center justify-center">
                <Users className="w-6 h-6 text-primary" />
              </div>
            </div>
          </Card>

          <Card className="p-6 border-card-border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Interviews</p>
                <p className="text-3xl font-bold text-foreground">41</p>
                <p className="text-xs text-status-passed flex items-center mt-1">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  +8% from last month
                </p>
              </div>
              <div className="w-12 h-12 bg-primary-light rounded-full flex items-center justify-center">
                <Calendar className="w-6 h-6 text-primary" />
              </div>
            </div>
          </Card>

          <Card className="p-6 border-card-border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Hired</p>
                <p className="text-3xl font-bold text-foreground">12</p>
                <p className="text-xs text-status-passed flex items-center mt-1">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  +25% from last month
                </p>
              </div>
              <div className="w-12 h-12 bg-primary-light rounded-full flex items-center justify-center">
                <Award className="w-6 h-6 text-primary" />
              </div>
            </div>
          </Card>

          <Card className="p-6 border-card-border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg. Time to Hire</p>
                <p className="text-3xl font-bold text-foreground">18.5</p>
                <p className="text-xs text-muted-foreground mt-1">days</p>
              </div>
              <div className="w-12 h-12 bg-primary-light rounded-full flex items-center justify-center">
                <Clock className="w-6 h-6 text-primary" />
              </div>
            </div>
          </Card>
        </div>

        {/* Charts Grid - Static Mockup */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Applications by Role */}
          <Card className="p-6 border-card-border">
            <h3 className="text-lg font-semibold text-card-foreground mb-4">Applications by Role</h3>
            <div className="space-y-4">
              {applicationsByRole.map((role, index) => (
                <div key={role.role} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-foreground">{role.role}</span>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>{role.applications} apps</span>
                      <span>{role.interviews} interviews</span>
                      <span className="text-status-passed">{role.hired} hired</span>
                    </div>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div 
                      className="bg-primary rounded-full h-2 transition-all duration-500"
                      style={{ width: `${(role.applications / 45) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Status Distribution */}
          <Card className="p-6 border-card-border">
            <h3 className="text-lg font-semibold text-card-foreground mb-4">Application Status</h3>
            <div className="space-y-4">
              {statusDistribution.map((status, index) => (
                <div key={status.name} className="flex items-center justify-between p-3 rounded-lg" style={{ backgroundColor: `${status.color}10` }}>
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: status.color }}
                    ></div>
                    <span className="text-sm font-medium text-foreground">{status.name}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-foreground">{status.value}</div>
                    <div className="text-xs text-muted-foreground">
                      {Math.round((status.value / statusDistribution.reduce((a, b) => a + b.value, 0)) * 100)}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Conversion Funnel & Time Analysis */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Conversion Funnel */}
          <Card className="p-6 border-card-border">
            <h3 className="text-lg font-semibold text-card-foreground mb-4">Conversion Funnel</h3>
            <div className="space-y-4">
              {conversionFunnel.map((stage, index) => (
                <div key={stage.stage} className="relative">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-foreground">{stage.stage}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">{stage.count}</span>
                      <Badge variant="secondary" className="text-xs">
                        {stage.percentage}%
                      </Badge>
                    </div>
                  </div>
                  <div className="w-full bg-muted rounded-full h-3">
                    <div 
                      className="bg-primary rounded-full h-3 transition-all duration-500"
                      style={{ width: `${stage.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Time in Stage */}
          <Card className="p-6 border-card-border">
            <h3 className="text-lg font-semibold text-card-foreground mb-4">Average Time in Each Stage</h3>
            <div className="space-y-4">
              {timeInStage.map((stage) => (
                <div key={stage.stage} className="flex justify-between items-center p-3 bg-muted rounded-lg">
                  <span className="text-sm font-medium text-foreground">{stage.stage}</span>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm font-semibold text-primary">{stage.avgDays} days</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Monthly Trends - Static Mockup */}
        <Card className="p-6 border-card-border mt-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-card-foreground">Monthly Trends</h3>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-primary rounded-full"></div>
                <span className="text-muted-foreground">Applications</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-status-passed rounded-full"></div>
                <span className="text-muted-foreground">Hired</span>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-4 gap-4">
            {monthlyTrends.map((month, index) => (
              <div key={month.month} className="text-center">
                <div className="mb-2">
                  <div className="text-sm font-medium text-foreground">{month.month}</div>
                </div>
                <div className="space-y-2">
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">Applications</div>
                    <div className="h-20 bg-muted rounded flex items-end justify-center">
                      <div 
                        className="bg-primary rounded w-8 transition-all duration-500"
                        style={{ height: `${(month.applications / 60) * 100}%`, minHeight: '8px' }}
                      ></div>
                    </div>
                    <div className="text-sm font-medium text-primary mt-1">{month.applications}</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">Hired</div>
                    <div className="h-12 bg-muted rounded flex items-end justify-center">
                      <div 
                        className="bg-status-passed rounded w-6 transition-all duration-500"
                        style={{ height: `${(month.hired / 6) * 100}%`, minHeight: '4px' }}
                      ></div>
                    </div>
                    <div className="text-sm font-medium text-status-passed mt-1">{month.hired}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Analytics;