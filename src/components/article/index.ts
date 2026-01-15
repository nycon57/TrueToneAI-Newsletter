// Simple article reading modal
export { SimpleArticleModal } from './SimpleArticleModal';

// Morphing card components (for future use)
export { MorphingArticleCard } from './MorphingArticleCard';
export { ArticleStickyFooter } from './ArticleStickyFooter';
export { ArticleContentView } from './ArticleContentView';
export { VideoContentView } from './VideoContentView';
export { EmailContentView } from './EmailContentView';
export { SocialContentView } from './SocialContentView';

// Editable content components
export { EditableContentSection } from './EditableContentSection';
export { EditableKeyInsights } from './EditableKeyInsights';

// ArticleCard and sub-components
export { ArticleCard } from './ArticleCard';
export { ArticleCardHeader } from './ArticleCardHeader';
export { ContentToolsGrid } from './ContentToolsGrid';
export { KeyInsightsSection } from './KeyInsightsSection';
export { VideoScriptSection } from './VideoScriptSection';
export { EmailTemplateSection } from './EmailTemplateSection';
export { SocialContentSection } from './SocialContentSection';
export type { Article as ArticleType, GenerationStats, ContentSectionProps } from './types';
export type { ContentSection } from './ContentToolsGrid';

// Legacy modal components (kept for compatibility)
export { ArticleModal } from './ArticleModal';
export { ArticleModalHeader } from './ArticleModalHeader';
export { ArticleModalContent } from './ArticleModalContent';
export { ArticleModalSidebar } from './ArticleModalSidebar';
export { PersonalizationActionCard } from './PersonalizationActionCard';

export type { ArticleModalProps } from './ArticleModal';
export type { ArticleModalHeaderProps } from './ArticleModalHeader';
export type { ArticleModalContentProps } from './ArticleModalContent';
export type { ArticleModalSidebarProps } from './ArticleModalSidebar';
export type { Article } from '@/lib/context/ArticleModalContext';
export type { PersonalizationActionCardProps } from './PersonalizationActionCard';
export type { EditableContentSectionProps } from './EditableContentSection';
export type { EditableKeyInsightsProps } from './EditableKeyInsights';
