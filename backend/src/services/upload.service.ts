import cloudinary from "../config/cloudinary";

export const uploadToCloudinary =
    async (filePath: string) => {

        const result = await cloudinary.uploader.upload(
            filePath,
            {
                folder: "notes"
            }
        );

        return result.secure_url, result.public_id;
    }

export const delteFromCloudinary = async (filePath: string) => {

    const result = await cloudinary.uploader.destroy(
        filePath
    )
}