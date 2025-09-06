"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, MessageSquare, Edit, Trash2, X } from "lucide-react";

const NotesSystem = ({ applicantId, onClose }) => {
  const [applicant, setApplicant] = useState(null);
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState("");
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [editingNoteId, setEditingNoteId] = useState(null);
  const [editingContent, setEditingContent] = useState("");

  const API_BASE = "http://127.0.0.1:5000";

  // Fetch applicant notes api
  const fetchNotes = async () => {
    if (!applicantId) return;
    try {
      const res = await fetch(`${API_BASE}/applicant/${applicantId}/notes`);
      const data = await res.json();
      if (!data.error) {
        setApplicant({ name: data.name });
        setNotes(data.notes || []);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, [applicantId]);

  // Add new note
  const addNote = async () => {
    if (!newNote.trim()) return;
    try {
      const res = await fetch(`${API_BASE}/note/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ applicant_id: applicantId, content: newNote }),
      });
      const data = await res.json();
      if (!data.error) {
        setNotes([data, ...notes]);
        setNewNote("");
        setIsAddingNote(false);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Delete note
  const deleteNote = async (id) => {
    if (!window.confirm("Are you sure you want to delete this note?")) return;
    try {
      const res = await fetch(`${API_BASE}/note/delete/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!data.error) {
        setNotes(notes.filter((n) => n.id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Start editing
  const startEditing = (note) => {
    setEditingNoteId(note.id);
    setEditingContent(note.content);
  };

  // Save edited note
  const saveEdit = async (id) => {
    if (!editingContent.trim()) return;
    try {
      const res = await fetch(`${API_BASE}/note/edit/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: editingContent }),
      });
      const data = await res.json();
      if (!data.error) {
        setNotes(notes.map((n) => (n.id === id ? data : n)));
        setEditingNoteId(null);
        setEditingContent("");
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="fixed inset-0 z-[999] bg-black/50 flex items-center justify-center">
      <Card className="w-11/12 max-w-lg p-6 relative">
        <Button
          variant="ghost"
          size="sm"
          className="absolute top-3 right-3"
          onClick={onClose}
        >
          <X />
        </Button>

        {applicant && (
          <div className="mb-4">
            <h2 className="text-lg font-bold">{applicant.name}'s Notes</h2>
          </div>
        )}

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-primary" />
            <h3 className="font-semibold text-card-foreground">
              Internal Notes
            </h3>
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
              placeholder={`Add a note about ${applicant?.name || ""}...`}
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              rows={3}
              className="mb-3"
            />
            <div className="flex gap-2">
              <Button size="sm" onClick={addNote}>
                Save Note
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setIsAddingNote(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}

        <div className="space-y-3 max-h-60 overflow-y-auto">
          {notes.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">
              No notes yet
            </p>
          ) : (
            notes.map((note) => (
              <div
                key={note.id}
                className="p-3 border-l-4 border-blue-500 rounded-r-lg bg-blue-50"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    {editingNoteId === note.id ? (
                      <Textarea
                        value={editingContent}
                        onChange={(e) => setEditingContent(e.target.value)}
                        rows={2}
                        className="mb-1"
                      />
                    ) : (
                      <p className="text-sm text-card-foreground mb-1">
                        {note.content}
                      </p>
                    )}
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span className="font-medium">{note.author}</span>
                      {note.timestamp && (
                        <span>{new Date(note.timestamp).toLocaleString()}</span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-1 ml-2">
                    {editingNoteId === note.id ? (
                      <>
                        <Button size="sm" onClick={() => saveEdit(note.id)}>
                          Save
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setEditingNoteId(null)}
                        >
                          Cancel
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0"
                          onClick={() => startEditing(note)}
                        >
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
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </Card>
    </div>
  );
};

export default NotesSystem;
