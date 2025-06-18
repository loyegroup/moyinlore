// app/api/upload/route.ts
import { NextRequest } from 'next/server';
import { IncomingForm } from 'formidable';
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';

export const config = {
  api: {
    bodyParser: false, // Disable Next.js body parsing for file uploads
  },
};

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export async function POST(req: NextRequest) {
  const form = new IncomingForm({ multiples: false });

  return new Promise((resolve, reject) => {
    form.parse(req as any, async (err, fields, files) => {
      try {
        if (err) throw err;

        const file = files.file;
        const fileObj = Array.isArray(file) ? file[0] : file;

        if (!fileObj || !fileObj.filepath) {
          throw new Error('Invalid file input');
        }

        const result = await cloudinary.uploader.upload(fileObj.filepath);
        resolve(new Response(JSON.stringify({ url: result.secure_url }), { status: 200 }));
      } catch (error) {
        reject(new Response(JSON.stringify({ error: 'Upload failed' }), { status: 500 }));
      }
    });
  });
}
