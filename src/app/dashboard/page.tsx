import { getApiUser } from '@/lib/api/auth';
import { ArticleFeed } from '@/components/articles/ArticleFeed';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sparkles, TrendingUp, FileText, MessageSquare, Crown } from 'lucide-react';

export default async function DashboardPage() {
  // Get user authentication status
  let user = null;
  let articles = [];
  let monthlyGenerationsUsed = 0;
  let monthlyGenerationLimit = 0;

  try {
    user = await getApiUser();
  } catch (error) {
    console.log('User not authenticated or error fetching data');
  }

  const isPaid = user && user.subscription_tier !== 'free';

  // Fetch articles - this will call the same API the client uses
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/articles`);
    if (response.ok) {
      const data = await response.json();
      articles = data.articles || [];
      monthlyGenerationsUsed = data.monthly_generations_used || 0;
      monthlyGenerationLimit = data.monthly_generation_limit || 0;
    }
  } catch (error) {
    console.log('Error pre-fetching articles:', error);
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {isPaid ? 'Your TrueTone Dashboard' : 'TrueTone Newsletter'}
              </h1>
              <p className="text-gray-600">
                {isPaid
                  ? 'AI-personalized content matching your unique voice and style'
                  : 'Professional mortgage and real estate content for your business'
                }
              </p>
            </div>

            {user && (
              <div className="text-right">
                <div className="flex items-center gap-2">
                  <Badge
                    variant={isPaid ? 'default' : 'secondary'}
                    className={isPaid ? 'bg-blue-600' : ''}
                  >
                    {isPaid ? (
                      <>
                        <Crown className="h-3 w-3 mr-1" />
                        {user.subscription_tier?.toUpperCase()}
                      </>
                    ) : (
                      'FREE'
                    )}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  Welcome back, {user.firstName || user.name || 'there'}!
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Article Feed - this includes stats for paid users */}
        <ArticleFeed
          initialArticles={articles}
          userTier={user?.subscription_tier || 'free'}
          userId={user?.id}
          monthlyGenerationsUsed={monthlyGenerationsUsed}
          monthlyGenerationLimit={monthlyGenerationLimit}
        />

        {/* TrueTone Profile Summary for paid users */}
        {isPaid && user && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Sparkles className="h-5 w-5 mr-2 text-blue-600" />
                Your TrueTone Profile
              </CardTitle>
              <CardDescription>
                Your personalized communication style settings from voice analysis.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Tone of Voice</span>
                    <Badge variant="outline">{user.tone_of_voice || 'Not Set'}</Badge>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Formality</span>
                    <Badge variant="outline">{user.formality || 'Not Set'}</Badge>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Detail Level</span>
                    <Badge variant="outline">{user.detail_orientation || 'Not Set'}</Badge>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Vocabulary</span>
                    <Badge variant="outline">{user.vocabulary || 'Not Set'}</Badge>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Engagement Style</span>
                    <Badge variant="outline">{user.engagement_style || 'Not Set'}</Badge>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Content Length</span>
                    <Badge variant="outline">{user.content_length || 'Not Set'}</Badge>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Humor</span>
                    <Badge variant="outline">{user.humor || 'Not Set'}</Badge>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Emotional Expression</span>
                    <Badge variant="outline">{user.emotional_expression || 'Not Set'}</Badge>
                  </div>
                </div>
              </div>

              {(!user.tone_of_voice || !user.has_completed_onboarding) && (
                <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                  <p className="text-sm text-amber-800">
                    <strong>Complete your TrueTone setup:</strong> Your voice profile seems incomplete.
                    Complete the voice onboarding to unlock full personalization features.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}