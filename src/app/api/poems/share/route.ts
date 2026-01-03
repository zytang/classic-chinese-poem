import { NextRequest, NextResponse } from 'next/server';
import { db } from '../../../../db';
import { poems } from '../../../../db/schema';
import { auth } from '@clerk/nextjs/server';
import { eq, and } from 'drizzle-orm';

export async function PUT(req: NextRequest) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id, isPublic } = await req.json();

        // Update only if it belongs to the user
        const result = await db.update(poems)
            .set({ isPublic })
            .where(and(eq(poems.id, id), eq(poems.userId, userId)))
            .returning();

        if (result.length === 0) {
            return NextResponse.json({ error: 'Poem not found or unauthorized' }, { status: 404 });
        }

        return NextResponse.json({ success: true, poem: result[0] });

    } catch (error) {
        console.error('Share error:', error);
        return NextResponse.json({ success: false, error: 'Failed to update visibility' }, { status: 500 });
    }
}
