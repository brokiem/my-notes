import {useState} from "react";
import Tippy from '@tippyjs/react';
import { v4 as uuidv4 } from 'uuid';
import 'tippy.js/dist/tippy.css';
import 'tippy.js/themes/material.css';
import 'tippy.js/animations/scale-subtle.css';
import MoonLoader from "react-spinners/MoonLoader";

type Note = {
  id: string;
  title: string;
  content: string;
}

const MainView = () => {
  const [notes, setNotes] = useState<Note[]>(localStorage.getItem("notes") ? JSON.parse(localStorage.getItem("notes")!) : []);
  const [selectedNote, selectNote] = useState<Note | null>(null);
  const [title, setTitle] = useState<string>(selectedNote?.title ?? "");
  const [content, setContent] = useState<string>(selectedNote?.content ?? "");
  const [isSaved, setSaved] = useState<boolean>(true);
  const [savedTimeout, setSavedTimeout] = useState<number | null>(null);

  function createNewNote() {
    if (selectedNote) {
      clearTimeout(savedTimeout!);
      saveNote();
      setSaved(true);
    }

    selectNote(null);
    setTitle("");
    setContent("");

    document.getElementById("title-input")?.focus();
  }

  function isNoteExists(id: string) {
    return notes.find((n) => n.id === id);
  }

  function saveNote(note: Note | null = null) {
    const id = selectedNote?.id ?? uuidv4();
    const newNote = note ?? {
      id: id,
      title,
      content,
    }

    if (isNoteExists(id)) {
      const updatedNotes = notes.map((n) => n.id === id ? newNote : n);
      setNotes(updatedNotes);

      localStorage.setItem("notes", JSON.stringify(updatedNotes));
    } else {
      setNotes([newNote, ...notes]);

      localStorage.setItem("notes", JSON.stringify([newNote, ...notes]));
    }

    selectNote(newNote);
  }

  function deleteNote() {
    if (selectedNote && isNoteExists(selectedNote.id)) {
      const updatedNotes = notes.filter((n) => n.id !== selectedNote.id);
      setNotes(updatedNotes);
      localStorage.setItem("notes", JSON.stringify(updatedNotes));

      selectNote(null);
      setTitle("");
      setContent("");
    }
  }

  return (
    <div className={"flex mx-10 mt-10"}>
      <div className={"flex gap-5 rounded-md w-full"}>
        <div className={"flex flex-col gap-6 w-64"}>
          <button
            id={"new-note-button"}
            onClick={() => createNewNote()}
            className={"flex items-center text-sm font-medium bg-[#222327] hover:bg-[#2a2b2e] active:bg-[#4f5052] transition duration-200 w-fit h-[36px] px-3 pr-5 rounded-full gap-2"}>
            <span className="material-symbols-outlined">add</span>
            New Note
          </button>
          {/* Notes */}
          <Notes
            notes={notes}
            selectNote={selectNote}
            setTitle={setTitle}
            setContent={setContent}
            selectedNote={selectedNote}
            savedTimeout={savedTimeout}
            saveNote={saveNote}
            setSaved={setSaved}
          />
        </div>

        <div className={"grow"}>
          {/* Note form */}
          <div className={"flex flex-col bg-[#222327] rounded-md px-1 sticky top-10"}>
            <NoteInput title={title} selectedNote={selectedNote} setTitle={setTitle} setContent={setContent} content={content} savedTimeout={savedTimeout} setSaved={setSaved} saveNote={saveNote} setSavedTimeout={setSavedTimeout} />

            {/* Action buttons */}
            <div className={"flex mt-5 mb-1 mx-2 gap-2"}>
              <Tippy content="Save" delay={50} duration={150} animation={"scale-subtle"} placement={"bottom"} arrow={false}>
                <button
                  id={"save-button"}
                  onClick={() => {
                    clearTimeout(savedTimeout!);
                    setSaved(false);

                    const timeoutId = setTimeout(() => {
                      saveNote();
                      setSaved(true);
                    }, 200);
                    setSavedTimeout(timeoutId);
                  }}
                  className={"flex content-center justify-center items-center rounded-full hover:bg-[#303235] active:bg-[#4f5052] transition duration-200 w-9 h-[36px] px-4 gap-2"}>
                  <span className="material-symbols-outlined text-[#bebebf]">save</span>
                </button>
              </Tippy>
              {
                selectedNote && (
                  <Tippy content="Delete note" delay={50} duration={150} animation={"scale-subtle"} placement={"bottom"}
                         arrow={false}>
                    <button
                      id={"delete-button"}
                      onClick={() => deleteNote()}
                      className={"flex content-center justify-center items-center rounded-full hover:bg-[#303235] active:bg-[#4f5052] transition duration-200 w-9 h-[36px] px-4 gap-2"}>
                      <span className="material-symbols-outlined text-[#bebebf]">delete</span>
                    </button>
                  </Tippy>
                )
              }

              <div className={"grow"} />

              {
                selectedNote && (
                  <div className={"flex items-center gap-2"}>
                    {
                      isSaved ? (
                        <>
                          <span className="material-symbols-outlined text-[#bebebf]">auto_awesome</span><span
                          className={"text-[#bebebf]"}>All changes saved</span>
                        </>
                      ) : (
                        <>
                          <MoonLoader
                            color="#3e85ee"
                            size={16}
                            loading
                          />
                          <span className={"text-[#bebebf]"}>Saving...</span>
                        </>
                      )
                    }
                  </div>
                )
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Notes({notes, selectNote, setTitle, setContent, selectedNote, savedTimeout, saveNote, setSaved}: { notes: Note[], selectNote: (note: Note) => void, setTitle: (title: string) => void, setContent: (content: string) => void, selectedNote: Note | null, savedTimeout: number | null, saveNote: () => void, setSaved: (saved: boolean) => void }) {
  return (
    <>
      <div>
        <p className={"text-sm mb-2"}>Your notes</p>
        <div className={"flex flex-col gap-1"}>
          {
            notes.map((note) => (
              <button
                key={note.id}
                onClick={() => {
                  if (selectedNote) {
                    clearTimeout(savedTimeout!);
                    saveNote();
                    setSaved(true);
                  }

                  selectNote(notes.find((n) => n.id === note.id)!);
                  setTitle(note.title);
                  setContent(note.content);
                }}
                className={
                selectedNote?.id === note.id ?
                "flex items-center text-sm font-normal bg-[#0f5223] focus:bg-[#0f5223] transition duration-200 w-64 h-[36px] px-3 rounded-full gap-2 truncate align-middle"
                :
                "flex items-center text-sm font-normal bg-[#222327] hover:bg-[#2a2b2e] active:bg-[#4f5052] transition duration-200 w-64 h-[36px] px-3 rounded-full gap-2 truncate align-middle"}>
                <span className="material-symbols-outlined">description</span>
                {note.title}
              </button>
            ))
          }
        </div>
      </div>
    </>
  )
}

function NoteInput({title, selectedNote, setTitle, setContent, content, savedTimeout, setSaved, saveNote, setSavedTimeout}: { title: string, selectedNote: Note | null, setTitle: (title: string) => void, setContent: (content: string) => void, content: string, savedTimeout: number | null, setSaved: (saved: boolean) => void, saveNote: (note: Note | null) => void, setSavedTimeout: (timeout: number | null) => void }) {
  return (
    <>
      <input
        id={"title-input"}
        className={"text-xl bg-transparent placeholder-[rgba(255,255,255,0.6)] border-0 outline-none focus:ring-0 h-12 rounded-t-md"}
        type={"text"}
        placeholder={"Title"}
        value={title}
        onChange={(e) => {
          setTitle(e.target.value);

          if (selectedNote) {
            clearTimeout(savedTimeout!);
            setSaved(false);

            const timeoutId = setTimeout(() => {
              saveNote({
                id: selectedNote.id,
                title: e.target.value,
                content: selectedNote.content,
              });
              setSaved(true);
            }, 500);
            setSavedTimeout(timeoutId);
          }
        }}/>
      <textarea
        id={"content-input"}
        className={"bg-transparent placeholder-[rgba(255,255,255,0.6)] border-0 outline-none focus:ring-0 rounded-b-md"}
        rows={10}
        placeholder={"Type your notes here..."}
        value={content}
        onChange={(e) => {
          setContent(e.target.value);

          if (selectedNote) {
            clearTimeout(savedTimeout!);
            setSaved(false);

            const timeoutId = setTimeout(() => {
              saveNote({
                id: selectedNote.id,
                title: selectedNote.title,
                content: e.target.value,
              });
              setSaved(true);
            }, 500);
            setSavedTimeout(timeoutId);
          }
        }}>
      </textarea>
    </>
  )
}

export default MainView;
