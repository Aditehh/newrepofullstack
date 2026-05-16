"use client"
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {

    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const disabled =
        email.length > 0 &&
        !email.endsWith("@gmail.com");



    useEffect(() => {

        const token = localStorage.getItem("accessToken");

        if (token) {
            router.push("/notes");
        }

    }, [])

    const login = async () => {

        const res = await fetch(
            "http://localhost:3001/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password })

        }
        )

        const data = await res.json();

        if (!res.ok) {
            console.log(data);
            return;
        }

        router.push("/notes")


        localStorage.setItem("accessToken", data.accessToken);
        localStorage.setItem("refreshToken", data.refreshToken);


        router.push("/notes");


    }



    return (
        <div style={{ padding: 20 }}>

            <h1>Login</h1>

            <input
                placeholder="Email"
                value={email}
                onChange={(e) =>
                    setEmail(e.target.value)
                }
            />

            <br />

            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) =>
                    setPassword(e.target.value)
                }
            />

            <br />

            <button onClick={login} disabled={disabled} className="disabled:text-amber-300" >
                Login
            </button>

            {email && !email.endsWith("@gmail.com") &&
                (<p>invalid email</p>)
            }

        </div>
    )
}
