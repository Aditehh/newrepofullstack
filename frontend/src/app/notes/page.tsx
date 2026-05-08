import React from 'react'
import { useState } from 'react'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { apiFetch } from '@/lib/api';

export default function NotesPage() {
    const [notes, setNotes] = useState<any[]>([]);
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editTitle, setEditTitle] = useState("");
    const [editContent, setEditContent] = useState("");




    const router = useRouter();

    const getToken = () =>
        localStorage.getItem("accessToken");


    useEffect(() => {
        const token = getToken();


        if (!token) {
            router.push("/login")
        }
    }, []);

    useEffect(() => {

        const token = getToken();

        if (token) {
            fetchNotes();
        }

    }, []);



    const fetchNotes = async () => {
        // const token = localStorage.getItem("token");
        const token = getToken();

        const res = await fetch("http://localhost:3001/notes", {
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

        </div>
    )
}
