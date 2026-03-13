import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import Navbar from "../components/Navbar";
import { fetchNote, updateNote, deleteNote } from "../api/notes";
import { ArrowLeftIcon, Trash2Icon } from "lucide-react";
import toast from "react-hot-toast";

const NoteDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchNote(id);
        if (!cancelled) {
          setNote(data);
          setTitle(data.title || "");
          setContent(data.content || "");
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message || "Failed to load note.");
          if (err.message?.toLowerCase().includes("not found")) {
            toast.error("Note not found.");
          } else {
            toast.error(err.message);
          }
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    if (id) load();
    return () => { cancelled = true; };
  }, [id]);

  async function handleSave() {
    const t = title.trim();
    const c = content.trim();
    if (!t || !c) {
      toast.error("Title and content are required.");
      return;
    }
    setSaving(true);
    try {
      const updated = await updateNote(id, { title: t, content: c });
      setNote(updated);
      setTitle(updated.title);
      setContent(updated.content);
      setEditing(false);
      toast.success("Note saved.");
    } catch (err) {
      toast.error(err.message || "Failed to save.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!window.confirm("Delete this note? This cannot be undone.")) return;
    setDeleting(true);
    try {
      await deleteNote(id);
      toast.success("Note deleted.");
      navigate("/");
    } catch (err) {
      toast.error(err.message || "Failed to delete.");
    } finally {
      setDeleting(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-base-100">
        <Navbar />
        <main className="max-w-2xl mx-auto px-4 py-10 flex justify-center">
          <span className="loading loading-spinner loading-lg text-primary" />
        </main>
      </div>
    );
  }

  if (error && !note) {
    return (
      <div className="min-h-screen bg-base-100">
        <Navbar />
        <main className="max-w-2xl mx-auto px-4 py-10">
          <p className="text-error">{error}</p>
          <button className="btn btn-ghost mt-4" onClick={() => navigate("/")}>
            Back to home
          </button>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-100">
      <Navbar />
      <main className="max-w-2xl mx-auto px-4 py-10">
        <div className="flex items-center justify-between gap-4 mb-6">
          <button
            type="button"
            className="btn btn-ghost btn-sm gap-1"
            onClick={() => navigate("/")}
          >
            <ArrowLeftIcon className="size-4" />
            Back
          </button>
          <div className="flex gap-2">
            {editing ? (
              <>
                <button
                  className="btn btn-primary btn-sm"
                  onClick={handleSave}
                  disabled={saving}
                >
                  {saving ? "Saving…" : "Save"}
                </button>
                <button
                  className="btn btn-ghost btn-sm"
                  onClick={() => {
                    setEditing(false);
                    setTitle(note?.title ?? "");
                    setContent(note?.content ?? "");
                  }}
                  disabled={saving}
                >
                  Cancel
                </button>
              </>
            ) : (
              <button
                className="btn btn-ghost btn-sm"
                onClick={() => setEditing(true)}
              >
                Edit
              </button>
            )}
            <button
              type="button"
              className="btn btn-ghost btn-sm text-error"
              onClick={handleDelete}
              disabled={deleting}
            >
              <Trash2Icon className="size-4" />
              {deleting ? "…" : "Delete"}
            </button>
          </div>
        </div>

        {editing ? (
          <div className="space-y-4">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="input input-bordered w-full text-lg font-semibold"
              placeholder="Title"
              disabled={saving}
            />
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="textarea textarea-bordered w-full min-h-[300px]"
              placeholder="Content"
              disabled={saving}
            />
          </div>
        ) : (
          <article>
            <h1 className="text-2xl font-semibold mb-4">{note?.title || "Untitled"}</h1>
            <div className="prose prose-sm max-w-none text-base-content/90 whitespace-pre-wrap">
              {note?.content || ""}
            </div>
          </article>
        )}
      </main>
    </div>
  );
};

export default NoteDetailPage;
