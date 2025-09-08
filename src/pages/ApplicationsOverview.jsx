import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StatusBadge } from "@/components/StatusBadge";
import { HiringStatusBadge } from "@/components/HiringStatusBadge";
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
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
  Loader2,
} from "lucide-react";

const ApplicationsOverview = () => {
  const navigate = useNavigate();
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
  const [forms, setForms] = useState([]);
  const [selectedForm, setSelectedForm] = useState("");
  const [showNotePopup, setShowNotePopup] = useState(false);
  const [noteId, setNoteId] = useState(1);
  const [showAnswersPopup, setShowAnswersPopup] = useState(false);
  const [answersLoading, setAnswersLoading] = useState(false);
  const [answersData, setAnswersData] = useState(null);
  const [currentApplicantName, setCurrentApplicantName] = useState("");

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
          Status: a.Status,
        }));
        setApplicantSteps(formattedSteps);

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

      // Get hiring status from the API Status field
      const applicantStep = applicantSteps.find((step) => step.id === a.id);
      let hiringStatus = "unknown";
      if (applicantStep && applicantStep.Status) {
        hiringStatus = applicantStep.Status.toLowerCase().replace(" ", "_");
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

  // Filtered applicants for Action Center
  const filteredActionCenterApplicants = useMemo(() => {
    if (actionCenterFilter === "all") {
      return applicantSteps;
    }
    
    return applicantSteps.filter((applicant) => {
      switch (actionCenterFilter) {
        case "hired":
          return applicant.Status === "Hired";
        case "rejected":
          return applicant.Status === "Rejected";
        case "in_process":
          return applicant.Status === "In Process";
        default:
          return true;
      }
    });
  }, [applicantSteps, actionCenterFilter]);

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

  const handleAnswers = async (applicantId, applicantName) => {
    setCurrentApplicantName(applicantName);
    setAnswersLoading(true);
    setShowAnswersPopup(true);
    setAnswersData(null);
    
    try {
      const response = await fetch(`http://127.0.0.1:5000/get_applicants_answers?applicant_id=${applicantId}`);
      const data = await response.json();
      setAnswersData(data);
    } catch (error) {
      console.error("Error fetching applicant answers:", error);
      setAnswersData({ error: true });
    } finally {
      setAnswersLoading(false);
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

      {/* Answers Popup */}
      <Dialog open={showAnswersPopup} onOpenChange={setShowAnswersPopup}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Applicant Answers</DialogTitle>
            <DialogDescription>
              Answers from {currentApplicantName}
            </DialogDescription>
          </DialogHeader>
          
          {/* Status Information */}
          <div className="bg-amber-50 border border-amber-200 rounded-md p-4 mb-4">
            <div className="space-y-3">
              <p className="text-sm text-gray-700">
                These questions are manually transferred into the system. 
                <span className="text-amber-600 font-medium"> Automatic integration coming soon.</span>
              </p>
              
              <div className="flex items-center space-x-2 text-amber-600">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-sm">Trying to sync questions with form submissions</span>
              </div>
              
              <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
                <p className="text-xs text-blue-700">
                  <strong>Note:</strong> If the sync process never ends, please contact{' '}
                  <a href="mailto:simon.skott@zazventures.com" className="text-blue-600 underline hover:text-blue-800">
                    simon.skott@zazventures.com
                  </a>
                </p>
              </div>
            </div>
          </div>
          
          <div className="mt-4">
            {answersLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin mr-2" />
                <span>Loading answers...</span>
              </div>
            ) : answersData ? (
              answersData.error ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p>Couldn't get answers from {currentApplicantName}</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {answersData.answers ? (
                    answersData.answers.map((answer, index) => (
                      <div key={index} className="p-4 border rounded-lg">
                        <h4 className="font-semibold mb-2">{answer.question || `Question ${index + 1}`}</h4>
                        <p className="text-muted-foreground">{answer.answer || answer}</p>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <p>Couldn't get answers from {currentApplicantName}</p>
                    </div>
                  )}
                </div>
              )
            ) : null}
          </div>
        </DialogContent>
      </Dialog>

      <div className="max-w-7xl mx-auto px-4 py-8 space-y-12">
        {/* Dashboard */}
        <section className="space-y-8">
          {/* Form Selection Card */}
          <div className="bg-gradient-to-br from-card via-card to-accent/5 rounded-2xl p-8 border border-card-border/50 shadow-lg">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold text-foreground">
                  HR Dashboard
                </h1>
                <p className="text-muted-foreground text-lg">
                  Select a form to view applications and manage the hiring process
                </p>
              </div>
              <div className="flex-shrink-0">
                <Select value={selectedForm} onValueChange={setSelectedForm}>
                  <SelectTrigger className="w-80 h-12 text-base font-medium bg-background/50 border-2 border-primary/20 hover:border-primary/40 transition-colors">
                    <SelectValue
                      placeholder="Choose a form to analyze"
                      className="font-medium"
                    />
                  </SelectTrigger>
                  <SelectContent className="w-80">
                    {forms.map((form) => (
                      <SelectItem 
                        key={form.form_id} 
                        value={form.form_id}
                        className="text-base py-3"
                      >
                        {form.name.replace(/_/g, " ")}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

        </section>

        {/* Applications Overview */}
        <section className="space-y-6">
          <div className="bg-gradient-to-br from-card via-card to-accent/5 rounded-2xl p-8 border border-card-border/50 shadow-lg space-y-8">
            <h1 className="text-3xl font-bold text-foreground">
              Applications Overview
            </h1>

            {/* Filters and Actions */}
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
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
                  <SelectTrigger className="w-44 cursor-pointer hover:bg-gray-50 border-2 hover:border-gray-400 transition-all duration-200">
                    <SelectValue
                      placeholder="Expertise"
                      className="font-semibold"
                    />
                    <ChevronDown className="w-4 h-4 text-gray-600" />
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
                  <SelectTrigger className="w-44 cursor-pointer hover:bg-gray-50 border-2 hover:border-gray-400 transition-all duration-200">
                    <SelectValue
                      placeholder="Nationality"
                      className="font-semibold"
                    />
                    <ChevronDown className="w-4 h-4 text-gray-600" />
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
                  <SelectTrigger className="w-44 cursor-pointer hover:bg-gray-50 border-2 hover:border-gray-400 transition-all duration-200">
                    <SelectValue placeholder="Status" className="font-semibold" />
                    <ChevronDown className="w-4 h-4 text-gray-600" />
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
          </div>
        </section>

        {/* Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="max-h-[600px] overflow-y-auto overflow-x-auto">
            <table className="w-full border-collapse">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-3 py-4 text-left text-sm font-semibold text-gray-900">View Answers</th>
                  <th className="px-3 py-4 text-left text-sm font-semibold text-gray-900">View Separately</th>
                  <th className="px-3 py-4 text-left text-sm font-semibold text-gray-900">Full Name</th>
                  <th className="px-3 py-4 text-left text-sm font-semibold text-gray-900">Expertise</th>
                  <th className="px-3 py-4 text-left text-sm font-semibold text-gray-900">Email</th>
                  <th className="px-3 py-4 text-left text-sm font-semibold text-gray-900">Phone</th>
                  <th className="px-3 py-4 text-left text-sm font-semibold text-gray-900">Nationality</th>
                  <th className="px-3 py-4 text-left text-sm font-semibold text-gray-900">CV</th>
                  <th className="px-3 py-4 text-left text-sm font-semibold text-gray-900">Submission Date</th>
                  <th className="px-3 py-4 text-left text-sm font-semibold text-gray-900">Status</th>
                  <th className="px-3 py-4 text-left text-sm font-semibold text-gray-900">Actions</th>
                  <th className="px-3 py-4 text-left text-sm font-semibold text-gray-900">Select</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredApplicants.map((a, index) => (
                  <tr
                    key={a.id}
                    className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'} hover:bg-blue-50 transition-colors duration-150`}
                  >
                    <td className="px-3 py-4">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleAnswers(a.id, a.fullName)}
                        disabled={answersLoading}
                        className="gap-2"
                      >
                        {answersLoading ? (
                          <Loader2 className="w-3 h-3 animate-spin" />
                        ) : (
                          <FileText className="w-3 h-3" />
                        )}
                        {answersLoading ? "Loading..." : "Answers"}
                      </Button>
                    </td>
                    <td className="px-3 py-4">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => navigate(`/applicant/${a.id}`)}
                        className="gap-2"
                      >
                        <Search className="w-3 h-3" />
                        View
                      </Button>
                    </td>
                    <td className="px-3 py-4">
                      <div className="flex items-center gap-3">
                        <span className="font-semibold text-gray-900 text-sm">{a.fullName}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleFavorite(a.id)}
                          className="h-6 w-6 p-0 hover:bg-red-50"
                        >
                          <Heart
                            className={`w-4 h-4 ${
                              favorites.includes(a.id)
                                ? "fill-red-500 text-red-500"
                                : "text-gray-400 hover:text-red-400"
                            }`}
                          />
                        </Button>
                      </div>
                    </td>
                     <td className="px-3 py-4">
                       <ExpertiseBadge expertise={a.primaryExpertise} />
                     </td>
                     <td className="px-3 py-4 text-sm text-gray-700">{a.email}</td>
                     <td className="px-3 py-4 text-sm text-gray-700">{a.phone}</td>
                     <td className="px-3 py-4">
                       <NationalityBadge nationality={a.nationality} />
                     </td>
                     <td className="px-3 py-4">
                       <Button variant="ghost" size="icon" className="hover:bg-gray-100">
                         <FileText className="w-5 h-5 text-gray-600" />
                       </Button>
                     </td>
                     <td className="px-3 py-4 text-sm text-gray-700">
                       {a.submissionDate}
                     </td>
                     <td className="px-3 py-4">
                       {(() => {
                         const applicantStep = applicantSteps.find((step) => step.id === a.id);
                         const hiringStatus = applicantStep?.Status || a.status;
                         return <StatusBadge status={hiringStatus} />;
                       })()}
                     </td>
                     <td className="px-3 py-4">
                       <Button
                         variant="outline"
                         size="sm"
                         onClick={() => handleNotes(a.id)}
                         className="gap-2 border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all duration-200"
                       >
                         <MessageSquare className="w-4 h-4" />
                         Notes
                       </Button>
                     </td>
                     <td className="px-3 py-4">
                       <input
                         type="checkbox"
                         checked={selectedApplicants.some(
                           (app) => app.id === a.id
                         )}
                         onChange={() => toggleSelection(a)}
                         className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                       />
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
                <h3 className="text-xl font-bold text-card-foreground mb-3">
                  Manage Your Hiring Pipeline
                </h3>
                <p className="text-base text-card-foreground leading-relaxed">
                  See all candidates and where they are in your hiring process. Click on any candidate to move them to the next step or update their status.
                </p>
              </div>

              {/* Filter for Action Center */}
              <div className="flex-shrink-0">
                <Select value={actionCenterFilter} onValueChange={setActionCenterFilter}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Applicants</SelectItem>
                    <SelectItem value="hired">Hired Applicants</SelectItem>
                    <SelectItem value="rejected">
                      Rejected Applicants
                    </SelectItem>
                    <SelectItem value="in_process">In Process</SelectItem>
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
                  className="p-4 bg-gradient-to-br from-card via-card to-accent/5 rounded-xl shadow-lg border-2 border-card-border/50 hover:shadow-2xl hover:shadow-primary/20 hover:border-primary/40 hover:bg-gradient-to-br hover:from-card/90 hover:via-card/90 hover:to-accent/10 hover:scale-[1.02] transition-all duration-300 group cursor-pointer transform-gpu"
                  onClick={() => toggleActionCard(applicant.id)}
                >
                  {/* Compact Header - Always Visible */}
                   <div className="flex items-center justify-between">
                     <div className="flex items-center gap-4">
                       <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 flex items-center justify-center text-primary font-bold text-sm shadow-sm">
                         {applicant.fullName
                           .split(" ")
                           .map((n) => n[0])
                           .join("")}
                       </div>
                       <div className="flex items-center gap-3">
                         <div>
                           <h3 className="font-semibold text-card-foreground text-base">
                             {applicant.fullName}
                           </h3>
                         </div>
                         <div onClick={(e) => e.stopPropagation()}>
                           <ExpertiseBadge expertise={applicant.expertise} />
                         </div>
                       </div>
                     </div>
                     <div className="flex-shrink-0" onClick={(e) => e.stopPropagation()}>
                       <HiringStatusBadge status={applicant.Status} />
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
