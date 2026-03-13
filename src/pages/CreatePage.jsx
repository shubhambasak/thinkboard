import React, { useState } from "react";
import { useNavigate } from "react-router";
import Navbar from "../components/Navbar";
import { createNote } from "../api/notes";
import toast from "react-hot-toast";

const CreatePage = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    const t = title.trim();
    const c = content.trim();
    if (!t || !c) {
      toast.error("Title and content are required.");
      return;
    }
    setSubmitting(true);
    try {
      const note = await createNote({ title: t, content: c });
      toast.success("Note created.");
      navigate(`/note/${note._id}`);
    } catch (err) {
      toast.error(err.message || "Failed to create note.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-base-100">
      <Navbar />
      <main className="max-w-2xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-semibold mb-6">New note</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="title" className="label">
              <span className="label-text">Title</span>
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Note title"
              className="input input-bordered w-full"
              autoFocus
              disabled={submitting}
            />
          </div>
          <div>
            <label htmlFor="content" className="label">
              <span className="label-text">Content</span>
            </label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your note..."
              className="textarea textarea-bordered w-full min-h-[200px]"
              disabled={submitting}
            />
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={submitting}
            >
              {submitting ? "Creating…" : "Create"}
            </button>
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() => navigate("/")}
              disabled={submitting}
            >
              Cancel
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default CreatePage;
