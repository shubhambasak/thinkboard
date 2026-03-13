import React, { useState, useEffect } from "react";
import { Link } from "react-router";
import Navbar from "../components/Navbar";
import RateLimitedUI from "../components/RateLimitedUI";
import { fetchNotes } from "../api/notes";
import { FileTextIcon } from "lucide-react";
import toast from "react-hot-toast";

const HomePage = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rateLimited, setRateLimited] = useState(false);
  const [serverUnreachable, setServerUnreachable] = useState(false);
  const [retry, setRetry] = useState(0);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setRateLimited(false);
      setServerUnreachable(false);
      try {
        const data = await fetchNotes();
        if (!cancelled) setNotes(data);
      } catch (err) {
        if (!cancelled) {
          if (err.message?.toLowerCase().includes("too many")) {
            setRateLimited(true);
          } else if (err.message?.includes("Cannot reach server")) {
            setServerUnreachable(true);
          } else {
            toast.error(err.message || "Could not load notes.");
          }
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, [retry]);

  return (
    <div className="min-h-screen bg-base-100">
      <Navbar />
      <main className="max-w-3xl mx-auto px-4 py-10">
        {rateLimited && <RateLimitedUI />}
        {serverUnreachable && (
          <div className="rounded-xl border border-warning/50 bg-warning/10 p-4 mb-6 text-center">
            <p className="font-medium">Server not running</p>
            <p className="text-sm text-base-content/70 mt-1">
              From the project root run: <code className="bg-base-300 px-1.5 py-0.5 rounded">npm run dev</code>
            </p>
            <button type="button" className="btn btn-sm btn-outline mt-3" onClick={() => setRetry((r) => r + 1)}>
              Retry
            </button>
          </div>
        )}
        {!rateLimited && !serverUnreachable && (
          <>
            {loading ? (
              <div className="flex justify-center py-16">
                <span className="loading loading-spinner loading-lg text-primary" />
              </div>
            ) : notes.length === 0 ? (
              <div className="text-center py-16 text-base-content/70">
                <FileTextIcon className="size-12 mx-auto mb-3 opacity-50" />
                <p className="text-lg">No notes yet.</p>
                <p className="text-sm mt-1">Create one to get started.</p>
                <Link to="/create" className="btn btn-primary btn-sm mt-4">
                  New note
                </Link>
              </div>
            ) : (
              <ul className="space-y-2">
                {notes.map((note) => (
                  <li key={note._id}>
                    <Link
                      to={`/note/${note._id}`}
                      className="block p-4 rounded-lg border border-base-300 bg-base-200/50 hover:bg-base-200 hover:border-primary/30 transition-colors"
                    >
                      <h2 className="font-semibold text-base truncate">
                        {note.title || "Untitled"}
                      </h2>
                      <p className="text-sm text-base-content/70 mt-0.5 line-clamp-2">
                        {note.content || ""}
                      </p>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default HomePage;
