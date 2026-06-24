import { useFeatureFlags } from '@config/featureFlags';

export const useFeatureFlag = (flag: keyof ReturnType<typeof useFeatureFlags>): boolean => {
  const flags = useFeatureFlags();
  return flags[flag];
};
