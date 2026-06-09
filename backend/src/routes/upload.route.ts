import { Router } from "express";
import { upload } from "../middleware/upload.middleware";

const router = Router();

router.post(
    "/",
    upload.single("file"),
    (req, res) => {
        res.status(200).json({
            message: "uploaded successfully",
            file: req.file,
        })
    }
)

export default router;