import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads', 'student_ids');

function ensureUploadDir() {
  if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true });
  }
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ success: false, error: 'No file provided' }, { status: 400 });
    }

    // 5MB limit
    const MAX_SIZE = 5 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      return NextResponse.json({ success: false, error: 'File size exceeds 5MB limit' }, { status: 400 });
    }

    // Allowed mime types
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg', 'application/pdf'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { success: false, error: 'Invalid file type. Allowed: PDF, JPG, PNG, WebP' },
        { status: 400 }
      );
    }

    ensureUploadDir();

    // Determine extension
    let ext = 'pdf';
    if (file.type === 'image/jpeg' || file.type === 'image/jpg') ext = 'jpg';
    else if (file.type === 'image/png') ext = 'png';
    else if (file.type === 'image/webp') ext = 'webp';

    const safeOriginalName = file.name.replace(/[^a-zA-Z0-9_.-]/g, '_');
    const randomSuffix = Math.random().toString(36).substring(2, 9);
    const savedFileName = `sid_${Date.now()}_${randomSuffix}.${ext}`;
    const destinationPath = path.join(UPLOAD_DIR, savedFileName);

    const buffer = Buffer.from(await file.arrayBuffer());
    fs.writeFileSync(destinationPath, buffer);

    const fileUrl = `/uploads/student_ids/${savedFileName}`;
    const fileSizeFormatted = `${(file.size / 1024).toFixed(1)} KB`;

    return NextResponse.json({
      success: true,
      fileUrl,
      fileName: file.name,
      fileSize: fileSizeFormatted,
      mimeType: file.type,
      uploadedAt: new Date().toISOString()
    });
  } catch (err: any) {
    console.error('[API-UPLOAD-STUDENT-ID-ERROR]', err);
    return NextResponse.json(
      { success: false, error: err.message || 'Failed to upload student verification file' },
      { status: 500 }
    );
  }
}
