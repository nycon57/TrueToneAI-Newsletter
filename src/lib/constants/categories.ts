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
    id: 'Mortgage',
    label: 'Mortgage',
    description: 'Loan products and mortgage financing',
    icon: Home,
    tags: [
      { id: 'Purchase', label: 'Purchase', description: 'Home buying and purchase loans' },
      { id: 'Refinance', label: 'Refinance', description: 'Rate and term refinancing' },
      { id: 'FHA', label: 'FHA', description: 'Federal Housing Administration loans' },
      { id: 'VA', label: 'VA', description: 'Veterans Affairs loans' },
      { id: 'Conventional', label: 'Conventional', description: 'Traditional mortgage loans' },
      { id: 'Jumbo', label: 'Jumbo', description: 'High-value property financing' },
      { id: 'USDA', label: 'USDA', description: 'Rural development loans' },
      { id: 'First Time Buyer', label: 'First-Time Buyer', description: 'Programs for new homebuyers' },
    ]
  },
  {
    id: 'Real Estate',
    label: 'Real Estate',
    description: 'Property transactions and market insights',
    icon: Building2,
    tags: [
      { id: 'Buying', label: 'Buying', description: 'Home buying process and tips' },
      { id: 'Selling', label: 'Selling', description: 'Property selling strategies' },
      { id: 'Listings', label: 'Listings', description: 'Property listings and showings' },
      { id: 'Staging', label: 'Staging', description: 'Home staging and presentation' },
      { id: 'Investment Property', label: 'Investment Property', description: 'Rental and investment real estate' },
      { id: 'Market Analysis', label: 'Market Analysis', description: 'Real estate market trends' },
      { id: 'Commercial', label: 'Commercial', description: 'Commercial real estate' },
      { id: 'Appraisal', label: 'Appraisal', description: 'Property valuation' },
    ]
  },
  {
    id: 'Personal Finance',
    label: 'Personal Finance',
    description: 'Financial planning and money management',
    icon: DollarSign,
    tags: [
      { id: 'Budgeting', label: 'Budgeting', description: 'Budget planning and management' },
      { id: 'Savings', label: 'Savings', description: 'Savings strategies and tips' },
      { id: 'Credit Score', label: 'Credit Score', description: 'Credit building and management' },
      { id: 'Debt Management', label: 'Debt Management', description: 'Debt payoff strategies' },
      { id: 'Retirement', label: 'Retirement', description: 'Retirement planning' },
      { id: 'Taxes', label: 'Taxes', description: 'Tax planning and deductions' },
      { id: 'Insurance', label: 'Insurance', description: 'Insurance products and coverage' },
      { id: 'Investing', label: 'Investing', description: 'Investment strategies' },
    ]
  },
  {
    id: 'Marketing',
    label: 'Marketing',
    description: 'Marketing strategies and client outreach',
    icon: Megaphone,
    tags: [
      { id: 'Social Media', label: 'Social Media', description: 'Social media marketing' },
      { id: 'Email Marketing', label: 'Email Marketing', description: 'Email campaigns and newsletters' },
      { id: 'Content Creation', label: 'Content Creation', description: 'Content strategy and creation' },
      { id: 'Branding', label: 'Branding', description: 'Personal and business branding' },
      { id: 'Video Marketing', label: 'Video Marketing', description: 'Video content and YouTube' },
      { id: 'SEO', label: 'SEO', description: 'Search engine optimization' },
      { id: 'Paid Advertising', label: 'Paid Advertising', description: 'PPC and paid ad campaigns' },
      { id: 'Networking', label: 'Networking', description: 'Professional networking' },
    ]
  },
  {
    id: 'Technology',
    label: 'Technology',
    description: 'Tech tools and digital solutions',
    icon: Cpu,
    tags: [
      { id: 'CRM', label: 'CRM', description: 'Customer relationship management' },
      { id: 'Automation', label: 'Automation', description: 'Workflow automation tools' },
      { id: 'AI Tools', label: 'AI Tools', description: 'Artificial intelligence applications' },
      { id: 'Mobile Apps', label: 'Mobile Apps', description: 'Mobile applications for business' },
      { id: 'Cybersecurity', label: 'Cybersecurity', description: 'Data security and privacy' },
      { id: 'Productivity', label: 'Productivity', description: 'Productivity tools and software' },
      { id: 'Virtual Tours', label: 'Virtual Tours', description: '3D tours and virtual showings' },
      { id: 'Data Analytics', label: 'Data Analytics', description: 'Business intelligence and analytics' },
    ]
  },
  {
    id: 'Leadership',
    label: 'Leadership',
    description: 'Professional development and team management',
    icon: Trophy,
    tags: [
      { id: 'Team Building', label: 'Team Building', description: 'Building and managing teams' },
      { id: 'Coaching', label: 'Coaching', description: 'Coaching and mentoring' },
      { id: 'Communication', label: 'Communication', description: 'Effective communication skills' },
      { id: 'Time Management', label: 'Time Management', description: 'Productivity and time management' },
      { id: 'Goal Setting', label: 'Goal Setting', description: 'Setting and achieving goals' },
      { id: 'Negotiation', label: 'Negotiation', description: 'Negotiation strategies' },
      { id: 'Work Life Balance', label: 'Work-Life Balance', description: 'Balancing work and personal life' },
      { id: 'Professional Growth', label: 'Professional Growth', description: 'Career development' },
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
