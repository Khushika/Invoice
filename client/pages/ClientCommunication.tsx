import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Send, Trash2, MessageSquare } from "lucide-react";

interface Note {
  id: string;
  content: string;
  type: "note" | "email" | "call" | "meeting";
  createdAt: string;
  author: string;
}

interface Communication {
  id: string;
  subject: string;
  type: "email" | "call" | "message" | "note";
  status: "sent" | "received" | "pending";
  date: string;
  preview: string;
}

export default function ClientCommunication() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [notes, setNotes] = useState<Note[]>([]);
  const [communications, setCommunications] = useState<Communication[]>([]);
  const [newNote, setNewNote] = useState("");
  const [noteType, setNoteType] = useState<"note" | "email" | "call" | "meeting">("note");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (id) {
      loadClientData();
    }
  }, [id]);

  const loadClientData = async () => {
    try {
      const response = await fetch(`/api/clients/${id}`);
      if (!response.ok) throw new Error("Failed to load client");
      const data = await response.json();
      const client = data.client;
      setClientName(client.name);
      setClientEmail(client.email);

      // Load communications
      const commResponse = await fetch(`/api/clients/${id}/communications`);
      if (commResponse.ok) {
        const commData = await commResponse.json();
        setCommunications(commData.communications || []);
      }

      // Load notes
      const notesResponse = await fetch(`/api/clients/${id}/notes`);
      if (notesResponse.ok) {
        const notesData = notesResponse.json();
        setNotes((await notesData).notes || []);
      }
    } catch (error) {
      console.error("Error loading client data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newNote.trim()) {
      alert("Note cannot be empty");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/clients/${id}/notes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: newNote,
          type: noteType,
        }),
      });

      if (!response.ok) throw new Error("Failed to add note");
      const data = await response.json();
      setNotes([data.note, ...notes]);
      setNewNote("");
      setNoteType("note");
    } catch (error) {
      console.error("Error adding note:", error);
      alert("Failed to add note");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteNote = async (noteId: string) => {
    if (!window.confirm("Delete this note?")) return;

    try {
      await fetch(`/api/clients/${id}/notes/${noteId}`, { method: "DELETE" });
      setNotes(notes.filter((n) => n.id !== noteId));
    } catch (error) {
      console.error("Error deleting note:", error);
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "call":
        return "bg-blue-100 text-blue-700";
      case "email":
        return "bg-purple-100 text-purple-700";
      case "meeting":
        return "bg-green-100 text-green-700";
      case "note":
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="py-12">
          <p className="text-center text-muted-foreground">Loading...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <button
        onClick={() => navigate(`/clients/${id}`)}
        className="flex items-center gap-2 text-accent hover:text-accent/80"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Client
      </button>

      <div>
        <h1 className="text-3xl font-bold text-foreground">{clientName}</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Communication hub • {clientEmail}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Notes Section */}
        <div className="lg:col-span-2 space-y-6">
          {/* Add Note Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                Add a Note
              </CardTitle>
              <CardDescription>
                Keep track of conversations and important details
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddNote} className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-foreground block mb-2">
                    Note Type
                  </label>
                  <select
                    value={noteType}
                    onChange={(e) =>
                      setNoteType(e.target.value as any)
                    }
                    className="w-full px-3 py-2 bg-card text-foreground border border-border rounded-md"
                  >
                    <option value="note">General Note</option>
                    <option value="call">Phone Call</option>
                    <option value="email">Email</option>
                    <option value="meeting">Meeting</option>
                  </select>
                </div>
                <Textarea
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  placeholder="Write your note here..."
                  rows={4}
                />
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-accent hover:bg-accent/90 text-background gap-2 w-full"
                >
                  <Send className="w-4 h-4" />
                  Add Note
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Notes Timeline */}
          <div className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">Notes</h2>
            {notes.length === 0 ? (
              <Card>
                <CardContent className="py-8">
                  <p className="text-center text-muted-foreground">
                    No notes yet. Add one to get started.
                  </p>
                </CardContent>
              </Card>
            ) : (
              notes.map((note) => (
                <Card key={note.id}>
                  <CardContent className="py-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span
                            className={`text-xs px-2 py-1 rounded-full font-medium capitalize ${getTypeColor(
                              note.type
                            )}`}
                          >
                            {note.type}
                          </span>
                        </div>
                        <p className="text-foreground whitespace-pre-wrap">
                          {note.content}
                        </p>
                        <p className="text-xs text-muted-foreground mt-2">
                          {new Date(note.createdAt).toLocaleString()}
                        </p>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDeleteNote(note.id)}
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>

        {/* Communications Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Recent Communications</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {communications.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No communications yet
                </p>
              ) : (
                communications.slice(0, 5).map((comm) => (
                  <div
                    key={comm.id}
                    className="pb-3 border-b border-border/40 last:border-0"
                  >
                    <p className="text-sm font-medium text-foreground">
                      {comm.subject}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs px-2 py-1 bg-muted rounded capitalize">
                        {comm.type}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(comm.date).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                      {comm.preview}
                    </p>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Client Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-xs font-medium text-muted-foreground">
                  Email
                </p>
                <p className="text-sm text-foreground">{clientEmail}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground">
                  Total Notes
                </p>
                <p className="text-sm text-foreground">{notes.length}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground">
                  Communications
                </p>
                <p className="text-sm text-foreground">{communications.length}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
