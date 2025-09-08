import React, { useState, useEffect } from "react";
import Navigation from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  FileText, 
  Users, 
  Clock, 
  Mail, 
  XCircle, 
  CheckCircle, 
  Filter, 
  Search, 
  MessageSquare, 
  GitCompare,
  Calendar,
  Phone,
  Flag,
  Briefcase,
  Eye,
  Settings,
  ArrowRight,
  Target,
  Zap,
  Shield,
  BookOpen
} from "lucide-react";

const mapTitle = (subject) => {
  switch (subject) {
    case "Application Status Update":
      return "Screening Failure";
    case "Interview Outcome":
      return "Interview Failure";
    case "Application Process Update":
      return "Contract Could Not Be Agreed";
    case "Test Results Notification":
      return "Writing Test Failure";
    default:
      return subject;
  }
};

const Docs = () => {
  const [emails, setEmails] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [tempBody, setTempBody] = useState("");

  const fetchEmails = async () => {
    try {
      const res = await fetch("http://127.0.0.1:5000/get_rejection_emails");
      const data = await res.json();
      const mappedEmails = data.RejectionEmails.map(
        ([id, subject, body]) => ({
          id,
          title: mapTitle(subject),
          subject,
          body: body.replace(/\r\n/g, "\n"),
        })
      );
      setEmails(mappedEmails);
    } catch (err) {
      console.error("Failed to fetch emails:", err);
    }
  };

  useEffect(() => {
    fetchEmails();
  }, []);

  const handleEdit = (index) => {
    setEditingIndex(index);
    setTempBody(emails[index].body);
  };

  const handleCancel = () => {
    setEditingIndex(null);
  };

  const handleSaveToBackend = async (index) => {
    const email = emails[index];
    try {
      const res = await fetch("http://127.0.0.1:5000/update_rejection_email", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: email.id, body: tempBody }),
      });
      const result = await res.json();
      if (res.ok) {
        await fetchEmails(); // Refresh after update
        setEditingIndex(null);
      } else {
        console.error("Failed to update email:", result.error);
      }
    } catch (err) {
      console.error("Error updating email:", err);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="max-w-6xl mx-auto px-4 py-8 space-y-12">
        {/* Hero Section */}
        <div className="text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary font-medium">
            <BookOpen className="w-4 h-4" />
            Complete Documentation
          </div>
          <h1 className="text-5xl font-bold text-foreground">
            HR Platform Documentation
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Everything you need to know about managing your hiring process efficiently. 
            From application submission to contract signing, streamline your entire recruitment workflow.
          </p>
        </div>

        {/* Quick Start Guide */}
        <Card className="p-8 bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/20">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-primary" />
            </div>
            <h2 className="text-3xl font-bold text-foreground">Quick Start Guide</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">For New Users</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-center gap-2">
                  <ArrowRight className="w-4 h-4 text-primary" />
                  Navigate to the Applications Overview page
                </li>
                <li className="flex items-center gap-2">
                  <ArrowRight className="w-4 h-4 text-primary" />
                  Select a form to view submitted applications
                </li>
                <li className="flex items-center gap-2">
                  <ArrowRight className="w-4 h-4 text-primary" />
                  Use filters to find specific applicants
                </li>
                <li className="flex items-center gap-2">
                  <ArrowRight className="w-4 h-4 text-primary" />
                  Click "View" to see detailed applicant information
                </li>
              </ul>
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Managing Applicants</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-center gap-2">
                  <ArrowRight className="w-4 h-4 text-primary" />
                  Track progress through the 6-step hiring process
                </li>
                <li className="flex items-center gap-2">
                  <ArrowRight className="w-4 h-4 text-primary" />
                  Add internal notes for team collaboration
                </li>
                <li className="flex items-center gap-2">
                  <ArrowRight className="w-4 h-4 text-primary" />
                  Compare multiple applicants side-by-side
                </li>
                <li className="flex items-center gap-2">
                  <ArrowRight className="w-4 h-4 text-primary" />
                  View applicant answers and CV information
                </li>
              </ul>
            </div>
          </div>
        </Card>

        {/* What is the HR Platform */}
        <section className="space-y-8">
          <div className="text-center space-y-4">
            <h2 className="text-4xl font-bold text-foreground">What is the HR Platform?</h2>
            <p className="text-lg text-muted-foreground max-w-4xl mx-auto">
            A comprehensive hiring management system designed to streamline your recruitment process 
            from initial application to final contract signing.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Target className="w-5 h-5 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold">Centralized Management</h3>
              </div>
              <p className="text-muted-foreground">
                Manage all your job applications, applicant information, and hiring decisions 
                in one unified dashboard with powerful filtering and search capabilities.
              </p>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold">Structured Process</h3>
              </div>
              <p className="text-muted-foreground">
                Follow a standardized 6-step hiring process that ensures consistency 
                and helps you make informed decisions at every stage.
              </p>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Shield className="w-5 h-5 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold">Team Collaboration</h3>
              </div>
              <p className="text-muted-foreground">
                Built-in notes system allows your team to share insights, track 
                progress, and make collaborative hiring decisions.
              </p>
            </Card>
          </div>
        </section>

        {/* Main Feature Highlight */}
        <Card className="p-8 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
          <div className="text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 rounded-full text-blue-700 font-medium">
              <Eye className="w-4 h-4" />
              Our Best Feature
            </div>
            <h2 className="text-4xl font-bold text-foreground">
              Detailed Applicant Analysis - One at a Time
            </h2>
            <p className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
              Click "View" on any applicant to dive deep into their complete profile. 
              Analyze everything from contact details and expertise to CV information and application answers - 
              all in one comprehensive, focused view that lets you make informed decisions.
            </p>
            <div className="flex items-center justify-center gap-8 pt-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Eye className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="font-semibold">Click "View"</h3>
                <p className="text-sm text-muted-foreground">Access detailed profile</p>
              </div>
              <ArrowRight className="w-8 h-8 text-blue-400" />
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Search className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="font-semibold">Analyze Everything</h3>
                <p className="text-sm text-muted-foreground">Complete applicant overview</p>
              </div>
              <ArrowRight className="w-8 h-8 text-blue-400" />
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <CheckCircle className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="font-semibold">Make Decisions</h3>
                <p className="text-sm text-muted-foreground">Informed hiring choices</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Key Features */}
        <section className="space-y-8">
          <div className="text-center">
            <h2 className="text-4xl font-bold text-foreground mb-4">Key Features</h2>
            <p className="text-lg text-muted-foreground">
              Powerful tools to make your hiring process more efficient and effective
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <Filter className="w-6 h-6 text-primary" />
                <h3 className="text-xl font-semibold">Advanced Filtering & Search</h3>
              </div>
              <ul className="space-y-2 text-muted-foreground">
                <li>• Filter by expertise, nationality, and hiring status</li>
                <li>• Search across names, emails, and phone numbers</li>
                <li>• Quick access to favorites and comparison tools</li>
                <li>• Form-based organization for different job positions</li>
              </ul>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <Users className="w-6 h-6 text-primary" />
                <h3 className="text-xl font-semibold">Detailed Applicant Profiles</h3>
              </div>
              <ul className="space-y-2 text-muted-foreground">
                <li>• Complete contact information and CV access</li>
                <li>• Expertise and nationality badges for quick identification</li>
                <li>• Submission date and status tracking</li>
                <li>• View applicant answers and responses</li>
              </ul>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <Clock className="w-6 h-6 text-primary" />
                <h3 className="text-xl font-semibold">6-Step Hiring Process</h3>
              </div>
              <ul className="space-y-2 text-muted-foreground">
                <li>• Submit Form → Screening → Interview</li>
                <li>• Fee Model → Writing Assignment → Contract</li>
                <li>• Visual progress tracking with completion status</li>
                <li>• Automated email notifications and reminders</li>
              </ul>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <MessageSquare className="w-6 h-6 text-primary" />
                <h3 className="text-xl font-semibold">Collaboration Tools</h3>
              </div>
              <ul className="space-y-2 text-muted-foreground">
                <li>• Internal notes system for team communication</li>
                <li>• Side-by-side applicant comparison</li>
                <li>• Action center for quick status updates</li>
                <li>• Interview notes and feedback tracking</li>
              </ul>
            </Card>
          </div>
        </section>

        {/* How to Use - Step by Step */}
        <section className="space-y-8">
          <div className="text-center">
            <h2 className="text-4xl font-bold text-foreground mb-4">How to Use the Platform</h2>
            <p className="text-lg text-muted-foreground">
              Follow these steps to effectively manage your hiring process
            </p>
          </div>

          <div className="space-y-6">
            <Card className="p-6 border-l-4 border-l-blue-500">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-sm">
                  1
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Access Applications Overview</h3>
                  <p className="text-muted-foreground mb-3">
                    Start by navigating to the main dashboard where you can see all applications.
                  </p>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• Select a job form from the dropdown to filter applications</li>
                    <li>• Use the search bar to find specific applicants</li>
                    <li>• Apply filters by expertise, nationality, or status</li>
                  </ul>
                </div>
              </div>
            </Card>

            <Card className="p-6 border-l-4 border-l-green-500">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-green-600 font-bold text-sm">
                  2
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Review Individual Applicants</h3>
              <p className="text-muted-foreground mb-3">
                Click "View" to access detailed information about each applicant - our best feature for in-depth analysis.
              </p>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• Review contact information and professional details</li>
                    <li>• Check expertise level and nationality</li>
                    <li>• View applicant answers to form questions</li>
                    <li>• Access CV and supporting documents</li>
                  </ul>
                </div>
              </div>
            </Card>

            <Card className="p-6 border-l-4 border-l-orange-500">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 font-bold text-sm">
                  3
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Manage Hiring Steps</h3>
                  <p className="text-muted-foreground mb-3">
                    Guide applicants through each stage of your hiring process.
                  </p>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• Track progress through the 6-step workflow</li>
                    <li>• Update status at each stage (screening, interview, etc.)</li>
                    <li>• Set up writing assignments and contract negotiations</li>
                    <li>• Monitor completion rates and next steps</li>
                  </ul>
                </div>
              </div>
            </Card>

            <Card className="p-6 border-l-4 border-l-purple-500">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 font-bold text-sm">
                  4
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Collaborate with Your Team</h3>
                  <p className="text-muted-foreground mb-3">
                    Use built-in tools to share insights and make collaborative decisions.
                  </p>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• Add internal notes for team communication</li>
                    <li>• Compare multiple applicants side-by-side</li>
                    <li>• Track interview feedback and evaluations</li>
                    <li>• Mark favorite applicants for quick access</li>
                  </ul>
                </div>
              </div>
            </Card>
          </div>
        </section>

        {/* The 6-Step Hiring Process */}
        <section className="space-y-8">
          <div className="text-center">
            <h2 className="text-4xl font-bold text-foreground mb-4">The 6-Step Hiring Process</h2>
            <p className="text-lg text-muted-foreground">
              A structured approach to ensure consistent and thorough applicant evaluation
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="p-6">
              <div className="text-center mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <FileText className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold">1. Submit Form</h3>
              </div>
              <p className="text-sm text-muted-foreground text-center">
                Initial application submission with all required personal and professional information.
              </p>
            </Card>

            <Card className="p-6">
              <div className="text-center mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Search className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold">2. Screening</h3>
              </div>
              <p className="text-sm text-muted-foreground text-center">
                Initial review and screening test to evaluate basic qualifications and fit.
              </p>
            </Card>

            <Card className="p-6">
              <div className="text-center mb-4">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Users className="w-6 h-6 text-orange-600" />
                </div>
                <h3 className="text-lg font-semibold">3. Interview</h3>
              </div>
              <p className="text-sm text-muted-foreground text-center">
                Structured interview process to assess skills, culture fit, and potential.
              </p>
            </Card>

            <Card className="p-6">
              <div className="text-center mb-4">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Settings className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold">4. Fee Model</h3>
              </div>
              <p className="text-sm text-muted-foreground text-center">
                Salary negotiation and compensation package discussion and agreement.
              </p>
            </Card>

            <Card className="p-6">
              <div className="text-center mb-4">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <FileText className="w-6 h-6 text-red-600" />
                </div>
                <h3 className="text-lg font-semibold">5. Writing Assignment</h3>
              </div>
              <p className="text-sm text-muted-foreground text-center">
                Practical assessment with time-limited assignment to evaluate actual skills.
              </p>
            </Card>

            <Card className="p-6">
              <div className="text-center mb-4">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <CheckCircle className="w-6 h-6 text-gray-600" />
                </div>
                <h3 className="text-lg font-semibold">6. Contract</h3>
              </div>
              <p className="text-sm text-muted-foreground text-center">
                Final contract preparation, review, and signing to complete the hiring process.
              </p>
            </Card>
          </div>
        </section>

        {/* Frequently Asked Questions */}
        <section className="space-y-8">
          <div className="text-center">
            <h2 className="text-4xl font-bold text-foreground mb-4">Frequently Asked Questions</h2>
            <p className="text-lg text-muted-foreground">
              Common questions and answers about using the HR Platform
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-3">How do I compare multiple applicants?</h3>
              <p className="text-muted-foreground mb-3">
                Select multiple applicants from the Applications Overview by checking their boxes, 
                then click the "Compare" button to view them side-by-side.
              </p>
              <div className="text-sm text-muted-foreground">
                You can compare up to 4 applicants at once, viewing their qualifications, 
                expertise, and hiring progress in a unified comparison view.
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-3">What happens when an applicant is rejected?</h3>
              <p className="text-muted-foreground mb-3">
                The system automatically sends tailored rejection emails based on the stage 
                where the rejection occurred (screening, interview, etc.).
              </p>
              <div className="text-sm text-muted-foreground">
                You can customize rejection email templates in the documentation section 
                to match your organization's communication style.
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-3">How do I track applicant progress?</h3>
              <p className="text-muted-foreground mb-3">
                Each applicant's profile shows their current position in the 6-step hiring process 
                with visual indicators for completed, current, and pending steps.
              </p>
              <div className="text-sm text-muted-foreground">
                The progress bar shows percentage completion, and you can click on any step 
                to update status or add relevant information.
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-3">Can I add notes about applicants?</h3>
              <p className="text-muted-foreground mb-3">
                Yes, both general notes and interview-specific notes can be added to any applicant. 
                These are visible to your entire HR team for collaboration.
              </p>
              <div className="text-sm text-muted-foreground">
                Notes support editing and deletion, and include timestamp and author information 
                for proper tracking and accountability.
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-3">How do writing assignments work?</h3>
              <p className="text-muted-foreground mb-3">
                Applicants can schedule writing assignments at their preferred time. The system 
                enforces a 5-hour completion window and automatically closes access afterward.
              </p>
              <div className="text-sm text-muted-foreground">
                Time zones are automatically handled, and you'll receive notifications 
                when assignments are completed for review.
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-3">What's the purpose of different forms?</h3>
              <p className="text-muted-foreground mb-3">
                Different forms allow you to manage applications for various job positions 
                or departments separately while using the same hiring process.
              </p>
              <div className="text-sm text-muted-foreground">
                You can switch between forms using the dropdown in the Applications Overview 
                to focus on specific roles or time periods.
              </div>
            </Card>
          </div>
        </section>

        {/* Rejection Email Management */}
        <Card className="p-8 bg-gradient-to-br from-red-50 to-orange-50 border-red-200">
          <div className="flex items-center gap-3 mb-6">
            <XCircle className="w-8 h-8 text-red-500" />
            <h2 className="text-3xl font-bold text-foreground">Rejection Email Management</h2>
          </div>
          <p className="text-lg text-muted-foreground mb-6">
            Customize automated rejection emails sent to applicants at different stages of the hiring process. 
            These templates ensure professional and consistent communication.
          </p>

          <div className="space-y-6">
            {emails.map((email, index) => (
              <div
                key={index}
                className="bg-white border rounded-lg shadow-sm p-6 relative"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold text-foreground">
                    {email.title}
                  </h3>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(index)}
                    className="gap-2"
                  >
                    <Settings className="w-4 h-4" />
                    Edit Template
                  </Button>
                </div>

                {editingIndex === index ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-muted-foreground mb-2">
                        Email Subject:
                      </label>
                      <div className="p-3 bg-muted rounded-md text-sm font-medium">
                        {email.subject}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-muted-foreground mb-2">
                        Email Body:
                      </label>
                      <textarea
                        className="w-full border rounded-md p-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                        rows={8}
                        value={tempBody}
                        onChange={(e) => setTempBody(e.target.value)}
                      />
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button
                        size="sm"
                        variant="default"
                        onClick={() => handleSaveToBackend(index)}
                      >
                        Save Changes
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={handleCancel}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="bg-muted/50 p-4 rounded-lg">
                      <p className="text-sm font-medium text-muted-foreground mb-2">
                        <strong>Subject:</strong> {email.subject}
                      </p>
                      <div className="text-sm text-foreground whitespace-pre-wrap border-l-4 border-primary/30 pl-4">
                        {email.body}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {emails.length === 0 && (
            <div className="text-center py-12">
              <Mail className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-muted-foreground mb-2">
                Loading Email Templates...
              </h3>
              <p className="text-muted-foreground">
                Email templates will appear here once loaded from the system.
              </p>
            </div>
          )}
        </Card>

        {/* Getting Started */}
        <Card className="p-8 bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/20">
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-bold text-foreground">Ready to Get Started?</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Begin managing your hiring process more effectively with our comprehensive platform. 
              Access all applications, track progress, and make better hiring decisions.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button size="lg" className="gap-2">
                <Users className="w-5 h-5" />
                View Applications
              </Button>
              <Button size="lg" variant="outline" className="gap-2">
                <BookOpen className="w-5 h-5" />
                Create Test Applicant
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Docs;