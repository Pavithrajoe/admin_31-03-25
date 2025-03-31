import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { promisify } from 'util';
import pool from '@/lib/db';

const uploadDir = path.join(process.cwd(), 'public/uploads');
const mkdir = promisify(fs.mkdir);

if (!fs.existsSync(uploadDir)) {
    await mkdir(uploadDir, { recursive: true });
}

export const config = {
    api: {
        bodyParser: false, // ✅ Disable Next.js body parsing
    },
};

export async function POST(req) {
    const { Formidable } = await import('formidable');

    const form = new Formidable({
        multiples: true,
        uploadDir: uploadDir,
        keepExtensions: true,
        maxFileSize: 10 * 1024 * 1024, // 10MB
    });

    try {
        const [fields, files] = await new Promise((resolve, reject) => {
            form.parse(req, (err, fields, files) => {
                if (err) {
                    console.error('❌ Formidable Error:', err);
                    return reject(err);
                }
                resolve([fields, files]);
            });
        });

        const content = fields.content?.[0] || null;
        const userId = fields.userId?.[0] || null;
        const image = files.image ? `/uploads/${files.image[0].newFilename}` : null;
        const gif = files.gif ? `/uploads/${files.gif[0].newFilename}` : null;

        if (!content || !userId) {
            return NextResponse.json(
                { error: 'Content and User ID are required' },
                { status: 400 }
            );
        }

        // ✅ Insert into database
        const query = `
            INSERT INTO latest_from_company (created_by, content, image, gif)
            VALUES ($1, $2, $3, $4)
            RETURNING *;
        `;
        const values = [userId, content, image, gif];
        const result = await pool.query(query, values);

        console.log('✅ Data inserted:', result.rows[0]);

        return NextResponse.json({ success: true, data: result.rows[0] }, { status: 201 });
    } catch (error) {
        console.error('❌ Database error:', error.message);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
