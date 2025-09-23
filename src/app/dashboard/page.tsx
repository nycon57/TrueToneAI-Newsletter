import { PersonalizedContent } from '@/components/personalization/PersonalizedContent';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sparkles, TrendingUp, FileText, MessageSquare } from 'lucide-react';

// Sample newsletter content for demo
const SAMPLE_ARTICLES = [
  {
    id: 'article-1',
    title: 'Fed Cuts Rates: What This Means for Your Clients',
    contentType: 'email_template',
    content: {
      subject: "🏠 Fed Rate Cut - Great News for Your Home Plans!",
      body: "The Federal Reserve just announced a 0.25% rate cut. Here's why this matters: Lower monthly mortgage payments, you may qualify for a higher loan amount, and refi opportunities if you bought in the past 18 months. Let's schedule a quick call to review your numbers and see how you can take advantage."
    }
  },
  {
    id: 'article-2',
    title: 'New FHA Loan Limits Give First-Time Buyers a Boost',
    contentType: 'social_content',
    content: {
      platform: 'linkedin',
      text: "FHA just raised loan limits for 2024! That means more home for your budget—especially if you're a first-time buyer. The new FHA limits for 2024 expand access for first-time buyers and moderate-income families. Reach out to explore your options."
    }
  },
  {
    id: 'article-3',
    title: 'Mortgage Credit Scores Just Got Easier with FICO 10T',
    contentType: 'video_script',
    content: "Good news for borrowers! A new credit model—FICO 10T—is rolling out. What makes it different? It looks at how you manage credit over time, not just a snapshot in time. This could mean higher scores and better loan options, especially for those with thin or recovering credit profiles. Let's take a look at your score strategy and see if this new model works in your favor."
  }
];

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            TrueTone Newsletter Dashboard
          </h1>
          <p className="text-gray-600">
            Personalize newsletter content with your unique voice and style.
          </p>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="flex items-center p-4">
              <Sparkles className="h-8 w-8 text-blue-600 mr-3" />
              <div>
                <p className="text-2xl font-semibold text-gray-900">12</p>
                <p className="text-sm text-gray-600">Personalizations</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center p-4">
              <TrendingUp className="h-8 w-8 text-green-600 mr-3" />
              <div>
                <p className="text-2xl font-semibold text-gray-900">85%</p>
                <p className="text-sm text-gray-600">TrueTone Accuracy</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center p-4">
              <FileText className="h-8 w-8 text-purple-600 mr-3" />
              <div>
                <p className="text-2xl font-semibold text-gray-900">3</p>
                <p className="text-sm text-gray-600">Content Types</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center p-4">
              <MessageSquare className="h-8 w-8 text-orange-600 mr-3" />
              <div>
                <p className="text-2xl font-semibold text-gray-900">5</p>
                <p className="text-sm text-gray-600">Published</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Today's Newsletter */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Today's Newsletter Content</CardTitle>
            <CardDescription>
              Transform these articles with your personalized TrueTone voice.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6">
              {SAMPLE_ARTICLES.map((article) => (
                <div key={article.id} className="border-l-4 border-blue-500 pl-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-gray-900">{article.title}</h3>
                    <Badge variant="outline">{article.contentType}</Badge>
                  </div>

                  <PersonalizedContent
                    article={article}
                    postId="demo-post"
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* TrueTone Profile Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Sparkles className="h-5 w-5 mr-2 text-blue-600" />
              Your TrueTone Profile
            </CardTitle>
            <CardDescription>
              Your personalized communication style settings.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Tone of Voice</span>
                  <Badge variant="outline">Professional</Badge>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Formality</span>
                  <Badge variant="outline">Balanced</Badge>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Detail Level</span>
                  <Badge variant="outline">Comprehensive</Badge>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Vocabulary</span>
                  <Badge variant="outline">Professional</Badge>
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Engagement Style</span>
                  <Badge variant="outline">Consultative</Badge>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Content Length</span>
                  <Badge variant="outline">Thorough</Badge>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Humor</span>
                  <Badge variant="outline">Witty</Badge>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Emotional Expression</span>
                  <Badge variant="outline">Expressive</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}