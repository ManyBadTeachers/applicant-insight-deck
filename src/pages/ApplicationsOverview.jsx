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
import { FileText, Search } from "lucide-react";

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
    totalApplications: "bg-blue-100 text-blue-800",
    reviewedToday: "bg-teal-100 text-teal-800",
    submittedToday: "bg-yellow-100 text-yellow-800",
    leftInProcess: "bg-gray-100 text-gray-800",
    waitingConfirmation: "bg-purple-100 text-purple-800",
    rejectionRate: "bg-red-100 text-red-800",
    hired: "bg-green-100 text-green-800",
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-12">
        {/* Dashboard */}
        <section>
          <h2 className="text-2xl font-bold mb-4">Quick Overview</h2>
          <div className="grid md:grid-cols-4 gap-4">
            {Object.entries(dashboardStats).map(([key, value]) => (
              <div
                key={key}
                className={`p-4 rounded-lg shadow text-center ${
                  dashboardColors[key]
                }`}
              >
                <p className="text-sm">{key.replace(/([A-Z])/g, " $1")}</p>
                <p className="text-xl font-bold">{value}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Applications Overview */}
        <section className="space-y-6">
          <h1 className="text-3xl font-extrabold text-gray-900 mb-6">
            Applications Overview
          </h1>

          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-6 items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="Search applicants..."
                className="pl-12 py-2 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <Select value={expertiseFilter} onValueChange={setExpertiseFilter}>
              <SelectTrigger className="w-44 rounded-lg border border-gray-300 shadow-sm">
                <SelectValue
                  placeholder="Expertise"
                  className="font-semibold"
                />
              </SelectTrigger>
              <SelectContent className="bg-white shadow-md rounded-md">
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
              <SelectTrigger className="w-44 rounded-lg border border-gray-300 shadow-sm">
                <SelectValue
                  placeholder="Nationality"
                  className="font-semibold"
                />
              </SelectTrigger>
              <SelectContent className="bg-white shadow-md rounded-md">
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
        <div className="border border-gray-200 rounded-lg shadow-sm overflow-hidden">
          <div className="max-h-[600px] overflow-y-auto overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead className="bg-gray-100 text-left text-gray-700 font-semibold sticky top-0 z-10">
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
                    className="border-t border-gray-200 odd:bg-white even:bg-gray-50 hover:bg-gray-100 transition-all duration-150"
                  >
                    <td className="p-3 font-semibold text-gray-900">
                      {a.fullName}
                    </td>
                    <td className="p-3">
                      <StatusBadge status={a.status} />
                    </td>
                    <td className="p-3">
                      <ExpertiseBadge expertise={a.primaryExpertise} />
                    </td>
                    <td className="p-3 text-gray-600">{a.email}</td>
                    <td className="p-3 text-gray-600">{a.phone}</td>
                    <td className="p-3 text-gray-700">{a.firstName}</td>
                    <td className="p-3 text-gray-700">{a.lastName}</td>
                    <td className="p-3">
                      <NationalityBadge nationality={a.nationality} />
                    </td>
                    <td className="p-3">
                      <Button variant="ghost" size="icon">
                        <FileText className="w-5 h-5 text-gray-600" />
                      </Button>
                    </td>
                    <td className="p-3 text-gray-600">{a.submissionDate}</td>
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
          <div className="p-4 rounded-lg shadow-md bg-white border border-gray-200">
            <p className="text-gray-700 mb-4">
              The Action Center is where you can manage manual steps in the
              hiring process.
            </p>

            {applicantSteps.map((applicant) => (
              <div
                key={applicant.id}
                className="mb-6 p-6 bg-white rounded-lg shadow-md border border-gray-200 min-h-[180px]"
              >
                {/* Name and expertise on the same row */}
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-lg">
                    {applicant.fullName}
                  </h3>
                  <ExpertiseBadge expertise={applicant.expertise} />
                </div>

                {/* Dummy text */}
                <p className="text-gray-500 mb-4">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                </p>

                {/* Steps scroll horizontally */}
                <div className="flex gap-2 overflow-x-auto">
                  {applicant.steps.map((step, index) => (
                    <span
                      key={index}
                      className={`flex-shrink-0 px-3 py-1 text-sm font-medium text-white rounded ${
                        step.color === "green"
                          ? "bg-green-500"
                          : step.color === "yellow"
                          ? "bg-yellow-500"
                          : "bg-red-500"
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