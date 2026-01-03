import { NextRequest, NextResponse } from 'next/server';
import { db } from '../../../../db';
import { poems } from '../../../../db/schema';
import { put } from '@vercel/blob';
import { auth } from '@clerk/nextjs/server';

export async function POST(req: NextRequest) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { title, author, content, style, image } = await req.json();

        let imageUrl = image;
        // Upload image to Blob if it's base64 data
        if (image && image.startsWith('data:image')) {
            const filename = `poem-${Date.now()}.png`;
            // Convert base64 to buffer
            const base64Data = image.split(',')[1];
            const buffer = Buffer.from(base64Data, 'base64');

            const blob = await put(filename, buffer, {
                access: 'public',
                contentType: 'image/png'
            });
            imageUrl = blob.url;
        }

        // Save to DB
        const result = await db.insert(poems).values({
            userId,
            title,
            author,
            content: JSON.stringify(content), // Store as JSON string
            style,
            imageUrl
        }).returning();

        return NextResponse.json({ success: true, poem: result[0] });

    } catch (error) {
        console.error('Save error:', error);
        return NextResponse.json({ success: false, error: 'Failed to save' }, { status: 500 });
    }
}
