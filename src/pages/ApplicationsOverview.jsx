import { useState, useEffect, useMemo } from "react";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StatusBadge } from "@/components/StatusBadge";
import { NationalityBadge } from "@/components/NationalityBadge";
import { ExpertiseBadge } from "@/components/ExpertiseBadge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FileText, Search, Calendar, MessageSquare, PlusCircle } from "lucide-react";

const ApplicationsOverview = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [expertiseFilter, setExpertiseFilter] = useState("all");
  const [nationalityFilter, setNationalityFilter] = useState("all");
  const [applicants, setApplicants] = useState([]);
  const [applicantSteps, setApplicantSteps] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch applicants
        const resApplicants = await fetch(
          "http://127.0.0.1:5000/get_applicants"
        );
        const dataApplicants = await resApplicants.json();
        const formattedApplicants = dataApplicants.applicants.map(
          (a) => ({
            id: a[0].toString(),
            fullName: a[1],
            status: a[2],
            primaryExpertise: a[3],
            email: a[4],
            phone: a[5],
            firstName: a[6],
            lastName: a[7],
            nationality: a[8],
            cv: a[9],
            submissionDate: a[10].split(" ")[0],
          })
        );

        // Fetch applicant steps
        const resSteps = await fetch(
          "http://127.0.0.1:5000/applicants_hiring_steps"
        );
        const dataSteps = await resSteps.json();
        const formattedSteps = dataSteps.applicants.map((a) => ({
          id: a.id.toString(),
          fullName: a.fullName,
          expertise: a.expertise,
          steps: a.steps,
        }));

        setApplicants(formattedApplicants);
        setApplicantSteps(formattedSteps);
      } catch (error) {
        console.error("Error fetching applicants or steps:", error);
      }
    };

    fetchData();
  }, []);

  // Filtered applicants
  const filteredApplicants = useMemo(() => {
    return applicants.filter((a) => {
      const matchesSearch =
        a.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.phone.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesExpertise =
        expertiseFilter === "all" ||
        a.primaryExpertise.toLowerCase() === expertiseFilter.toLowerCase();
      const matchesNationality =
        nationalityFilter === "all" ||
        a.nationality.toLowerCase() === nationalityFilter.toLowerCase();
      return matchesSearch && matchesExpertise && matchesNationality;
    });
  }, [applicants, searchQuery, expertiseFilter, nationalityFilter]);

  // Dashboard stats
  const dashboardStats = {
    totalApplications: 35,
    reviewedToday: 5,
    submittedToday: 7,
    leftInProcess: 12,
    waitingConfirmation: 3,
    rejectionRate: "92%",
    hired: 2,
  };
  const dashboardColors = {
    totalApplications: "bg-primary/10 text-primary border border-primary/20",
    reviewedToday: "bg-emerald-50 text-emerald-700 border border-emerald-200",
    submittedToday: "bg-amber-50 text-amber-700 border border-amber-200",
    leftInProcess: "bg-muted text-muted-foreground border border-border",
    waitingConfirmation: "bg-purple-50 text-purple-700 border border-purple-200",
    rejectionRate: "bg-red-50 text-red-700 border border-red-200",
    hired: "bg-green-50 text-green-700 border border-green-200",
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-12">
        {/* Dashboard */}
        <section>
          <h2 className="text-2xl font-bold mb-4 text-foreground">Quick Overview</h2>
          <div className="grid md:grid-cols-4 gap-4">
            {Object.entries(dashboardStats).map(([key, value]) => (
              <div
                key={key}
                className={`p-4 rounded-lg shadow-sm text-center transition-all hover:shadow-md ${
                  dashboardColors[key]
                }`}
              >
                <p className="text-sm font-medium opacity-80">{key.replace(/([A-Z])/g, " $1")}</p>
                <p className="text-xl font-bold">{value}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Applications Overview */}
        <section className="space-y-6">
          <h1 className="text-3xl font-extrabold text-foreground mb-6">
            Applications Overview
          </h1>

          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-6 items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <Input
                placeholder="Search applicants..."
                className="pl-12"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <Select value={expertiseFilter} onValueChange={setExpertiseFilter}>
              <SelectTrigger className="w-44">
                <SelectValue
                  placeholder="Expertise"
                  className="font-semibold"
                />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Expertise</SelectItem>
                <SelectItem value="IT">IT</SelectItem>
                <SelectItem value="Business">Business</SelectItem>
                <SelectItem value="Physics">Physics</SelectItem>
                <SelectItem value="Materials Science">
                  Materials Science
                </SelectItem>
                <SelectItem value="Biotechnology">Biotechnology</SelectItem>
                <SelectItem value="Life Sciences">Life Sciences</SelectItem>
                <SelectItem value="Engineering">Engineering</SelectItem>
                <SelectItem value="Finance">Finance</SelectItem>
                <SelectItem value="Quantum">Quantum</SelectItem>
                <SelectItem value="Earth Sciences">Earth Sciences</SelectItem>
                <SelectItem value="Machine Learning">
                  Machine Learning
                </SelectItem>
                <SelectItem value="Agrotech">Agrotech</SelectItem>
                <SelectItem value="Chemistry">Chemistry</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={nationalityFilter}
              onValueChange={setNationalityFilter}
            >
              <SelectTrigger className="w-44">
                <SelectValue
                  placeholder="Nationality"
                  className="font-semibold"
                />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="Swedish">Swedish</SelectItem>
                <SelectItem value="American">American</SelectItem>
                <SelectItem value="Spanish">Spanish</SelectItem>
                <SelectItem value="Korean">Korean</SelectItem>
                <SelectItem value="German">German</SelectItem>
                <SelectItem value="Indian">Indian</SelectItem>
                <SelectItem value="Chinese">Chinese</SelectItem>
                <SelectItem value="Japanese">Japanese</SelectItem>
                <SelectItem value="Italian">Italian</SelectItem>
                <SelectItem value="Canadian">Canadian</SelectItem>
                <SelectItem value="Czech">Czech</SelectItem>
                <SelectItem value="British">British</SelectItem>
                <SelectItem value="Brazilian">Brazilian</SelectItem>
                <SelectItem value="French">French</SelectItem>
                <SelectItem value="Egyptian">Egyptian</SelectItem>
                <SelectItem value="Pakistani">Pakistani</SelectItem>
                <SelectItem value="Russian">Russian</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </section>

        {/* Table */}
        <div className="border border-card-border rounded-lg shadow-sm overflow-hidden bg-card">
          <div className="max-h-[600px] overflow-y-auto overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead className="bg-muted text-left text-muted-foreground font-semibold sticky top-0 z-10">
                <tr>
                  <th className="p-3">Full Name</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Expertise</th>
                  <th className="p-3">Email</th>
                  <th className="p-3">Phone</th>
                  <th className="p-3">First Name</th>
                  <th className="p-3">Last Name</th>
                  <th className="p-3">Nationality</th>
                  <th className="p-3">CV</th>
                  <th className="p-3">Submission Date</th>
                </tr>
              </thead>
              <tbody>
                {filteredApplicants.map((a) => (
                  <tr
                    key={a.id}
                    className="border-t border-border odd:bg-card even:bg-muted/30 hover:bg-accent/50 transition-all duration-150"
                  >
                    <td className="p-3 font-semibold text-card-foreground">
                      {a.fullName}
                    </td>
                    <td className="p-3">
                      <StatusBadge status={a.status} />
                    </td>
                    <td className="p-3">
                      <ExpertiseBadge expertise={a.primaryExpertise} />
                    </td>
                    <td className="p-3 text-muted-foreground">{a.email}</td>
                    <td className="p-3 text-muted-foreground">{a.phone}</td>
                    <td className="p-3 text-card-foreground">{a.firstName}</td>
                    <td className="p-3 text-card-foreground">{a.lastName}</td>
                    <td className="p-3">
                      <NationalityBadge nationality={a.nationality} />
                    </td>
                     <td className="p-3">
                       <Button variant="ghost" size="icon">
                         <FileText className="w-5 h-5 text-muted-foreground" />
                       </Button>
                     </td>
                     <td className="p-3 text-muted-foreground">{a.submissionDate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Action Center */}
        <section className="space-y-6">
          <h2 className="text-2xl font-bold mb-4">Action Center</h2>

          {/* Description Card */}
          <div className="p-6 rounded-lg shadow-sm bg-card border border-card-border">
            <p className="text-card-foreground mb-4">
              The Action Center is where you can manage manual steps in the
              hiring process.
            </p>

            {applicantSteps.map((applicant) => (
              <div
                key={applicant.id}
                className="mb-6 p-6 bg-gradient-to-br from-card via-card to-accent/5 rounded-xl shadow-lg border border-card-border/50 min-h-[200px] hover:shadow-xl transition-all duration-300 hover:scale-[1.02] group"
              >
                {/* Header with name, expertise, and action menu */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg">
                      {applicant.fullName.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-card-foreground group-hover:text-primary transition-colors">
                        {applicant.fullName}
                      </h3>
                      <p className="text-sm text-muted-foreground">Candidate Review</p>
                    </div>
                  </div>
                  <ExpertiseBadge expertise={applicant.expertise} />
                </div>

                {/* Progress status and next action */}
                <div className="mb-4 p-3 bg-muted/30 rounded-lg border-l-4 border-primary/50">
                  <p className="text-sm font-medium text-card-foreground mb-1">Next Action Required:</p>
                  <p className="text-muted-foreground text-sm">
                    {applicant.steps.some(s => s.color === "yellow") 
                      ? "Schedule technical interview and review submitted documents"
                      : applicant.steps.some(s => s.color === "green")
                      ? "Final review pending - candidate shows strong potential"
                      : "Review application and provide feedback"}
                  </p>
                </div>

                {/* Action buttons */}
                <div className="flex flex-wrap gap-2 mb-4">
                  <Button size="sm" variant="default" className="h-8 text-xs">
                    <Calendar className="w-3 h-3 mr-1" />
                    Schedule Interview
                  </Button>
                  <Button size="sm" variant="outline" className="h-8 text-xs">
                    <MessageSquare className="w-3 h-3 mr-1" />
                    Send Message
                  </Button>
                  <Button size="sm" variant="ghost" className="h-8 text-xs">
                    <FileText className="w-3 h-3 mr-1" />
                    Review CV
                  </Button>
                  <Button size="sm" variant="ghost" className="h-8 text-xs">
                    <PlusCircle className="w-3 h-3 mr-1" />
                    Add Note
                  </Button>
                </div>

                {/* Steps with improved styling */}
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {applicant.steps.map((step, index) => (
                    <span
                      key={index}
                      className={`flex-shrink-0 px-3 py-1.5 text-xs font-medium rounded-full border transition-all hover:scale-105 ${
                        step.color === "green"
                          ? "bg-status-passed text-status-passed-foreground border-status-passed/30 shadow-sm"
                          : step.color === "yellow"
                          ? "bg-status-pending text-status-pending-foreground border-status-pending/30 shadow-sm animate-pulse"
                          : "bg-status-rejected text-status-rejected-foreground border-status-rejected/30"
                      }`}
                    >
                      {step.label.replace(/_/g, " ")}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default ApplicationsOverview;