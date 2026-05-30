import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export async function uploadImage(
  base64OrBuffer: string | Buffer,
  folder = "darnafood/dishes"
): Promise<{ url: string; publicId: string }> {
  const result = await new Promise<{ secure_url: string; public_id: string }>((resolve, reject) => {
    if (typeof base64OrBuffer === "string") {
      cloudinary.uploader.upload(
        base64OrBuffer,
        { folder, resource_type: "image" },
        (error, result) => {
          if (error) reject(error);
          else resolve(result as { secure_url: string; public_id: string });
        }
      );
    } else {
      cloudinary.uploader
        .upload_stream({ folder, resource_type: "image" }, (error, result) => {
          if (error) reject(error);
          else resolve(result as { secure_url: string; public_id: string });
        })
        .end(base64OrBuffer);
    }
  });

  return { url: result.secure_url, publicId: result.public_id };
}

export default cloudinary;
