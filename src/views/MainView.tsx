import {useState} from "react";

const MainView = () => {
  const [notes, setNotes] = useState<{
    id: number;
    title: string;
    content: string;
  }[]>(localStorage.getItem("notes") ? JSON.parse(localStorage.getItem("notes")!) : []);

  const [selectedNote, selectNote] = useState<{
    id: number;
    title: string;
    content: string;
  } | null>(null);

  const [title, setTitle] = useState<string>(selectedNote?.title ?? "");
  const [content, setContent] = useState<string>(selectedNote?.content ?? "");

  function createNewNote() {
    setTitle("");
    setContent("");
    selectNote(null);
  }

  return (
    <div className={"flex mx-10 mt-10"}>
      <div className={"flex gap-5 rounded-md w-full"}>
        <div className={"flex flex-col gap-6"}>
          <button onClick={() => createNewNote()}
                  className={"flex items-center bg-[#222327] hover:bg-[#2a2b2e] w-64 h-[36px] px-4 rounded-md gap-4"}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd"
                    d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                    clipRule="evenodd"/>
            </svg>
            New Note
          </button>
          {/* Notes */}
          <div>
            <p className={"text-sm mb-2"}>Your notes</p>
            <div className={"flex flex-col gap-1"}>
              {
                notes.map((note) => (
                    <button
                      onClick={() => {
                        selectNote(notes.find((n) => n.id === note.id)!);
                        setTitle(note.title);
                        setContent(note.content);
                      }}
                       className={"flex items-center bg-[#222327] hover:bg-[#2a2b2e] w-64 h-[36px] px-4 rounded-md gap-4"}>
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"
                           className="w-5 h-5">
                        <path fillRule="evenodd"
                              d="M15.621 4.379a3 3 0 00-4.242 0l-7 7a3 3 0 004.241 4.243h.001l.497-.5a.75.75 0 011.064 1.057l-.498.501-.002.002a4.5 4.5 0 01-6.364-6.364l7-7a4.5 4.5 0 016.368 6.36l-3.455 3.553A2.625 2.625 0 119.52 9.52l3.45-3.451a.75.75 0 111.061 1.06l-3.45 3.451a1.125 1.125 0 001.587 1.595l3.454-3.553a3 3 0 000-4.242z"
                              clipRule="evenodd"/>
                      </svg>
                      {note.title}
                    </button>
                ))
              }
            </div>
          </div>
        </div>

        <div className={"grow"}>
          {/* Note form */}
          <div className={"flex flex-col bg-[#222327] rounded-md"}>
            <input className={"text-xl bg-transparent border-0 outline-none focus:ring-0 h-12 rounded-t-md"} type={"text"}
                   placeholder={"Title"} value={title} onChange={(e) => setTitle(e.target.value)} />
            <textarea className={"bg-transparent border-0 outline-none focus:ring-0 rounded-b-md"} rows={10}
                      placeholder={"Type your notes here..."} value={content} onChange={(e) => setContent(e.target.value)}>
            </textarea>
          </div>

          {/* Action buttons */}
          <div className={"flex gap-2 mt-2"}>
            {
              selectedNote && (
                <button
                  onClick={() => {
                    // Delete note
                    if (selectedNote) {
                      const index = notes.findIndex((n) => n.id === selectedNote.id);
                      notes.splice(index, 1);
                      setNotes([...notes]);
                      localStorage.setItem("notes", JSON.stringify(notes));
                      createNewNote();
                    }
                  }}
                  className={"flex items-center bg-[#222327] hover:bg-[#2a2b2e] h-[36px] px-4 rounded-md gap-4"}>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-red-500">
                    <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
                  </svg>
                  Delete
                </button>
              )
            }
            <button
              onClick={() => {
                // Save note
                if (selectedNote) {
                  const index = notes.findIndex((n) => n.id === selectedNote.id);
                  notes[index] = {
                    id: selectedNote.id,
                    title,
                    content,
                  };
                } else {
                  notes.push({
                    id: Math.floor(Math.random() * 1000000),
                    title,
                    content,
                  });
                }
                setNotes([...notes]);
                localStorage.setItem("notes", JSON.stringify(notes));
              }}
              className={"flex items-center bg-[#222327] hover:bg-[#2a2b2e] h-[36px] px-4 rounded-md gap-4"}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-green-500">
                <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
              </svg>
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainView;
