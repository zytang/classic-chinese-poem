import { NextRequest, NextResponse } from 'next/server';
import { db } from '../../../../db';
import { poems } from '../../../../db/schema';
import { auth } from '@clerk/nextjs/server';
import { eq, desc } from 'drizzle-orm';

export async function GET(req: NextRequest) {
    try {
        const { userId } = await auth();
        const searchParams = req.nextUrl.searchParams;
        const view = searchParams.get('view');

        let data;

        if (view === 'community') {
            // Fetch all public poems
            data = await db.select()
                .from(poems)
                .where(eq(poems.isPublic, true))
                .orderBy(desc(poems.createdAt))
                .limit(50); // Limit to 50 for now
        } else {
            // Default: Fetch my works
            if (!userId) {
                return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
            }
            data = await db.select()
                .from(poems)
                .where(eq(poems.userId, userId))
                .orderBy(desc(poems.createdAt));
        }

        // Parse content back to array
        const formattedPoems = data.map(p => ({
            ...p,
            content: Array.isArray(p.content) ? p.content : JSON.parse(p.content as string)
        }));

        return NextResponse.json({ success: true, poems: formattedPoems });

    } catch (error) {
        console.error('List error:', error);
        return NextResponse.json({ success: false, error: 'Failed to fetch poems' }, { status: 500 });
    }
}
