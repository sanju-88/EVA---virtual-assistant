import{ v2 as cloudinary } from 'cloudinary';
import fs from 'fs';

const uploadOnCloudinary = async (filePath) => {
    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET
    });

    try {
        const uploadResult = await cloudinary.uploader.upload(filePath, {
            public_id: 'your_public_id',
        });
        fs.unlinkSync(filePath); 
        return uploadResult.secure_url;
    } catch (error) {
        fs.unlinkSync(filePath); 
        return resizeBy.status(500).json({ message: 'Error uploading to Cloudinary:', error });
    }
}

export default uploadOnCloudinary;