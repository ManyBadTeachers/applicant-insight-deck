import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Calendar, User, Mail } from "lucide-react";
import { useEffect, useState } from "react";

function SubmitFormDropdown({ applicantId, onStepUpdate }) {
  const [dropDownData, setDropDownData] = useState(null);

  useEffect(() => {
    const getData = async () => {
      try {
        const res = await fetch(
          `http://127.0.0.1:5000/hiring_steps/submit-form/${applicantId}`
        );
        const data = await res.json();

        // Normalize the keys to camelCase for frontend use
        const temp_dict = {
          completed: data.completed,
          email: data.email,
          formName: data.formName,
          fullName: data.fullname, // backend: fullname
          submissionDate: data.submissionsdate, // backend: submissionsdate
        };

        setDropDownData(temp_dict);
      } catch (error) {
        console.error("Error fetching hiring steps (submit form):", error);
      }
    };

    getData();
  }, [applicantId]);

  if (!dropDownData) {
    return (
      <div className="p-4 text-muted-foreground">
        Loading submission details...
      </div>
    );
  }

  return (
    <div className="space-y-4 p-4 bg-card rounded-lg border border-border">
      <div className="flex items-center gap-2 mb-3">
        <FileText className="w-5 h-5 text-primary" />
        <h3 className="font-semibold text-card-foreground">
          Form Submission Details
        </h3>
        <Badge
          variant="secondary"
          className={`${
            dropDownData.completed
              ? "bg-green-50 text-green-700 border-green-200"
              : "bg-yellow-50 text-yellow-700 border-yellow-200"
          }`}
        >
          {dropDownData.completed ? "Completed" : "Pending"}
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="w-4 h-4 text-muted-foreground" />
            <span className="text-muted-foreground">Submitted:</span>
            <span className="font-medium text-card-foreground">
              {dropDownData.submissionDate}
            </span>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <User className="w-4 h-4 text-muted-foreground" />
            <span className="text-muted-foreground">Applicant:</span>
            <span className="font-medium text-card-foreground">
              {dropDownData.fullName}
            </span>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <Mail className="w-4 h-4 text-muted-foreground" />
            <span className="text-muted-foreground">Email:</span>
            <span className="font-medium text-card-foreground">
              {dropDownData.email}
            </span>
          </div>
        </div>

        <div className="space-y-3">
          <div className="text-sm">
            <span className="text-muted-foreground">Form Name:</span>
            <span className="font-medium text-card-foreground ml-2">
              {dropDownData.formName}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SubmitFormDropdown;

{
  /* github */
}
