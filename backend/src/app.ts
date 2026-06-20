import express from "express";
import cors from "cors";
import noteRoutes from "./routes/note.routes"
// import "dotenv/config";
import { errorHandler } from "./middleware/error.middleware";
import authRoutes from "./routes/auth.routes";
import { globalLimiter } from "./middleware/rateLimit.middleware";
import { pinoHttp } from "pino-http";
import { logger } from "./utils/logger";
import { connectRedis } from "./config/redis";


import path from "path";


const app = express();

app.use(express.json());

app.use(globalLimiter);

app.use(
    pinoHttp({
        logger,
    })
)

app.use(cors());
app.use(express.json());

connectRedis().then(() => {
    console.log("REDIS READY")
})

app.use("/auth", authRoutes)

app.use("/notes", noteRoutes);


app.use(
    "/uploads",
    express.static(
        path.join(process.cwd(), "uploads")
    )
);


app.use(errorHandler)
// the errorHandler is at the last because middleware chain flows downward
// routes run first and if errors happens then they go and pile into the errrorhaldner


// app.listen(3001, () => {
//   console.log("Server running on 3001");
// });

export default app;