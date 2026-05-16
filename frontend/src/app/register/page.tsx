"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {

  const router = useRouter();

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");


  const disabled =
    email.length > 0 &&
    !email.endsWith("@gmail.com");



  useEffect(() => {
    const token = localStorage.getItem("accessToken");

    if (token) {
      router.push("/notes");
    }

  }, [])


  const register = async () => {

    const res = await fetch(
      "http://localhost:3001/auth/register",
      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/json",
        },

        body: JSON.stringify({
          email,
          password,
        }),
      }
    );

    const data = await res.json();

    if (!res.ok) {
      // <p>
      //   Wrong email
      // </p>
      console.log(data);
      return;
    }

    router.push("/login");
  };

 



  return (
    <div style={{ padding: 20 }}>

      <h1>Register</h1>

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

      <button onClick={register} disabled={disabled} className="disabled:text-amber-300" >
        Register
      </button>

      {email && !email.endsWith("@gmail.com") &&
        (<p>invalid email</p>)
      }

    </div>
  );
}