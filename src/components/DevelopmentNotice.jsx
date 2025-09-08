import { useState, useEffect } from 'react';
import { X, Minimize2, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

const DevelopmentNotice = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [suggestion, setSuggestion] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  // Check cookie on mount
  useEffect(() => {
    const getCookie = (name) => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop().split(';').shift();
      return null;
    };

    const isMinimized = getCookie('dev-notice-minimized');
    if (isMinimized === 'true') {
      setIsVisible(false);
    }
  }, []);

  const handleMinimize = () => {
    setIsVisible(false);
    // Set cookie to expire in 30 days
    const expiryDate = new Date();
    expiryDate.setTime(expiryDate.getTime() + (30 * 24 * 60 * 60 * 1000));
    document.cookie = `dev-notice-minimized=true; expires=${expiryDate.toUTCString()}; path=/`;
  };

  const handleSubmitSuggestion = async (e) => {
    e.preventDefault();
    if (!suggestion.trim()) {
      toast({
        title: "Error",
        description: "Please enter a suggestion before submitting.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch('http://127.0.0.1:5000/add_improvement_suggestions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: suggestion.trim()
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: "Success",
          description: "Thank you for your suggestion! We appreciate the feedback.",
        });
        setSuggestion('');
      } else {
        throw new Error(data.error || 'Failed to submit suggestion');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit suggestion. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed top-4 right-4 z-50 w-80 bg-gradient-to-br from-card via-card to-accent/10 border border-border/50 rounded-xl shadow-xl p-4 backdrop-blur-sm">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
          <h3 className="text-sm font-semibold text-foreground">Under Development</h3>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleMinimize}
          className="h-6 w-6 p-0 hover:bg-muted"
        >
          <Minimize2 className="h-3 w-3" />
        </Button>
      </div>

      {/* Content */}
      <p className="text-xs text-muted-foreground mb-4 leading-relaxed">
        This website is still under development. Please submit your questions, suggestions, or improvements below.
      </p>

      {/* Suggestion Form */}
      <form onSubmit={handleSubmitSuggestion} className="space-y-3">
        <Input
          placeholder="Enter your suggestion..."
          value={suggestion}
          onChange={(e) => setSuggestion(e.target.value)}
          className="text-xs h-8"
          disabled={isSubmitting}
        />
        <Button
          type="submit"
          size="sm"
          className="w-full h-8 text-xs"
          disabled={isSubmitting || !suggestion.trim()}
        >
          {isSubmitting ? (
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
              Submitting...
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Send className="h-3 w-3" />
              Submit Suggestion
            </div>
          )}
        </Button>
      </form>
    </div>
  );
};

export default DevelopmentNotice;