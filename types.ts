export interface DesignInput {
  projectName: string;
  requirements: string;
  targetUsers: string;
  spatialContext: string;
}

export interface RadarDataPoint {
  subject: string;
  A: number; // Proposed Design Score
  fullMark: number;
}

export interface GraphNode {
  id: string;
  group: number;
  radius?: number;
  label: string;
  type: 'zone' | 'user' | 'element';
}

export interface GraphLink {
  source: string;
  target: string;
  value: number; // Strength of relationship
}

export interface SpatialGraphData {
  nodes: GraphNode[];
  links: GraphLink[];
}

export interface StrategyAnalysis {
  coreConcept: string;
  designPrinciples: string[];
  radarChartData: RadarDataPoint[];
  spatialGraphData: SpatialGraphData;
  detailedAnalysis: string; // Markdown
  colorPaletteSuggestion: string[];
}

export enum AppState {
  IDLE,
  ANALYZING,
  SUCCESS,
  ERROR
}