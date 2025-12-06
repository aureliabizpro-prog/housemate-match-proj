import { NextResponse } from 'next/server';
import { usersData, calculateMatchScore, obfuscateEmail } from '@/utils/matching';
import { User, MatchedUser } from '@/types/user';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get('email');
  const userId = searchParams.get('userId');

  // If a specific user is requested (e.g., for matching)
  if (email || userId) {
    const currentUser = usersData.find(u => u.email === email || u.id === userId);

    if (!currentUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const matches: MatchedUser[] = [];
    for (const candidate of usersData) {
      if (candidate.id === currentUser.id) continue;

      const matchScore = calculateMatchScore(currentUser, candidate);
      if (matchScore > 0) { // Only include matches with a score > 0
        matches.push({
          ...candidate,
          email: obfuscateEmail(candidate.email), // Obfuscate email for privacy
          matchScore,
        });
      }
    }

    // Sort by match score and take top 5
    matches.sort((a, b) => b.matchScore - a.matchScore);
    const top5Matches = matches.slice(0, 5);

    return NextResponse.json({
      currentUser: {
        ...currentUser,
        email: obfuscateEmail(currentUser.email), // Obfuscate current user's email too
      },
      top5Matches,
    });
  }

  // If no specific user is requested, return all users (obfuscated)
  const allUsersObfuscated = usersData.map(user => ({
    ...user,
    email: obfuscateEmail(user.email), // Obfuscate email for privacy
  }));

  return NextResponse.json(allUsersObfuscated);
}
