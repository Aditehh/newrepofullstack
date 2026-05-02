// src/index.ts
// import express from "express";
// import { prisma } from "./db";
// import "dotenv/config";
// import cors from "cors";



// const app = express(); // creates your backend app
// app.use(express.json()); //converts incomming json into usable javascript
// app.use(cors());



// app.post("/notes", async (req, res) => {
//   const { title, content } = req.body; //extract data from request

//   const note = await prisma.note.create({ //database write
//     data: { title, content },
//   });


//   res.json(note); //sends back the created note as json

// })


// app.get("/notes", async (req, res) => { //read
//   const notes = await prisma.note.findMany({ //fetch from the database 
//     orderBy: { createdAt: "desc" }
//   });
//   res.json(notes);
// })


// app.delete("/notes/:id", async (req, res) => {
//   const { id } = req.params;

//   const deletenote = await prisma.note.delete({
//     where: { id },
//   });

//   res.json(deletenote);
// });



// app.listen(3001, () => {
//   console.log("Server running on port 3001");
// });

// app.put("/notes/:id", async (req, res) => {
//   const { id } = req.params;
//   const { title, content } = req.body;

//   try {
//     const updatenote = await prisma.note.update({
//       where: {
//         id
//       },
//       data: {
//         title,
//         content
//       }
//     });

//     res.json(updatenote);

//   }
//   catch (error) {
//     res.status(404).json({ error: "note not found" })

//   }

// })



import express from "express";
import cors from "cors";
import noteRoutes from "./routes/note.routes"
import "dotenv/config"
import { errorHandler } from "./middleware/error.middleware";
import authRoutes from "./routes/auth.routes";


const app = express();

app.use(cors());
app.use(express.json());
app.use("/auth", authRoutes)

app.use("/notes", noteRoutes);
app.use(errorHandler)


app.listen(3001, () => {
  console.log("Server running on 3001");
});