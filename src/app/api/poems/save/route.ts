import { NextRequest, NextResponse } from 'next/server';
import { db } from '../../../../db';
import { poems } from '../../../../db/schema';
import { put } from '@vercel/blob';
import { auth } from '@clerk/nextjs/server';

export async function POST(req: NextRequest) {
    try {
        let { userId } = await auth();
        // Allow anonymous save if not signed in (for Community Sharing)
        if (!userId) {
            userId = 'anonymous';
        }

        const { title, author, content, style, image, isPublic } = await req.json();

        let imageUrl = image;
        // Upload image to Blob if it's base64 data
        if (image && image.startsWith('data:image')) {
            try {
                const filename = `poem-${Date.now()}.png`;
                // Convert base64 to buffer
                const base64Data = image.split(',')[1];
                const buffer = Buffer.from(base64Data, 'base64');

                const blob = await put(filename, buffer, {
                    access: 'public',
                    contentType: 'image/png'
                });
                imageUrl = blob.url;
            } catch (blobError) {
                console.error("Blob upload failed (likely missing token):", blobError);
                // Fallback: Proceed without image URL, or use the base64 if really needed (but dangerous for DB size)
                // For now, let's just set it to null so the poem still saves.
                imageUrl = null;
            }
        }

        // Save to DB
        const result = await db.insert(poems).values({
            userId,
            title,
            author,
            content: JSON.stringify(content), // Store as JSON string
            style,
            imageUrl,
            isPublic: isPublic || false
        }).returning();

        return NextResponse.json({ success: true, poem: result[0] });

    } catch (error) {
        console.error('Save error:', error);
        return NextResponse.json({ success: false, error: 'Failed to save' }, { status: 500 });
    }
}
