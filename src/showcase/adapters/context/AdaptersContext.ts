'use client';

import { createContext } from 'react';
import type { DesignSystemAdapters } from '../types/index.js';

export const AdaptersContext = createContext<DesignSystemAdapters | null>(null);
