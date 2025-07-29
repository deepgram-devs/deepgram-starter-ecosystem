import { NextResponse } from 'next/server';
import { getRepoData, transformToProcessedStarters } from '@/lib/github';
import type { ProcessedStarter } from '@/types';

export async function GET() {
  try {
    console.log('Fetching starter repositories...');

    // Fetch repository data from GitHub
    const repos = await getRepoData();

    if (repos.length === 0) {
      console.warn('No repositories found or API error occurred');
      return NextResponse.json(
        { error: 'No starter repositories found' },
        { status: 404 }
      );
    }

    // Transform to processed starters
    const starters: ProcessedStarter[] = transformToProcessedStarters(repos);

    console.log(`Successfully processed ${starters.length} starters`);

    // Return the data with appropriate caching headers
    return NextResponse.json(starters, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600', // Cache for 5 minutes
      },
    });
  } catch (error) {
    console.error('Error in /api/starters:', error);

    return NextResponse.json(
      {
        error: 'Failed to fetch starter repositories',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// Export runtime configuration
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic'; // Ensure fresh data on each request