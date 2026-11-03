import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads', 'forms');

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

    // 25MB limit
    const MAX_SIZE = 25 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      return NextResponse.json({ success: false, error: 'File size exceeds 25MB limit' }, { status: 400 });
    }

    // Allowed mime types (PDF, images, docs)
    const allowedTypes = [
      'application/pdf',
      'image/jpeg',
      'image/png',
      'image/webp',
      'image/jpg',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];

    if (!allowedTypes.includes(file.type) && !file.name.toLowerCase().endsWith('.pdf')) {
      return NextResponse.json(
        { success: false, error: 'Invalid file type. Allowed: PDF, JPG, PNG, WEBP, DOCX' },
        { status: 400 }
      );
    }

    ensureUploadDir();

    // Determine extension
    let ext = 'pdf';
    const nameLower = file.name.toLowerCase();
    if (nameLower.endsWith('.pdf') || file.type === 'application/pdf') ext = 'pdf';
    else if (file.type === 'image/jpeg' || file.type === 'image/jpg' || nameLower.endsWith('.jpg') || nameLower.endsWith('.jpeg')) ext = 'jpg';
    else if (file.type === 'image/png' || nameLower.endsWith('.png')) ext = 'png';
    else if (file.type === 'image/webp' || nameLower.endsWith('.webp')) ext = 'webp';
    else if (nameLower.endsWith('.docx')) ext = 'docx';
    else if (nameLower.endsWith('.doc')) ext = 'doc';

    const safeOriginalName = file.name.replace(/[^a-zA-Z0-9_.-]/g, '_');
    const randomSuffix = Math.random().toString(36).substring(2, 9);
    const savedFileName = `doc_${Date.now()}_${randomSuffix}.${ext}`;
    const destinationPath = path.join(UPLOAD_DIR, savedFileName);

    const buffer = Buffer.from(await file.arrayBuffer());
    fs.writeFileSync(destinationPath, buffer);

    const fileUrl = `https://zenvitra.xyz/uploads/forms/${savedFileName}`;
    const relativeUrl = `/uploads/forms/${savedFileName}`;
    const fileSizeFormatted = file.size > 1024 * 1024
      ? `${(file.size / (1024 * 1024)).toFixed(2)} MB`
      : `${(file.size / 1024).toFixed(1)} KB`;

    return NextResponse.json({
      success: true,
      url: fileUrl,
      relativeUrl,
      fileName: file.name,
      savedFileName,
      sizeFormatted: fileSizeFormatted,
      fileSize: file.size,
    });
  } catch (err: any) {
    console.error('[FORMS-UPLOAD-ERROR]', err);
    return NextResponse.json(
      { success: false, error: err?.message || 'File upload failed' },
      { status: 500 }
    );
  }
}
