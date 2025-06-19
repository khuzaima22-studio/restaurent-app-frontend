import { FaWrench } from "react-icons/fa";
import { useState } from "react";

type Note = {
  id: string;
  branch: string;
  message: string;
  createdAt: string;
};

const branches = ["Toronto, Canada", "Istanbul, Turkey", "Glasgow, United Kingdom"];

const issues = [
  "AC service needed",
  "Flour level is very low",
  "New staff required",
  "Freezer not working properly",
  "Ice cream stock low",
  "Dishwasher leaking",
  "Oven temperature irregular",
  "Shortage of cleaning supplies",
  "POS system lagging",
  "Restroom maintenance needed",
];

function getRandomIssues(): string {
  const count = Math.floor(Math.random() * 2) + 2; // 2–3 issues
  const selected = new Set<string>();
  while (selected.size < count) {
    selected.add(issues[Math.floor(Math.random() * issues.length)]);
  }
  return Array.from(selected).join(". ") + ".";
}
function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}
function generateInitialNotes(): Note[] {
    const noteCount = Math.floor(Math.random() * 3) + 1; // 1–3 notes
    const selectedBranches = shuffle(branches).slice(0, noteCount);

    return selectedBranches.map((branch, idx) => ({
      id: `note-${idx + 1}`,
      branch,
      message: getRandomIssues(),
      createdAt: new Date(
        Date.now() - Math.floor(Math.random() * 60 * 60 * 1000) // within the past hour
      ).toISOString(),
    }));
}

const initialNotes: Note[] = generateInitialNotes();

export default function SupervisorNotes() {
  const [notes, setNotes] = useState<Note[]>(initialNotes);

  const handleResolve = (id: string) => {
    setNotes((prev) => prev.filter((note) => note.id !== id));
  };

  return (
    <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 mt-8">
      {notes.map((note) => (
        <div
          key={note.id}
          className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all p-5 relative"
        >
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              <FaWrench className="text-orange-500" />
              {note.branch}
            </h3>

            <span className="text-xs font-medium px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full">
              Pending
            </span>
          </div>

          <p className="text-sm text-gray-700 whitespace-pre-line">
            {note.message}
          </p>

          {note.createdAt && (
            <p className="text-xs text-gray-400 mt-2">
              Added {new Date(note.createdAt).toLocaleString()}
            </p>
          )}

          <button
            onClick={() => handleResolve(note.id)}
            className="mt-4 inline-block text-sm font-medium text-white bg-green-600 hover:bg-green-700 px-4 py-2 rounded transition"
          >
            Mark as Resolved
          </button>
        </div>
      ))}

      {notes.length === 0 && (
        <div className="text-center col-span-full text-gray-500">
          All Reminders resolved!
        </div>
      )}
    </div>
  );
}
