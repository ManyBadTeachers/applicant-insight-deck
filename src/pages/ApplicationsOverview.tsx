import { useState } from "react";
import Navigation from "@/components/Navigation";
import ApplicantCard from "@/components/ApplicantCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, Download, RefreshCw } from "lucide-react";

// Mock data
const mockApplicants = [
  {
    id: "1",
    firstName: "Sarah",
    lastName: "Johnson",
    email: "sarah.johnson@email.com",
    phone: "+1 (555) 123-4567",
    nationality: "United States",
    primaryExpertise: "Software Engineering",
    otherExpertise: ["Frontend Development", "React", "TypeScript"],
    status: "In Progress" as const,
    submissionDate: "2024-01-15",
    tags: ["Engineering", "Frontend", "Senior"]
  },
  {
    id: "2",
    firstName: "Marcus",
    lastName: "Chen",
    email: "marcus.chen@email.com",
    phone: "+1 (555) 987-6543",
    nationality: "Canada",
    primaryExpertise: "UX/UI Design",
    otherExpertise: ["Product Design", "Figma", "User Research"],
    status: "Passed" as const,
    submissionDate: "2024-01-14",
    tags: ["Design", "UX", "Mid-level"]
  },
  {
    id: "3",
    firstName: "Elena",
    lastName: "Rodriguez",
    email: "elena.rodriguez@email.com",
    phone: "+1 (555) 456-7890",
    nationality: "Spain",
    primaryExpertise: "Digital Marketing",
    otherExpertise: ["SEO", "Content Strategy", "Analytics"],
    status: "Pending" as const,
    submissionDate: "2024-01-16",
    tags: ["Marketing", "Digital", "Senior"]
  },
  {
    id: "4",
    firstName: "Ahmed",
    lastName: "Hassan",
    email: "ahmed.hassan@email.com",
    phone: "+1 (555) 321-0987",
    nationality: "Egypt",
    primaryExpertise: "Data Science",
    otherExpertise: ["Machine Learning", "Python", "Statistics"],
    status: "Rejected" as const,
    submissionDate: "2024-01-13",
    tags: ["Data Science", "ML", "Senior"]
  },
  {
    id: "5",
    firstName: "Priya",
    lastName: "Patel",
    email: "priya.patel@email.com",
    phone: "+1 (555) 654-3210",
    nationality: "India",
    primaryExpertise: "Product Management",
    otherExpertise: ["Strategy", "Roadmapping", "Analytics"],
    status: "In Progress" as const,
    submissionDate: "2024-01-17",
    tags: ["Product", "Strategy", "Mid-level"]
  },
  {
    id: "6",
    firstName: "James",
    lastName: "Wilson",
    email: "james.wilson@email.com",
    phone: "+1 (555) 789-0123",
    nationality: "United Kingdom",
    primaryExpertise: "DevOps Engineering",
    otherExpertise: ["AWS", "Docker", "Kubernetes"],
    status: "Pending" as const,
    submissionDate: "2024-01-18",
    tags: ["Engineering", "DevOps", "Senior"]
  }
];

const ApplicationsOverview = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterExpertise, setFilterExpertise] = useState("all");

  const statusCounts = {
    pending: mockApplicants.filter(a => a.status === "Pending").length,
    inProgress: mockApplicants.filter(a => a.status === "In Progress").length,
    passed: mockApplicants.filter(a => a.status === "Passed").length,
    rejected: mockApplicants.filter(a => a.status === "Rejected").length
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Applications Overview</h1>
          <p className="text-lg text-muted-foreground">
            Manage and review all submitted applications
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-card border border-card-border rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold text-status-pending">{statusCounts.pending}</p>
              </div>
              <div className="w-8 h-8 bg-status-pending rounded-full"></div>
            </div>
          </div>
          <div className="bg-card border border-card-border rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">In Progress</p>
                <p className="text-2xl font-bold text-status-progress">{statusCounts.inProgress}</p>
              </div>
              <div className="w-8 h-8 bg-status-progress rounded-full"></div>
            </div>
          </div>
          <div className="bg-card border border-card-border rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Passed</p>
                <p className="text-2xl font-bold text-status-passed">{statusCounts.passed}</p>
              </div>
              <div className="w-8 h-8 bg-status-passed rounded-full"></div>
            </div>
          </div>
          <div className="bg-card border border-card-border rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Rejected</p>
                <p className="text-2xl font-bold text-status-rejected">{statusCounts.rejected}</p>
              </div>
              <div className="w-8 h-8 bg-status-rejected rounded-full"></div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search by name, email, or expertise..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="in-progress">In Progress</SelectItem>
              <SelectItem value="passed">Passed</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filterExpertise} onValueChange={setFilterExpertise}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter by expertise" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Areas</SelectItem>
              <SelectItem value="engineering">Engineering</SelectItem>
              <SelectItem value="design">Design</SelectItem>
              <SelectItem value="marketing">Marketing</SelectItem>
              <SelectItem value="data-science">Data Science</SelectItem>
              <SelectItem value="product">Product</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export CSV
          </Button>
        </div>

        {/* Horizontal Scrolling Applicant Cards */}
        <div className="relative">
          <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide">
            {mockApplicants.map((applicant) => (
              <ApplicantCard key={applicant.id} applicant={applicant} />
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 flex flex-wrap gap-4">
          <Button variant="outline" className="flex items-center gap-2">
            <RefreshCw className="w-4 h-4" />
            Refresh Data
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <Filter className="w-4 h-4" />
            Advanced Filters
          </Button>
          <div className="flex items-center gap-2 ml-auto">
            <span className="text-sm text-muted-foreground">
              Showing {mockApplicants.length} applications
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicationsOverview;