'use client';

import React from 'react';
import {
  Search,
  Bot,
  Sparkles,
  Megaphone,
  Code,
  SlidersHorizontal,
  User,
  Palette,
  Smartphone,
  PenTool,
  Target,
  Briefcase,
  Gamepad2,
  GraduationCap,
  Heart,
  ShoppingBag,
  Rocket,
  Users,
  Mic,
  Coins,
  Building2,
  ShieldCheck,
  Plane,
  Newspaper,
  Globe,
  Crown,
  Home,
  Zap,
  Flame,
} from 'lucide-react';

interface CategoryIconProps {
  slug: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function CategoryIcon({ slug, className = '', size = 'md' }: CategoryIconProps) {
  const iconProps = {
    sm: { container: 'w-7 h-7', icon: 'w-3.5 h-3.5' },
    md: { container: 'w-9 h-9', icon: 'w-4.5 h-4.5' },
    lg: { container: 'w-11 h-11', icon: 'w-5 h-5' },
  }[size];

  const renderGlyph = () => {
    switch (slug) {
      case 'all':
        return <Flame className={`${iconProps.icon} stroke-[1.75]`} />;
      case 'seo-ai-visibility':
        return <Search className={`${iconProps.icon} stroke-[1.75]`} />;
      case 'ai-agents-infrastructure':
        return <Bot className={`${iconProps.icon} stroke-[1.75]`} />;
      case 'ai-media-generation':
        return <Sparkles className={`${iconProps.icon} stroke-[1.75]`} />;
      case 'marketing-advertising':
        return <Megaphone className={`${iconProps.icon} stroke-[1.75]`} />;
      case 'developer-tools':
        return <Code className={`${iconProps.icon} stroke-[1.75]`} />;
      case 'productivity-personal-tools':
        return <SlidersHorizontal className={`${iconProps.icon} stroke-[1.75]`} />;
      case 'people-profiles':
        return <User className={`${iconProps.icon} stroke-[1.75]`} />;
      case 'design-creative':
        return <Palette className={`${iconProps.icon} stroke-[1.75]`} />;
      case 'social-media-creator-tools':
        return <Smartphone className={`${iconProps.icon} stroke-[1.75]`} />;
      case 'writing-content':
        return <PenTool className={`${iconProps.icon} stroke-[1.75]`} />;
      case 'sales-lead-generation':
        return <Target className={`${iconProps.icon} stroke-[1.75]`} />;
      case 'business-finance-legal':
        return <Briefcase className={`${iconProps.icon} stroke-[1.75]`} />;
      case 'games-entertainment':
        return <Gamepad2 className={`${iconProps.icon} stroke-[1.75]`} />;
      case 'education-learning':
        return <GraduationCap className={`${iconProps.icon} stroke-[1.75]`} />;
      case 'health-fitness-wellness':
        return <Heart className={`${iconProps.icon} stroke-[1.75]`} />;
      case 'ecommerce-retail':
        return <ShoppingBag className={`${iconProps.icon} stroke-[1.75]`} />;
      case 'directories-launch-discovery':
        return <Rocket className={`${iconProps.icon} stroke-[1.75]`} />;
      case 'hiring-jobs-careers':
        return <Users className={`${iconProps.icon} stroke-[1.75]`} />;
      case 'audio-voice-podcasting':
        return <Mic className={`${iconProps.icon} stroke-[1.75]`} />;
      case 'crypto-web3-investing':
        return <Coins className={`${iconProps.icon} stroke-[1.75]`} />;
      case 'agencies-studios-services':
        return <Building2 className={`${iconProps.icon} stroke-[1.75]`} />;
      case 'security-privacy-compliance':
        return <ShieldCheck className={`${iconProps.icon} stroke-[1.75]`} />;
      case 'travel-local-lifestyle':
        return <Plane className={`${iconProps.icon} stroke-[1.75]`} />;
      case 'media-news':
        return <Newspaper className={`${iconProps.icon} stroke-[1.75]`} />;
      case 'domains-web-assets':
        return <Globe className={`${iconProps.icon} stroke-[1.75]`} />;
      case 'leaderboards-attention':
        return <Crown className={`${iconProps.icon} stroke-[1.75]`} />;
      case 'real-estate-property':
        return <Home className={`${iconProps.icon} stroke-[1.75]`} />;
      default:
        return <Zap className={`${iconProps.icon} stroke-[1.75]`} />;
    }
  };

  return (
    <div
      className={`${iconProps.container} rounded-full bg-[#ea6c52]/15 dark:bg-[#341b16] text-[#ea6c52] dark:text-[#ea6c52] flex items-center justify-center flex-shrink-0 transition-transform ${className}`}
    >
      {renderGlyph()}
    </div>
  );
}
