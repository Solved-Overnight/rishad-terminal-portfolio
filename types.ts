
import React from 'react';

export interface Command {
  command: string;
  output: React.ReactNode;
}

export interface TerminalLine {
  type: 'input' | 'output' | 'system';
  content: React.ReactNode;
  timestamp?: number;
  isStopped?: boolean;
}

export interface Project {
  id?: string;
  name: string;
  tagline?: string;
  description: string;
  longDescription?: string;
  tech: string[];
  category?: string;
  stars?: number;
  forks?: number;
  image?: string;
  color?: string;
  accentColor?: string;
  link?: string;
  github?: string;
  features?: string[];
  highlights?: { label: string; value: string }[];
}

export interface Experience {
  role: string;
  company: string;
  period: string;
  description: string;
}

export interface SkillCategory {
  category: string;
  skills: string[];
}

export interface Certification {
  name: string;
  issuer: string;
  year: string;
}

export interface LeadershipItem {
  role: string;
  event: string;
  year: string;
  description: string;
}

export interface FileNode {
  type: 'file';
  content: string;
}

export interface DirectoryNode {
  type: 'directory';
  children: { [name: string]: FileSystemNode };
}

export type FileSystemNode = FileNode | DirectoryNode;

export interface HistoryItem {
  command: string;
  output: string;
  timestamp: number;
}

export interface BlogPost {
  id: string;
  filename: string;
  title: string;
  date: string;
  author: string;
  summary: string;
  tags: string[];
  readTime: string;
  content: string;
}
