import {
  Home,
  TrendingUp,
  Shield,
  Scale,
  Building2,
  CreditCard,
  Users,
  Cpu,
  DollarSign,
  PiggyBank,
  LineChart,
  FileText,
  Megaphone,
  Mail,
  Video,
  Sparkles,
  Wrench,
  Lock,
  Target,
  MessageSquare,
  Trophy,
  BookOpen,
  type LucideIcon
} from 'lucide-react';

export interface Tag {
  id: string;
  label: string;
  description: string;
}

export interface Category {
  id: string;
  label: string;
  description: string;
  icon: LucideIcon;
  tags: Tag[];
}

export const CATEGORIES: Category[] = [
  {
    id: 'mortgage',
    label: 'Mortgage',
    description: 'Loan products and mortgage financing',
    icon: Home,
    tags: [
      { id: 'purchase', label: 'Purchase', description: 'Home buying and purchase loans' },
      { id: 'refinance', label: 'Refinance', description: 'Rate and term refinancing' },
      { id: 'fha', label: 'FHA', description: 'Federal Housing Administration loans' },
      { id: 'va', label: 'VA', description: 'Veterans Affairs loans' },
      { id: 'conventional', label: 'Conventional', description: 'Traditional mortgage loans' },
      { id: 'jumbo', label: 'Jumbo', description: 'High-value property financing' },
      { id: 'usda', label: 'USDA', description: 'Rural development loans' },
      { id: 'first_time_buyer', label: 'First-Time Buyer', description: 'Programs for new homebuyers' },
    ]
  },
  {
    id: 'real_estate',
    label: 'Real Estate',
    description: 'Property transactions and market insights',
    icon: Building2,
    tags: [
      { id: 'buying', label: 'Buying', description: 'Home buying process and tips' },
      { id: 'selling', label: 'Selling', description: 'Property selling strategies' },
      { id: 'listings', label: 'Listings', description: 'Property listings and showings' },
      { id: 'staging', label: 'Staging', description: 'Home staging and presentation' },
      { id: 'investment_property', label: 'Investment Property', description: 'Rental and investment real estate' },
      { id: 'market_analysis', label: 'Market Analysis', description: 'Real estate market trends' },
      { id: 'commercial', label: 'Commercial', description: 'Commercial real estate' },
      { id: 'appraisal', label: 'Appraisal', description: 'Property valuation' },
    ]
  },
  {
    id: 'personal_finance',
    label: 'Personal Finance',
    description: 'Financial planning and money management',
    icon: DollarSign,
    tags: [
      { id: 'budgeting', label: 'Budgeting', description: 'Budget planning and management' },
      { id: 'savings', label: 'Savings', description: 'Savings strategies and tips' },
      { id: 'credit_score', label: 'Credit Score', description: 'Credit building and management' },
      { id: 'debt_management', label: 'Debt Management', description: 'Debt payoff strategies' },
      { id: 'retirement', label: 'Retirement', description: 'Retirement planning' },
      { id: 'taxes', label: 'Taxes', description: 'Tax planning and deductions' },
      { id: 'insurance', label: 'Insurance', description: 'Insurance products and coverage' },
      { id: 'investing', label: 'Investing', description: 'Investment strategies' },
    ]
  },
  {
    id: 'marketing',
    label: 'Marketing',
    description: 'Marketing strategies and client outreach',
    icon: Megaphone,
    tags: [
      { id: 'social_media', label: 'Social Media', description: 'Social media marketing' },
      { id: 'email_marketing', label: 'Email Marketing', description: 'Email campaigns and newsletters' },
      { id: 'content_creation', label: 'Content Creation', description: 'Content strategy and creation' },
      { id: 'branding', label: 'Branding', description: 'Personal and business branding' },
      { id: 'video_marketing', label: 'Video Marketing', description: 'Video content and YouTube' },
      { id: 'seo', label: 'SEO', description: 'Search engine optimization' },
      { id: 'paid_advertising', label: 'Paid Advertising', description: 'PPC and paid ad campaigns' },
      { id: 'networking', label: 'Networking', description: 'Professional networking' },
    ]
  },
  {
    id: 'technology',
    label: 'Technology',
    description: 'Tech tools and digital solutions',
    icon: Cpu,
    tags: [
      { id: 'crm', label: 'CRM', description: 'Customer relationship management' },
      { id: 'automation', label: 'Automation', description: 'Workflow automation tools' },
      { id: 'ai_tools', label: 'AI Tools', description: 'Artificial intelligence applications' },
      { id: 'mobile_apps', label: 'Mobile Apps', description: 'Mobile applications for business' },
      { id: 'cybersecurity', label: 'Cybersecurity', description: 'Data security and privacy' },
      { id: 'productivity', label: 'Productivity', description: 'Productivity tools and software' },
      { id: 'virtual_tours', label: 'Virtual Tours', description: '3D tours and virtual showings' },
      { id: 'data_analytics', label: 'Data Analytics', description: 'Business intelligence and analytics' },
    ]
  },
  {
    id: 'leadership',
    label: 'Leadership',
    description: 'Professional development and team management',
    icon: Trophy,
    tags: [
      { id: 'team_building', label: 'Team Building', description: 'Building and managing teams' },
      { id: 'coaching', label: 'Coaching', description: 'Coaching and mentoring' },
      { id: 'communication', label: 'Communication', description: 'Effective communication skills' },
      { id: 'time_management', label: 'Time Management', description: 'Productivity and time management' },
      { id: 'goal_setting', label: 'Goal Setting', description: 'Setting and achieving goals' },
      { id: 'negotiation', label: 'Negotiation', description: 'Negotiation strategies' },
      { id: 'work_life_balance', label: 'Work-Life Balance', description: 'Balancing work and personal life' },
      { id: 'professional_growth', label: 'Professional Growth', description: 'Career development' },
    ]
  },
];

// Helper functions
export const getCategoryById = (id: string): Category | undefined => {
  return CATEGORIES.find(cat => cat.id === id);
};

export const getTagById = (categoryId: string, tagId: string): Tag | undefined => {
  const category = getCategoryById(categoryId);
  return category?.tags.find(tag => tag.id === tagId);
};

export const getAllTags = (): Tag[] => {
  return CATEGORIES.flatMap(category => category.tags);
};

export const getCategoriesCount = (): number => CATEGORIES.length;

export const getTotalTagsCount = (): number => {
  return CATEGORIES.reduce((total, category) => total + category.tags.length, 0);
};

// Export for easy access
export const CATEGORY_IDS = CATEGORIES.map(c => c.id);
export const TAG_IDS = getAllTags().map(t => t.id);
