import { NextRequest, NextResponse } from 'next/server';
import { db } from '../../../../db';
import { poems } from '../../../../db/schema';
import { auth } from '@clerk/nextjs/server';
import { eq, and } from 'drizzle-orm';

export async function DELETE(req: NextRequest) {
    try {
        const { userId } = await auth();
        // Check auth but proceed even if null (for anonymous delete)


        const { id } = await req.json();

        // Delete if user owns it OR if it is an anonymous poem (User is responsible for managing local reference)
        let condition;
        if (userId) {
            condition = and(eq(poems.id, id), eq(poems.userId, userId));
        } else {
            // If not logged in, can only delete anonymous poems
            // Ideally we should check if the user "owns" it via some token, but for "Low Security" app:
            condition = and(eq(poems.id, id), eq(poems.userId, 'anonymous'));
        }

        const result = await db.delete(poems)
            .where(condition)
            .returning();

        if (result.length === 0) {
            return NextResponse.json({ error: 'Not found or unauthorized' }, { status: 404 });
        }

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error('Delete error:', error);
        return NextResponse.json({ success: false, error: 'Failed to delete' }, { status: 500 });
    }
}
