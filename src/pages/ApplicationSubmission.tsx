import Navigation from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, FileText, Users, Clock } from "lucide-react";

const ApplicationSubmission = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Application Submission</h1>
          <p className="text-lg text-muted-foreground">
            Submit your application through our integrated form system
          </p>
        </div>

        {/* Main Form Card */}
        <Card className="p-8 bg-gradient-subtle border-card-border shadow-elevated">
          <div className="text-center space-y-6">
            <div className="mx-auto w-16 h-16 bg-primary rounded-full flex items-center justify-center">
              <FileText className="w-8 h-8 text-primary-foreground" />
            </div>
            
            <div>
              <h2 className="text-2xl font-semibold text-card-foreground mb-2">
                Complete Your Application
              </h2>
              <p className="text-muted-foreground max-w-md mx-auto">
                Please fill out all required fields in our comprehensive application form. 
                The process typically takes 10-15 minutes to complete.
              </p>
            </div>

            {/* Form Link */}
            <div className="bg-primary-muted rounded-lg p-6 max-w-md mx-auto">
              <p className="text-sm text-muted-foreground mb-4">
                Form Link (JotForm Integration)
              </p>
              <code className="text-xs bg-background p-2 rounded border text-primary block break-all">
                https://form.jotform.com/223044107067346
              </code>
            </div>

            <Button size="lg" className="bg-primary hover:bg-primary-dark text-primary-foreground">
              <ExternalLink className="w-4 h-4 mr-2" />
              Open Application Form
            </Button>
          </div>
        </Card>

        {/* Info Cards */}
        <div className="grid md:grid-cols-3 gap-6 mt-8">
          <Card className="p-6 border-card-border">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-primary-light rounded-lg flex items-center justify-center mr-3">
                <Clock className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-semibold text-card-foreground">Quick Process</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Our streamlined application process ensures quick submission and faster review times.
            </p>
          </Card>

          <Card className="p-6 border-card-border">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-primary-light rounded-lg flex items-center justify-center mr-3">
                <Users className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-semibold text-card-foreground">Expert Review</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Your application will be reviewed by industry experts and hiring managers.
            </p>
          </Card>

          <Card className="p-6 border-card-border">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-primary-light rounded-lg flex items-center justify-center mr-3">
                <FileText className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-semibold text-card-foreground">Track Progress</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Monitor your application status and receive updates throughout the process.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ApplicationSubmission;