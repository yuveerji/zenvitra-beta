'use client';

import React from 'react';

export function ContentProtectionProvider({ children }: { children: React.ReactNode }) {
  // Copying, screenshot taking, and media interaction fully enabled
  return <>{children}</>;
}

export default ContentProtectionProvider;
