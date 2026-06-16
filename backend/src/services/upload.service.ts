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

export const delteFromCloudinary = async (filePublicId: string) => {

    console.log("public id of the image is ",filePublicId);

    const result = await cloudinary.uploader.destroy(
        filePublicId
    );
    // return result.public_id;
    return filePublicId
}