import type { ISDK, SDKCategory } from '../types/sdk.types';
import { env } from '@/constant';

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

/**
 * Get SDK list from environment variables or fallback to constant
 * Environment variable should be a JSON string array of ISDK objects
 * Example: VITE_SDK_LIST='[{"id":"react-sdk","name":"React SDK",...}]'
 */
export const getSDKListFromEnv = (): ISDK[] => {
  if (!env.SDK_LIST) {
    return SDK_LIST;
  }

  try {
    const parsed = JSON.parse(env.SDK_LIST) as ISDK[];
    // Validate that it's an array
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    return SDK_LIST;
  } catch (error) {
    console.error('Failed to parse VITE_SDK_LIST from environment variables:', error);
    return SDK_LIST;
  }
};

export const SDK_CATEGORIES: { value: SDKCategory; label: string }[] = [
  { value: 'web', label: 'Web SDKs' },
  { value: 'server', label: 'Server-side SDKs' },
  { value: 'mobile', label: 'Mobile SDKs' },
  { value: 'community', label: 'Community SDKs' },
];
