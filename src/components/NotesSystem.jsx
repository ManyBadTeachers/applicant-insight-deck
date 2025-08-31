import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, MessageSquare, Edit, Trash2 } from "lucide-react";

const NotesSystem = ({ applicantId, applicantName }) => {
  // Mock notes data - you'll need to connect this to your backend
  const [notes, setNotes] = useState([
    {
      id: 1,
      content: "Great technical skills, very articulate during phone screening.",
      author: "Sarah Johnson",
      timestamp: "2024-01-15 14:30",
      type: "positive"
    },
    {
      id: 2,
      content: "Needs to improve communication skills, but has potential.",
      author: "Mike Chen",
      timestamp: "2024-01-16 09:15",
      type: "neutral"
    }
  ]);

  const [newNote, setNewNote] = useState("");
  const [isAddingNote, setIsAddingNote] = useState(false);

  const addNote = () => {
    if (newNote.trim()) {
      const note = {
        id: Date.now(),
        content: newNote,
        author: "Current User", // You'll get this from your auth system
        timestamp: new Date().toLocaleString(),
        type: "neutral"
      };
      
      // TODO: Send to your backend API
      // await fetch(`/api/applicants/${applicantId}/notes`, {
      //   method: 'POST',
      //   body: JSON.stringify(note)
      // });
      
      setNotes([note, ...notes]);
      setNewNote("");
      setIsAddingNote(false);
    }
  };

  const deleteNote = (noteId) => {
    // TODO: Delete from your backend API
    setNotes(notes.filter(note => note.id !== noteId));
  };

  const noteTypeStyles = {
    positive: "border-l-green-500 bg-green-50",
    negative: "border-l-red-500 bg-red-50",
    neutral: "border-l-blue-500 bg-blue-50"
  };

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-primary" />
          <h3 className="font-semibold text-card-foreground">Internal Notes</h3>
          <Badge variant="secondary">{notes.length}</Badge>
        </div>
        <Button 
          size="sm" 
          onClick={() => setIsAddingNote(!isAddingNote)}
          className="gap-2"
        >
          <PlusCircle className="w-4 h-4" />
          Add Note
        </Button>
      </div>

      {isAddingNote && (
        <div className="mb-4 p-4 border rounded-lg bg-muted/20">
          <Textarea
            placeholder={`Add a note about ${applicantName}...`}
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            rows={3}
            className="mb-3"
          />
          <div className="flex gap-2">
            <Button size="sm" onClick={addNote}>Save Note</Button>
            <Button size="sm" variant="outline" onClick={() => setIsAddingNote(false)}>
              Cancel
            </Button>
          </div>
        </div>
      )}

      <div className="space-y-3 max-h-60 overflow-y-auto">
        {notes.length === 0 ? (
          <p className="text-muted-foreground text-center py-4">No notes yet</p>
        ) : (
          notes.map((note) => (
            <div 
              key={note.id} 
              className={`p-3 border-l-4 rounded-r-lg ${noteTypeStyles[note.type]}`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <p className="text-sm text-card-foreground mb-1">{note.content}</p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span className="font-medium">{note.author}</span>
                    <span>•</span>
                    <span>{note.timestamp}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1 ml-2">
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                    <Edit className="w-3 h-3" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                    onClick={() => deleteNote(note.id)}
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </Card>
  );
};

export default NotesSystem;