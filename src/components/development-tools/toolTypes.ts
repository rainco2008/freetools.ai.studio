import React from 'react';

export type CategoryId =
  | 'crypto'
  | 'converter'
  | 'web'
  | 'text'
  | 'formatter'
  | 'math'
  | 'memo';

export interface Category {
  id: CategoryId;
  name: string;
  description: string;
  icon: string;
}

export interface Tool {
  id: string;
  title: string;
  description: string;
  category: CategoryId;
  keywords: string[];
  icon: string;
  component: React.ComponentType;
}
