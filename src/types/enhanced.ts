/**
 * Enhanced type definitions for multi-channel intensity tracking
 * and dashboard navigation system
 */

import { ReactNode } from "react";
import { Box, Entry } from "../types";

/**
 * Social media channel types
 */
export type SocialChannel = 
  | 'twitter' 
  | 'instagram' 
  | 'tiktok' 
  | 'facebook' 
  | 'linkedin' 
  | 'substack';

/**
 * Document metadata for multi-channel tracking
 */
export interface DocumentMetadata {
  name: string;
  path: string;
  channels: SocialChannel[];
  publishDate?: string;
  excerpt?: string;
}

/**
 * Enhanced metadata for multi-document dates
 */
export interface MultiDocumentMetadata {
  documentCount: number;
  channels: SocialChannel[];
  documents: DocumentMetadata[];
  totalReach?: number;
  intensity?: number;
}

/**
 * Enhanced Box interface with metadata support
 */
export interface EnhancedBox extends Box {
  metadata?: MultiDocumentMetadata;
}

/**
 * Multi-channel entry for intensity calculation
 */
export interface MultiChannelEntry extends Entry {
  channels?: SocialChannel[];
  documentCount?: number;
  publishedTo?: Record<SocialChannel, boolean>;
  metadata?: MultiDocumentMetadata;
}

/**
 * Channel weight configuration
 */
export interface ChannelWeights {
  twitter?: number;
  instagram?: number;
  tiktok?: number;
  facebook?: number;
  linkedin?: number;
  substack?: number;
}

/**
 * Multi-channel intensity configuration
 */
export interface MultiChannelIntensityConfig {
  mode?: 'simple' | 'multi-channel';
  channelWeights?: ChannelWeights;
  documentCountWeight?: number;
  channelDiversityBonus?: number;
  maxIntensity?: number;
  defaultIntensity?: number;
  scaleStart?: number;
  scaleEnd?: number;
  showOutOfRange?: boolean;
}

/**
 * Dashboard configuration
 */
export interface DashboardConfig {
  dashboardFolder?: string;
  templatePath?: string;
  showDocumentCount?: boolean;
  showChannelBadges?: boolean;
  enableAnalytics?: boolean;
  channels?: Record<string, {
    enabled: boolean;
    color: string;
    icon?: string;
    apiEndpoint?: string;
  }>;
  cacheTimeout?: number;
  maxDocumentsPerDashboard?: number;
}

/**
 * Click action types for navigation
 */
export type ClickAction = 'dashboard' | 'navigate' | 'create';

/**
 * Analytics metrics for content
 */
export interface ContentMetrics {
  documentPath: string;
  publishDate: string;
  channels: SocialChannel[];
  metrics: {
    impressions: number;
    engagement: number;
    clicks: number;
    shares: number;
  };
  trending: boolean;
}