"use client"
import { useState } from 'react'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { apiFetch } from '@/lib/api';
import { useSearchParams } from 'next/navigation';


export default function NotesPage() {
    const [notes, setNotes] = useState<any[]>([]);
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editTitle, setEditTitle] = useState("");
    const [editContent, setEditContent] = useState("");
    const [search, setSearch] = useState("");




    const router = useRouter();
    const searchParams = useSearchParams();


    const page =
        searchParams.get("page") || "1";

    const limit =
        searchParams.get("limit") || "10";

    const getToken = () => {

        const token = localStorage.getItem("accessToken");

        if (!token || token === "undefined" || token === "null") {
            return null;
        }

        return token;
    };


    useEffect(() => {

        const token = getToken();
        if (!token) {
            router.push("/login")
        }
        fetchNotes()
    }, []);


    // useEffect(() => {

    //     const token = getToken();
    //     if (token) {

    //     }

    // }, []);

    // console.log("fetch token is",getToken)


    const fetchNotes = async () => {
        // const token = localStorage.getItem("token");
        const token = getToken();

        if (!token) {
            console.log("No token, stopping fetch");
            return;
        }

        const res = await apiFetch(`http://localhost:3001/notes?page=${page}&limit=${limit}&search=${search}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        const data = await res.json();

        if (Array.isArray(data)) {
            setNotes(data);
        }
        else {
            console.log("Error response", data);
            setNotes([])
        }
        // setNotes(data);
    };




    const createNote = async () => {
        const token = localStorage.getItem("accessToken");


        if (!title || !content) return;

        //     // await fetch("http://localhost:3001/notes", {
        //     //   method: "POST",
        //     //   headers: {
        //     //     "Content-Type": "application/json",
        //     //     Authorization: `Bearer ${token}`
        //     //   },  
        //     //   body: JSON.stringify({ title, content })
        //     // });


        await apiFetch(
            "http://localhost:3001/notes", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                title,
                content
            })
        }
        )

        // console.log(token);

        setTitle("");
        setContent("");
        fetchNotes();

    }

    const startEdit = (note: any) => {
        setEditingId(note.id);
        setEditTitle(note.title);
        setEditContent(note.content);
    };


    const updateNote = async () => {
        const token = localStorage.getItem("accessToken");

        if (!editingId) return;

        //     // await fetch(`http://localhost:3001/notes/${editingId}`, {
        //     //   method: "PUT",
        //     //   headers: {
        //     //     "Content-Type": "application/json",
        //     //     Authorization: `Bearer ${token}`
        //     //   },
        //     //   body: JSON.stringify({
        //     //     title: editTitle,
        //     //     content: editContent,
        //     //   })
        //     // });

        await apiFetch(
            `http://localhost:3001/notes/${editingId}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
                title: editTitle,
                content: editContent
            })
        }
        )

        setEditingId(null);
        setEditTitle("");
        setEditContent("");
        fetchNotes();
    }

    const deleteNote = async (id: string) => {
        const token = localStorage.getItem("accessToken");


        //     // await fetch(`http://localhost:3001/notes/${id}`, {
        //     //   method: "DELETE",
        //     //   headers: {
        //     //     Authorization: `Bearer ${token}`
        //     //   }


        //     // });

        await apiFetch(
            `http://localhost:3001/notes/${id}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
        )

        fetchNotes();
        console.log("Notes is ", notes)
        console.log("Type ", typeof notes)
    }







    return (

        <div>
            <h1>Notes</h1>

            <div>
                <input
                    placeholder="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
                <br />
                <textarea
                    placeholder="Content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                />
                <br />
                <button onClick={createNote}>Add Note</button>
            </div>

            <hr />


            {editingId && (
                <div style={{ marginBottom: 20 }}>
                    <h2>Edit Note</h2>

                    <input
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        placeholder="Title"
                    />

                    <br />
                    <textarea value={editContent} onChange={(e) => setEditContent(e.target.value)} placeholder="Content" />
                    <br />
                    <button onClick={updateNote}>

                        Save Changes          </button>

                    <button onClick={() => setEditingId(null)}>
                        Cancel
                    </button>
                </div>
            )}

            <div>
                <h1>search for your notes</h1>
                <input type="text"
                    placeholder='Search notes'
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                <button onClick={fetchNotes}>search note</button>
            </div>

            {notes.map((note) => (
                <div key={note.id}>
                    <h2>{note.title}</h2>
                    <p>{note.content}</p>
                    <p>
                        <button onClick={() => deleteNote(note.id)}>Delete Note</button>
                    </p>
                    <button onClick={() => startEdit(note)}>edit</button>
                </div>
            ))};
        </div>
    )
}
