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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
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
  Loader2,
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
  const [showAnswersPopup, setShowAnswersPopup] = useState(false);
  const [answersLoading, setAnswersLoading] = useState(false);
  const [answersData, setAnswersData] = useState(null);
  

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

  const handleAnswers = async () => {
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

      {/* Answers Popup */}
      <Dialog open={showAnswersPopup} onOpenChange={setShowAnswersPopup}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Applicant Answers</DialogTitle>
            <DialogDescription>
              Answers from {applicant?.fullName}
            </DialogDescription>
          </DialogHeader>
          
          <div className="mt-4">
            {answersLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin mr-2" />
                <span>Loading answers...</span>
              </div>
            ) : answersData ? (
              answersData.error ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p>Couldn't get answers from {applicant?.fullName}</p>
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
                      <p>Couldn't get answers from {applicant?.fullName}</p>
                    </div>
                  )}
                </div>
              )
            ) : null}
          </div>
        </DialogContent>
      </Dialog>

      <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <div className="bg-gradient-to-br from-card via-card to-accent/5 rounded-2xl p-8 border border-card-border/50 shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
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
            <Button
              variant="outline"
              onClick={handleAnswers}
              disabled={answersLoading}
              className="gap-2"
            >
              {answersLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <FileText className="w-4 h-4" />
              )}
              {answersLoading ? "Loading..." : "View Answers"}
            </Button>
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
          <h2 className="text-2xl font-bold text-foreground mb-6">Hiring Process</h2>
          <HiringSteps applicantId={applicantId} />
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