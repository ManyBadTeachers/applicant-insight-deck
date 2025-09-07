import { useState, useEffect, useMemo } from "react";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StatusBadge } from "@/components/StatusBadge";
import { NationalityBadge } from "@/components/NationalityBadge";
import { ExpertiseBadge } from "@/components/ExpertiseBadge";
import NotesSystem from "@/components/NotesSystem";
import HiringSteps from "../components/HiringSteps";
import ComparisonModal from "@/components/ComparisonModal";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  FileText,
  Search,
  Calendar,
  MessageSquare,
  PlusCircle,
  Heart,
  Users,
  GitCompare,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

const ApplicationsOverview = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [expertiseFilter, setExpertiseFilter] = useState("all");
  const [nationalityFilter, setNationalityFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [applicants, setApplicants] = useState([]);
  const [applicantSteps, setApplicantSteps] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [selectedApplicants, setSelectedApplicants] = useState([]);
  const [showComparison, setShowComparison] = useState(false);
  const [actionCenterFilter, setActionCenterFilter] = useState("all");
  const [expandedActionCards, setExpandedActionCards] = useState({});
  const [dashboardStats, setDashboardStats] = useState({});
  const [forms, setForms] = useState([]);
  const [selectedForm, setSelectedForm] = useState("");
  const [showNotePopup, setShowNotePopup] = useState(false);
  const [noteId, setNoteId] = useState(1);

  const dashboardColors = {
    total_applicants: "bg-primary/10 text-primary border border-primary/20",
    reviewed_today: "bg-emerald-50 text-emerald-700 border border-emerald-200",
    submitted_today: "bg-amber-50 text-amber-700 border border-amber-200",
    in_process: "bg-muted text-muted-foreground border border-border",
    rejection_rate: "bg-red-50 text-red-700 border border-red-200",
    hired_this_year: "bg-green-50 text-green-700 border border-green-200",
  };

  // Fetch all forms on mount
  useEffect(() => {
    const fetchForms = async () => {
      try {
        const res = await fetch("http://127.0.0.1:5000/get_all_forms");
        const data = await res.json();
        setForms(data.forms);
        if (data.forms.length > 0) setSelectedForm(data.forms[0].form_id);
      } catch (error) {
        console.error("Error fetching forms:", error);
      }
    };
    fetchForms();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (!selectedForm) return;

      try {
        // Fetch applicants for the selected form
        const resApplicants = await fetch(
          `http://127.0.0.1:5000/get_applicants?form_id=${selectedForm}`
        );
        const dataApplicants = await resApplicants.json();
        const formattedApplicants = dataApplicants.applicants.map((a) => ({
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
          form_id: a[11],
        }));
        setApplicants(formattedApplicants);

        // Fetch applicants in hiring process for the selected form
        const resSteps = await fetch(
          `http://127.0.0.1:5000/get_applicants_in_hiring_process?form_id=${selectedForm}`
        );
        const dataSteps = await resSteps.json();
        const formattedSteps = dataSteps.applicants.map((a) => ({
          id: a.id.toString(),
          fullName: a.fullName,
          expertise: a.expertise,
        }));
        setApplicantSteps(formattedSteps);

        // Fetch statistics for the selected form
        const resStats = await fetch(
          `http://127.0.0.1:5000/get_hiring_statistics?form_id=${selectedForm}`
        );
        const statsData = await resStats.json();
        setDashboardStats(statsData);

        // Load favorites from localStorage
        const savedFavorites = JSON.parse(
          localStorage.getItem("hr-favorites") || "[]"
        );
        setFavorites(savedFavorites);
      } catch (error) {
        console.error("Error fetching data for selected form:", error);
      }
    };

    fetchData();
  }, [selectedForm]); // refetch everything when selectedForm changes

  // Favorites management
  const toggleFavorite = (applicantId) => {
    const newFavorites = favorites.includes(applicantId)
      ? favorites.filter((id) => id !== applicantId)
      : [...favorites, applicantId];

    setFavorites(newFavorites);
    localStorage.setItem("hr-favorites", JSON.stringify(newFavorites));
  };

  // Selection management for comparison
  const toggleSelection = (applicant) => {
    const isSelected = selectedApplicants.some((a) => a.id === applicant.id);
    if (isSelected) {
      setSelectedApplicants(
        selectedApplicants.filter((a) => a.id !== applicant.id)
      );
    } else {
      setSelectedApplicants([...selectedApplicants, applicant]);
    }
  };

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

      // Get hiring status - simplified since no steps data available
      const applicantStep = applicantSteps.find((step) => step.id === a.id);
      let hiringStatus = "unknown";
      if (applicantStep) {
        hiringStatus = "in_process"; // Default to in_process since we don't have step details
      }

      const matchesStatus =
        statusFilter === "all" || hiringStatus === statusFilter;

      return (
        matchesSearch && matchesExpertise && matchesNationality && matchesStatus
      );
    });
  }, [
    applicants,
    searchQuery,
    expertiseFilter,
    nationalityFilter,
    statusFilter,
    applicantSteps,
  ]);

  // Filtered applicants for Action Center - no filtering logic, just show all
  const filteredActionCenterApplicants = useMemo(() => {
    return applicantSteps;
  }, [applicantSteps]);

  const handleNotes = (id) => {
    console.log(id);
    setNoteId(id);
    setShowNotePopup(true);
    // Close all expanded action cards when opening notes
    setExpandedActionCards({});
  };

  const toggleActionCard = (applicantId) => {
    const isCurrentlyExpanded = expandedActionCards[applicantId];
    
    if (isCurrentlyExpanded) {
      // If clicking on the already expanded card, just close it
      setExpandedActionCards({});
    } else {
      // Close any notes popup and expand only this card
      setShowNotePopup(false);
      setExpandedActionCards({ [applicantId]: true });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {showNotePopup && (
        <NotesSystem
          applicantId={noteId}
          onClose={() => setShowNotePopup(false)}
        />
      )}

      <div className="max-w-7xl mx-auto px-4 py-8 space-y-12">
        {/* Dashboard */}
        <section>
          {/* Heading for the section */}
          <h1 className="text-3xl font-extrabold text-foreground mb-6">
            Select Form
          </h1>

          {/* Form selector */}
          <div className="mb-6">
            <Select value={selectedForm} onValueChange={setSelectedForm}>
              <SelectTrigger className="w-56">
                <SelectValue
                  placeholder="Choose a form"
                  className="font-medium text-foreground"
                />
              </SelectTrigger>
              <SelectContent>
                {forms.map((form) => (
                  <SelectItem key={form.form_id} value={form.form_id}>
                    {form.name.replace(/_/g, " ")}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Quick Overview Stats */}
          <h2 className="text-2xl font-bold mb-4 text-foreground">
            Quick Overview
          </h2>
          <div className="grid md:grid-cols-4 gap-4">
            {dashboardStats &&
              Object.values(dashboardStats)[0] &&
              Object.entries(Object.values(dashboardStats)[0]).map(
                ([key, value]) => (
                  <div
                    key={key}
                    className={`p-4 rounded-lg shadow-sm text-center transition-all hover:shadow-md ${dashboardColors[key]}`}
                  >
                    <p className="text-sm font-medium opacity-80">
                      {key.replace(/_/g, " ")}
                    </p>
                    <p className="text-xl font-bold">{value}</p>
                  </div>
                )
              )}
          </div>
        </section>

        {/* Applications Overview */}
        <section className="space-y-6">
          <h1 className="text-3xl font-extrabold text-foreground mb-6">
            Applications Overview
          </h1>

          {/* Filters and Actions */}
          <div className="flex flex-col md:flex-row gap-4 mb-6 items-center justify-between">
            <div className="flex flex-col md:flex-row gap-4 flex-1">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                <Input
                  placeholder="Search applicants..."
                  className="pl-12"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <Select
                value={expertiseFilter}
                onValueChange={setExpertiseFilter}
              >
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

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-44">
                  <SelectValue placeholder="Status" className="font-semibold" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="hired">Hired</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                  <SelectItem value="in_process">In Process</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Action buttons */}
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="gap-2"
                onClick={() => setShowComparison(true)}
                disabled={selectedApplicants.length < 2}
              >
                <GitCompare className="w-4 h-4" />
                Compare ({selectedApplicants.length})
              </Button>
            </div>
          </div>
        </section>

        {/* Table */}
        <div className="border border-card-border rounded-lg shadow-sm overflow-hidden bg-card">
          <div className="max-h-[600px] overflow-y-auto overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead className="bg-muted text-left text-muted-foreground font-semibold sticky top-0 z-10">
                <tr>
                  <th className="p-3">Select</th>
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
                  <th className="p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredApplicants.map((a) => (
                  <tr
                    key={a.id}
                    className="border-t border-border odd:bg-card even:bg-muted/30 hover:bg-accent/50 transition-all duration-150"
                  >
                    <td className="p-3">
                      <input
                        type="checkbox"
                        checked={selectedApplicants.some(
                          (app) => app.id === a.id
                        )}
                        onChange={() => toggleSelection(a)}
                        className="rounded border-border"
                      />
                    </td>
                    <td className="p-3 font-semibold text-card-foreground">
                      <div className="flex items-center gap-2">
                        {a.fullName}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleFavorite(a.id)}
                          className="h-6 w-6 p-0"
                        >
                          <Heart
                            className={`w-4 h-4 ${
                              favorites.includes(a.id)
                                ? "fill-red-500 text-red-500"
                                : "text-muted-foreground"
                            }`}
                          />
                        </Button>
                      </div>
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
                    <td className="p-3 text-muted-foreground">
                      {a.submissionDate}
                    </td>
                    <td className="p-3">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleNotes(a.id)}
                        className="gap-1"
                      >
                        <MessageSquare className="w-4 h-4" />
                        Notes
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Action Center */}
        <section className="space-y-6">
          <h2 className="text-2xl font-bold mb-4">Action Center</h2>

          {/* Description and Filter */}
          <div className="p-6 rounded-lg shadow-sm bg-card border border-card-border space-y-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-card-foreground mb-2">
                  Hiring Process Management
                </h3>
                <p className="text-card-foreground">
                  Review and manage candidates at different stages of the hiring
                  pipeline. Take action on pending interviews, document reviews,
                  and track progress through each step of your recruitment
                  process.
                </p>
              </div>

              {/* Filter for Action Center */}
              <div className="flex-shrink-0">
                <Select value={actionCenterFilter}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Candidates</SelectItem>
                    <SelectItem value="hired">Hired Candidates</SelectItem>
                    <SelectItem value="rejected">
                      Rejected Candidates
                    </SelectItem>
                    <SelectItem value="in_process">In Process</SelectItem>
                    <SelectItem value="needs_attention">
                      Needs Attention
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Candidates List */}
          <div className="space-y-4">
            {filteredActionCenterApplicants.map((applicant) => {
              const isExpanded = expandedActionCards[applicant.id];

              return (
                <div
                  key={applicant.id}
                  className="p-4 bg-gradient-to-br from-card via-card to-accent/5 rounded-xl shadow-lg border border-card-border/50 hover:shadow-xl transition-all duration-300 group cursor-pointer"
                  onClick={() => toggleActionCard(applicant.id)}
                >
                  {/* Compact Header - Always Visible */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                        {applicant.fullName
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </div>
                      <div>
                        <h3 className="font-semibold text-card-foreground">
                          {applicant.fullName}
                        </h3>
                        <div onClick={(e) => e.stopPropagation()}>
                          <ExpertiseBadge expertise={applicant.expertise} />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Expanded Content - Only Visible When Expanded */}
                  {isExpanded && (
                    <div className="mt-4 space-y-4 animate-accordion-down">
                      {/* Progress status and next action */}
                      <div className="p-3 bg-muted/30 rounded-lg border-l-4 border-primary/50">
                        <p className="text-sm font-medium text-card-foreground mb-1">
                          Next Action Required:
                        </p>
                        <p>
                          Lorem ipsum dolor sit amet consectetur adipisicing
                          elit. Minima impedit explicabo facere, corporis eaque
                          nobis velit labore voluptatum et optio laborum qui
                          consequatur ab modi dolorem exercitationem. Molestias,
                          magnam explicabo.
                        </p>
                      </div>

                      {/* Detailed Steps */}
                      <div className="flex flex-wrap gap-2">
                        <HiringSteps applicantId={applicant.id} />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* Comparison Modal*/}

        <ComparisonModal
          isOpen={showComparison}
          onClose={() => setShowComparison(false)}
          applicants={selectedApplicants}
        />
      </div>
    </div>
  );
};

export default ApplicationsOverview;
