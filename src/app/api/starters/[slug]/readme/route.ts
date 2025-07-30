import { NextResponse } from 'next/server';
import { getRepoReadme } from '@/lib/github';

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;

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

    // Return the README data with appropriate caching headers
    return NextResponse.json(readmeData, {
      headers: {
        'Cache-Control': 'public, s-maxage=600, stale-while-revalidate=1200', // Cache for 10 minutes
      },
    });
  } catch (error) {
    console.error(`Error in /api/starters/${params.slug}/readme:`, error);

    return NextResponse.json(
      {
        error: 'Failed to fetch README content',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// Export runtime configuration
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic'; // Ensure fresh data on each request