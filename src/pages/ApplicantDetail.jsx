import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/StatusBadge";
import { HiringStatusBadge } from "@/components/HiringStatusBadge";
import { NationalityBadge } from "@/components/NationalityBadge";
import { ExpertiseBadge } from "@/components/ExpertiseBadge";
import NotesSystem from "@/components/NotesSystem";
import HiringSteps from "../components/HiringSteps";
import {
  FileText,
  MessageSquare,
  ArrowLeft,
  Calendar,
  Mail,
  Phone,
  User,
  Briefcase,
  Flag,
} from "lucide-react";

const ApplicantDetail = () => {
  const { applicantId } = useParams();
  const navigate = useNavigate();
  const [applicant, setApplicant] = useState(null);
  const [hiringSteps, setHiringSteps] = useState([]);
  const [notes, setNotes] = useState([]);
  const [interviewNotes, setInterviewNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showNotePopup, setShowNotePopup] = useState(false);
  const [expandedHiringSteps, setExpandedHiringSteps] = useState(false);

  useEffect(() => {
    const fetchApplicantDetails = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:5000/applicant/${applicantId}/details`);
        const data = await response.json();
        
        setApplicant(data.applicant);
        setHiringSteps(data.hiring_steps);
        setNotes(data.notes);
        setInterviewNotes(data.interview_notes);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching applicant details:", error);
        setLoading(false);
      }
    };

    if (applicantId) {
      fetchApplicantDetails();
    }
  }, [applicantId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-lg">Loading applicant details...</div>
          </div>
        </div>
      </div>
    );
  }

  if (!applicant) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-lg">Applicant not found</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {showNotePopup && (
        <NotesSystem
          applicantId={applicantId}
          onClose={() => setShowNotePopup(false)}
        />
      )}

      <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <div className="bg-gradient-to-br from-card via-card to-accent/5 rounded-2xl p-8 border border-card-border/50 shadow-lg">
          <div className="flex items-center gap-4 mb-6">
            <Button
              variant="outline"
              onClick={() => navigate(-1)}
              className="gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
            <h1 className="text-3xl font-bold text-foreground">
              Applicant Details
            </h1>
          </div>

          {/* Applicant Info Card */}
          <div className="bg-background/50 rounded-xl p-6 space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 flex items-center justify-center text-primary font-bold text-xl shadow-sm">
                  {applicant.fullName
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-foreground">
                    {applicant.fullName}
                  </h2>
                  <p className="text-muted-foreground">
                    Applied to: {applicant.form_name.replace(/_/g, " ")}
                  </p>
                </div>
              </div>
              <StatusBadge status={applicant.status} />
            </div>

            {/* Contact and Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                <Mail className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{applicant.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                <Phone className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Phone</p>
                  <p className="font-medium">{applicant.phone}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                <Calendar className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Submitted</p>
                  <p className="font-medium">{applicant.submissionDate.split(" ")[0]}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                <Briefcase className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Expertise</p>
                  <ExpertiseBadge expertise={applicant.expertise} />
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                <Flag className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Nationality</p>
                  <NationalityBadge nationality={applicant.nationality} />
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                <FileText className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">CV</p>
                  <Button variant="ghost" size="sm" className="h-6 p-1 text-xs">
                    View CV
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Hiring Process */}
        <div className="bg-gradient-to-br from-card via-card to-accent/5 rounded-2xl p-8 border border-card-border/50 shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-foreground">Hiring Process</h2>
            <Button
              variant="outline"
              onClick={() => setExpandedHiringSteps(!expandedHiringSteps)}
              className="gap-2"
            >
              {expandedHiringSteps ? "Collapse" : "Expand"} Steps
            </Button>
          </div>

          {/* Hiring Steps Overview */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-6">
            {hiringSteps.map((step) => (
              <div
                key={step.step_id}
                className={`p-3 rounded-lg border-2 text-center ${
                  step.completed
                    ? "bg-green-50 border-green-200 text-green-800"
                    : step.skipped
                    ? "bg-yellow-50 border-yellow-200 text-yellow-800"
                    : "bg-gray-50 border-gray-200 text-gray-600"
                }`}
              >
                <div className="text-xs font-medium">{step.step_name}</div>
                <div className="text-xs mt-1">
                  {step.completed ? "✓ Complete" : step.skipped ? "⊘ Skipped" : "○ Pending"}
                </div>
              </div>
            ))}
          </div>

          {/* Detailed Hiring Steps */}
          {expandedHiringSteps && (
            <div className="bg-background/50 rounded-xl p-6">
              <HiringSteps applicantId={applicantId} />
            </div>
          )}
        </div>

        {/* Notes Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* General Notes */}
          <div className="bg-gradient-to-br from-card via-card to-accent/5 rounded-2xl p-8 border border-card-border/50 shadow-lg">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-foreground">General Notes</h2>
              <Button
                variant="outline"
                onClick={() => setShowNotePopup(true)}
                className="gap-2"
              >
                <MessageSquare className="w-4 h-4" />
                Add Note
              </Button>
            </div>
            <div className="space-y-3">
              {notes.length > 0 ? (
                notes.map((note) => (
                  <div
                    key={note.id}
                    className="p-3 bg-background/50 rounded-lg border border-card-border/30"
                  >
                    <p className="text-sm">{note.content}</p>
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground text-sm">No notes yet</p>
              )}
            </div>
          </div>

          {/* Interview Notes */}
          <div className="bg-gradient-to-br from-card via-card to-accent/5 rounded-2xl p-8 border border-card-border/50 shadow-lg">
            <h2 className="text-xl font-bold text-foreground mb-6">Interview Notes</h2>
            <div className="space-y-3">
              {interviewNotes.length > 0 ? (
                interviewNotes.map((note, index) => (
                  <div
                    key={index}
                    className="p-3 bg-background/50 rounded-lg border border-card-border/30"
                  >
                    <p className="text-sm">{note.content}</p>
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground text-sm">No interview notes yet</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicantDetail;