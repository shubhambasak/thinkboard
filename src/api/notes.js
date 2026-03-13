const API = import.meta.env.VITE_API_URL || "";

const SERVER_UNREACHABLE =
  "Cannot reach server. From project root run: npm run dev";

async function apiFetch(url, options = {}) {
  try {
    return await fetch(`${API}${url}`, options);
  } catch (e) {
    if (e.name === "TypeError" && e.message?.includes("fetch")) {
      throw new Error(SERVER_UNREACHABLE);
    }
    throw e;
  }
}

export async function fetchNotes() {
  const res = await apiFetch("/api/notes");
  if (!res.ok) {
    if (res.status === 429) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.message || "Too many requests. Please try again later.");
    }
    const data = await res.json().catch(() => ({}));
    throw new Error(data.message || "Failed to load notes.");
  }
  return res.json();
}

export async function fetchNote(id) {
  const res = await apiFetch(`/api/notes/${id}`);
  if (!res.ok) {
    if (res.status === 404) throw new Error("Note not found.");
    if (res.status === 429) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.message || "Too many requests.");
    }
    const data = await res.json().catch(() => ({}));
    throw new Error(data.message || "Failed to load note.");
  }
  return res.json();
}

export async function createNote({ title, content }) {
  const res = await apiFetch("/api/notes", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, content }),
  });
  if (!res.ok) {
    if (res.status === 429) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.message || "Too many requests.");
    }
    const data = await res.json().catch(() => ({}));
    throw new Error(data.message || "Failed to create note.");
  }
  return res.json();
}

export async function updateNote(id, { title, content }) {
  const res = await apiFetch(`/api/notes/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, content }),
  });
  if (!res.ok) {
    if (res.status === 404) throw new Error("Note not found.");
    if (res.status === 429) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.message || "Too many requests.");
    }
    const data = await res.json().catch(() => ({}));
    throw new Error(data.message || "Failed to update note.");
  }
  return res.json();
}

export async function deleteNote(id) {
  const res = await apiFetch(`/api/notes/${id}`, { method: "DELETE" });
  if (!res.ok) {
    if (res.status === 404) throw new Error("Note not found.");
    if (res.status === 429) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.message || "Too many requests.");
    }
    const data = await res.json().catch(() => ({}));
    throw new Error(data.message || "Failed to delete note.");
  }
  return res.json();
}
