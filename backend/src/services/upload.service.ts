import cloudinary from "../config/cloudinary";

export const uploadToCloudinary =
    async (filePath: string) => {

        const result = await cloudinary.uploader.upload(
            filePath,
            {
                folder: "notes"
            }
        );

        return ({

            fileUrl: result.secure_url,
            filePublicId: result.public_id,
        })

    }

export const delteFromCloudinary = async (filePath: string) => {

    const result = await cloudinary.uploader.destroy(
        filePath
    )
}