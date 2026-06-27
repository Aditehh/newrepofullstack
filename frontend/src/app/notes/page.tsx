"use client"
import { useState } from 'react'
import { useEffect } from 'react'
import { apiFetch } from '@/lib/api';
import { useSearchParams, useRouter } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';
import axios from 'axios';


export default function NotesPage() {
    const [notes, setNotes] = useState<any[]>([]);
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editTitle, setEditTitle] = useState("");
    const [editContent, setEditContent] = useState("");
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("")
    // const [currentPage, setCurrentPage] = useState(1);
    // const [page, setPage] = useState(1)
    const [loading, setLoading] = useState(false);
    const [file, setFile] = useState<File | null>(null)


    // console.log("CURRENT PAGE:", page);


    const router = useRouter();
    const searchParams = useSearchParams();


    const page =
        Number(searchParams.get("page") || "1");

    const limit =
        searchParams.get("limit") || "10";

    // const limit = 10;

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
        fetchNotes();
    }, [page, debouncedSearch]);


    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearch(search)
        }, 400);
        return () => {
            clearTimeout(handler)
        }
    }, [search])


    // useEffect(() => {

    //     const token = getToken();
    //     if (token) {

    //     }

    // }, []);

    // console.log("fetch token is",getToken)


    const fetchNotes = async () => {
        try {
            setLoading(true)

            // const token = localStorage.getItem("token");
            const token = getToken();

            if (!token) {
                console.log("No token, stopping fetch");
                return;
            }

            const res = await apiFetch(`http://localhost:3001/notes?page=${page}&limit=${limit}&search=${debouncedSearch}`, {
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
        } finally {
            setLoading(false)
        }
        // setNotes(data);
    };




    // const createNote = async () => {

    //     const token = localStorage.getItem("accessToken");


    //     if (!title || !content) return;

    //     //     // await fetch("http://localhost:3001/notes", {
    //     //     //   method: "POST",
    //     //     //   headers: {
    //     //     //     "Content-Type": "application/json",
    //     //     //     Authorization: `Bearer ${token}`
    //     //     //   },  
    //     //     //   body: JSON.stringify({ title, content })
    //     //     // });


    //     await apiFetch(
    //         "http://localhost:3001/notes", {
    //         method: "POST",
    //         headers: {
    //             "Content-Type": "application/json"
    //         },
    //         body: JSON.stringify({
    //             title,
    //             content
    //         })
    //     }
    //     )

    //     // console.log(token);



    // }

    const startEdit = (note: any) => {
        setEditingId(note.id);
        setEditTitle(note.title);
        setEditContent(note.content);
    };


    const handleCreateNote = async () => {

        const token = localStorage.getItem("accessToken");

        const formdata = new FormData();

        formdata.append("title", title);
        formdata.append("content", content);

        if (file instanceof File) {
            formdata.append("file", file);
        }

        if (!title || !content)
            return;

        console.log(title)
        console.log(content)
        console.log(file)

        await axios.post("http://localhost:3001/notes", formdata, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })


        setTitle("");
        setContent("");
        setFile(null);
        await fetchNotes();

    }


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
            method: "PUT",
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
        await fetchNotes();
    }


    // const uploadFile = async () => {

    //     const token = localStorage.getItem("accessToken");

    //     const formdata = new FormData();

    //     formdata.append("title", title);
    //     formdata.append("content", content);

    //     if (file instanceof File) {
    //         formdata.append("file", file)
    //     }

    //     await axios.post(
    //         "http://localhost:3001/notes",
    //         formdata,
    //         {
    //             headers: {
    //                 Authorization: `Bearer ${token}`
    //             }
    //         }
    //     )


    // }

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

        await fetchNotes();
        console.log("Notes is ", notes)
        console.log("Type ", typeof notes)
    }







    return (

        // <div>
        //     <h1>Notes</h1>

        //     <div>
        //         <input
        //             placeholder="Title"
        //             value={title}
        //             onChange={(e) => setTitle(e.target.value)}
        //         />
        //         <br />
        //         <textarea
        //             placeholder="Content"
        //             value={content}
        //             onChange={(e) => setContent(e.target.value)}
        //         />
        //         <br />
        //         <button onClick={createNote}>Add Note</button>
        //     </div>

        //     <hr />


        //     {editingId && (
        //         <div style={{ marginBottom: 20 }}>
        //             <h2>Edit Note</h2>

        //             <input
        //                 value={editTitle}
        //                 onChange={(e) => setEditTitle(e.target.value)}
        //                 placeholder="Title"
        //             />

        //             <br />
        //             <textarea value={editContent} onChange={(e) => setEditContent(e.target.value)} placeholder="Content" />
        //             <br />
        //             <button onClick={updateNote}>

        //                 Save Changes          </button>

        //             <button onClick={() => setEditingId(null)}>
        //                 Cancel
        //             </button>
        //         </div>
        //     )}

        //     <div>
        //         <h1>search for your notes</h1>
        //         <input type="text"
        //             placeholder='Search notes'
        //             value={search}
        //             onChange={(e) => setSearch(e.target.value)}
        //         />
        //         <button onClick={fetchNotes}>search note</button>
        //     </div>

        //     {notes.map((note) => (
        //         <div key={note.id}>
        //             <h2>{note.title}</h2>
        //             <p>{note.content}</p>
        //             <p>
        //                 <button onClick={() => deleteNote(note.id)}>Delete Note</button>
        //             </p>
        //             <button onClick={() => startEdit(note)}>edit</button>
        //         </div>
        //     ))};
        // </div>

        <div className="min-h-screen bg-gray-100 py-10 px-4">
            <div className="max-w-5xl mx-auto bg-white shadow-xl rounded-2xl p-8">

                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-4xl font-bold text-gray-800">📝 Notes App</h1>

                    <div className="flex gap-2">
                        <input
                            type="text"
                            placeholder="Search notes..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />

                        <button
                            onClick={fetchNotes}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
                        >
                            Search
                        </button>
                    </div>
                </div>

                {/* Add Note */}
                <div className="bg-gray-50 p-6 rounded-xl shadow-sm mb-8">
                    <h2 className="text-2xl font-semibold mb-4 text-gray-700">
                        Add New Note
                    </h2>

                    <input
                        placeholder="Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />

                    <textarea
                        placeholder="Write your note..."
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        // rows="5"
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />

                    <input
                        type="file"
                        onChange={(e) => {
                            setFile(e.target.files?.[0] || null);
                        }}
                    />
                    <br />

                    {/* <button
                        onClick={uploadFile}
                        className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition"
                    >
                        Add file
                    </button> */}


                    <br />

                    <button
                        onClick={handleCreateNote}
                        className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition"
                    >
                        Add Note
                    </button>
                </div>

                {/* Edit Note */}
                {editingId && (
                    <div className="bg-yellow-50 border border-yellow-200 p-6 rounded-xl shadow-sm mb-8">
                        <h2 className="text-2xl font-semibold mb-4 text-gray-700">
                            Edit Note
                        </h2>

                        <input
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                            placeholder="Title"
                            className="w-full border border-gray-300 rounded-lg px-4 py-3 mb-4 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                        />

                        <textarea
                            value={editContent}
                            onChange={(e) => setEditContent(e.target.value)}
                            placeholder="Content"
                            // rows="5"
                            className="w-full border border-gray-300 rounded-lg px-4 py-3 mb-4 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                        />

                        <div className="flex gap-3">
                            <button
                                onClick={updateNote}
                                className="bg-yellow-500 hover:bg-yellow-600 text-white px-5 py-2 rounded-lg transition"
                            >
                                Save Changes
                            </button>

                            <button
                                onClick={() => setEditingId(null)}
                                className="bg-gray-400 hover:bg-gray-500 text-white px-5 py-2 rounded-lg transition"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                )}

                {/* Notes List */}
                <div>
                    <h2 className="text-3xl font-bold text-gray-800 mb-6">
                        Your Notes
                    </h2>
                    {loading ? (
                        <Skeleton className='h-10 w-full' />
                    ) : (
                        notes.length === 0 ? (
                            <p className="text-gray-500 text-center">
                                No notes found.
                            </p>
                        ) : (
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {notes.map((note) => (
                                    <div
                                        key={note.id}
                                        className="bg-white border border-gray-200 rounded-xl shadow-md p-5 hover:shadow-xl transition"
                                    >
                                        <h3 className="text-xl font-bold text-gray-800 mb-3">
                                            {note.title}
                                        </h3>

                                        <p className="text-gray-600 mb-5 whitespace-pre-line">
                                            {note.content}
                                        </p>

                                        {note.fileUrl && (
                                            <div>

                                                {/* <img src={`http://localhost:3001${note.file}`} alt={note.title} width={200} /> */}
                                                <img src={note.fileUrl} alt={note.title} />
                                            </div>

                                        )}

                                        <div className="flex justify-between">
                                            <button
                                                onClick={() => startEdit(note)}
                                                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition"
                                            >
                                                Edit
                                            </button>

                                            <button
                                                onClick={() => deleteNote(note.id)}
                                                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )
                    )}
                    <div style={{ marginTop: 20 }}>
                        {/* <button
                            onClick={() =>
                                setPage((p) => Math.max(p - 1, 1))
                            }
                            disabled={page === 1}
                        >
                            Prev
                        </button> */}

                        <button
                            onClick={() =>
                                router.push(`/notes?page=${Math.max(page - 1, 1)}`)
                            }
                        >
                            Prev
                        </button>
                        <span style={{ margin: "0 10px" }}>
                            Page {page}
                        </span>
                        <button
                            onClick={() =>
                                router.push(`/notes?page=${page + 1}`)
                            }
                        >
                            Next
                        </button>



                        {/* <button
                            onClick={() =>
                                setPage((p) => p + 1)
                            }
                        >
                            Next
                        </button> */}
                    </div>                </div>
            </div>
        </div>
    )
}
