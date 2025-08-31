import { useState } from "react";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, Plus, Send } from "lucide-react";

const EmailTemplates = () => {
  // Mock data - you'll need to connect this to your backend API
  const [templates, setTemplates] = useState([
    {
      id: 1,
      name: "Interview Invitation",
      subject: "Interview Invitation - {{position}} at {{company}}",
      body: `Dear {{applicant_name}},

We are pleased to invite you for an interview for the {{position}} position at {{company}}.

Interview Details:
- Date: {{interview_date}}
- Time: {{interview_time}}
- Location: {{interview_location}}

Please confirm your availability by replying to this email.

Best regards,
{{hr_name}}`,
      category: "Interview",
      used: 23
    },
    {
      id: 2,
      name: "Application Received",
      subject: "Application Received - {{position}}",
      body: `Dear {{applicant_name}},

Thank you for your interest in the {{position}} position at {{company}}.

We have received your application and will review it carefully. We will contact you within {{review_time}} regarding the next steps.

Best regards,
{{hr_name}}`,
      category: "Confirmation",
      used: 87
    },
    {
      id: 3,
      name: "Rejection - Not Qualified",
      subject: "Update on your application - {{position}}",
      body: `Dear {{applicant_name}},

Thank you for your interest in the {{position}} position at {{company}}.

After careful consideration, we have decided to move forward with other candidates whose qualifications more closely match our current needs.

We appreciate the time you invested in the application process and wish you success in your job search.

Best regards,
{{hr_name}}`,
      category: "Rejection",
      used: 45
    },
    {
      id: 4,
      name: "Job Offer",
      subject: "Job Offer - {{position}} at {{company}}",
      body: `Dear {{applicant_name}},

Congratulations! We are excited to offer you the position of {{position}} at {{company}}.

Offer Details:
- Start Date: {{start_date}}
- Salary: {{salary}}
- Benefits: {{benefits}}

Please review the attached offer letter and let us know your decision by {{response_deadline}}.

Welcome to the team!

Best regards,
{{hr_name}}`,
      category: "Offer",
      used: 8
    }
  ]);

  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [newTemplate, setNewTemplate] = useState({ name: "", subject: "", body: "", category: "" });

  const categoryColors = {
    Interview: "bg-blue-100 text-blue-800",
    Confirmation: "bg-green-100 text-green-800",
    Rejection: "bg-red-100 text-red-800",
    Offer: "bg-purple-100 text-purple-800",
    Follow: "bg-amber-100 text-amber-800"
  };

  const handleSaveTemplate = () => {
    // TODO: Connect to your API endpoint for saving templates
    console.log("Save template:", newTemplate);
    setIsEditing(false);
    setNewTemplate({ name: "", subject: "", body: "", category: "" });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-extrabold text-foreground">Email Templates</h1>
            <p className="text-muted-foreground">Manage your email templates for different hiring stages</p>
          </div>
          <Button onClick={() => setIsEditing(true)} className="gap-2">
            <Plus className="w-4 h-4" />
            New Template
          </Button>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Template List */}
          <div className="lg:col-span-1 space-y-4">
            {templates.map((template) => (
              <Card 
                key={template.id} 
                className={`p-4 cursor-pointer transition-all hover:shadow-md ${
                  selectedTemplate?.id === template.id ? 'border-primary bg-primary/5' : ''
                }`}
                onClick={() => setSelectedTemplate(template)}
              >
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-card-foreground">{template.name}</h3>
                  <Badge className={categoryColors[template.category] || "bg-muted text-muted-foreground"}>
                    {template.category}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-2 line-clamp-2">{template.subject}</p>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Used {template.used} times</span>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                      <Edit className="w-3 h-3" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-red-500 hover:text-red-700">
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Template Editor/Viewer */}
          <div className="lg:col-span-2">
            <Card className="p-6">
              {isEditing ? (
                <div className="space-y-4">
                  <h2 className="text-xl font-bold">Create New Template</h2>
                  <div className="grid grid-cols-2 gap-4">
                    <Input 
                      placeholder="Template name"
                      value={newTemplate.name}
                      onChange={(e) => setNewTemplate({...newTemplate, name: e.target.value})}
                    />
                    <Input 
                      placeholder="Category"
                      value={newTemplate.category}
                      onChange={(e) => setNewTemplate({...newTemplate, category: e.target.value})}
                    />
                  </div>
                  <Input 
                    placeholder="Email subject"
                    value={newTemplate.subject}
                    onChange={(e) => setNewTemplate({...newTemplate, subject: e.target.value})}
                  />
                  <Textarea 
                    placeholder="Email body"
                    rows={15}
                    value={newTemplate.body}
                    onChange={(e) => setNewTemplate({...newTemplate, body: e.target.value})}
                  />
                  <div className="flex gap-2">
                    <Button onClick={handleSaveTemplate}>Save Template</Button>
                    <Button variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
                  </div>
                </div>
              ) : selectedTemplate ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-bold">{selectedTemplate.name}</h2>
                      <Badge className={categoryColors[selectedTemplate.category]}>
                        {selectedTemplate.category}
                      </Badge>
                    </div>
                    <Button variant="outline" className="gap-2">
                      <Send className="w-4 h-4" />
                      Use Template
                    </Button>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Subject:</label>
                      <div className="mt-1 p-3 bg-muted/30 rounded border">{selectedTemplate.subject}</div>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Body:</label>
                      <div className="mt-1 p-4 bg-muted/30 rounded border whitespace-pre-wrap font-mono text-sm">
                        {selectedTemplate.body}
                      </div>
                    </div>
                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400">
                    <h4 className="font-medium text-blue-800 mb-2">Available Variables:</h4>
                    <div className="grid grid-cols-2 gap-2 text-sm text-blue-700">
                      <code>{"{{applicant_name}}"}</code>
                      <code>{"{{position}}"}</code>
                      <code>{"{{company}}"}</code>
                      <code>{"{{hr_name}}"}</code>
                      <code>{"{{interview_date}}"}</code>
                      <code>{"{{interview_time}}"}</code>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <Send className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Select a template to view and edit</p>
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailTemplates;