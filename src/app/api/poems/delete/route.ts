import { NextRequest, NextResponse } from 'next/server';
import { db } from '../../../../db';
import { poems } from '../../../../db/schema';
import { auth } from '@clerk/nextjs/server';
import { eq, and } from 'drizzle-orm';

export async function DELETE(req: NextRequest) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await req.json();

        // Delete only if it belongs to the user
        await db.delete(poems)
            .where(and(eq(poems.id, id), eq(poems.userId, userId)));

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error('Delete error:', error);
        return NextResponse.json({ success: false, error: 'Failed to delete' }, { status: 500 });
    }
}
