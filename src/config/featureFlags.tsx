import React, { createContext, PropsWithChildren, useContext } from 'react';

export interface FeatureFlags {
  useMockServices: boolean;
  enableFirebase: boolean;
  enableXPosting: boolean;
  enableAICategorization: boolean;
}

const defaultFlags: FeatureFlags = {
  useMockServices: true,
  enableFirebase: false,
  enableXPosting: false,
  enableAICategorization: false,
};

const FeatureFlagContext = createContext<FeatureFlags>(defaultFlags);

export const FeatureFlagProvider: React.FC<PropsWithChildren<{ flags?: FeatureFlags }>> = ({ flags, children }) => (
  <FeatureFlagContext.Provider value={{ ...defaultFlags, ...flags }}>
    {children}
  </FeatureFlagContext.Provider>
);

export const useFeatureFlags = (): FeatureFlags => useContext(FeatureFlagContext);
