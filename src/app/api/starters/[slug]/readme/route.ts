import { NextResponse } from 'next/server';
import { getRepoReadme } from '@/lib/github';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    if (!slug) {
      return NextResponse.json(
        { error: 'Repository name is required' },
        { status: 400 }
      );
    }

    console.log(`Fetching README for repository: ${slug}`);

    // Fetch README content from GitHub
    const readmeData = await getRepoReadme(slug);

    if (!readmeData) {
      return NextResponse.json(
        { error: 'README not found for this repository' },
        { status: 404 }
      );
    }

    console.log(`Successfully fetched README for ${slug}`);

    // Return the README data with 24-hour caching
    return NextResponse.json(readmeData, {
      headers: {
        'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=172800', // Cache for 24 hours, stale for 48 hours
      },
    });
  } catch (error) {
    console.error(`Error in /api/starters/[slug]/readme:`, error);

    return NextResponse.json(
      {
        error: 'Failed to fetch README content',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// Export runtime configuration with ISR
export const runtime = 'nodejs';
export const revalidate = 86400; // Revalidate every 24 hours (86400 seconds)