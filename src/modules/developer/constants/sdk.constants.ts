import type { ISDK, SDKCategory } from '../types/sdk.types';

export const SDK_LIST: ISDK[] = [
  // Web SDKs
  {
    id: 'react-sdk',
    name: 'React SDK',
    category: 'web',
    version: '1.0.0',
    description: 'React components for PWC integration',
    documentationUrl: 'https://docs.pwc.com/react',
    downloadUrl: 'https://github.com/pwc/react-sdk/releases',
    githubUrl: 'https://github.com/pwc/react-sdk',
    language: 'TypeScript',
    platform: 'React',
  },
];

export const SDK_CATEGORIES: { value: SDKCategory; label: string }[] = [
  { value: 'web', label: 'Web SDKs' },
  { value: 'server', label: 'Server-side SDKs' },
  { value: 'mobile', label: 'Mobile SDKs' },
  { value: 'community', label: 'Community SDKs' },
];
