export type SDKCategory = 'web' | 'server' | 'mobile' | 'community';

export interface ISDK {
  id: string;
  name: string;
  category: SDKCategory;
  version?: string;
  description: string;
  documentationUrl: string;
  downloadUrl: string;
  githubUrl?: string;
  language?: string;
  platform?: string;
  icon?: string;
}
