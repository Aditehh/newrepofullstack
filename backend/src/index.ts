// src/index.ts
import express from "express";
import { prisma } from "./db";
import "dotenv/config";
import cors from "cors";



const app = express(); // creates your backend app
app.use(express.json()); //converts incomming json into usable javascript
app.use(cors());



app.post("/notes", async (req, res) => {
  const { title, content } = req.body; //extract data from request

  const note = await prisma.note.create({ //database write
    data: { title, content },
  });


  res.json(note); //sends back the created note as json
})


app.get("/notes", async (req, res) => { //read
  const notes = await prisma.note.findMany({ //fetch from the database 
    orderBy: { createdAt: "desc" }
  });
  res.json(notes);
})


app.delete("/notes/:id", async (req, res) => {
  const { id } = req.params;

  const deletenote = await prisma.note.delete({
    where: { id },
  });

  res.json(deletenote);
});



// app.put("/notes/:id", async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { title, content } = req.body;
//     console.log(id)
//     const updatedNote = await prisma.note.update({
//       where: { id },
//       data: {
//         title,
//         content,
//       },
//     });

//     res.json(updatedNote);
//   }
//   catch (error) {
//     res.status(404).json({ error: "Note not found " })
//   }
// });



app.listen(3001, () => {
  console.log("Server running on port 3001");
});

app.put("/notes/:id", async (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;

  try {
    const updatenote = await prisma.note.update({
      where: {
        id
      },
      data: {
        title,
        content
      }
    });

    res.json(updatenote);

  }
  catch (error) {
    res.status(404).json({ error: "note not found" })

  }

})