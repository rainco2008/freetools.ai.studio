export interface GroundingSource {
  index: number;
  title: string;
  url: string;
}

export interface Conclusion {
  id: string;
  text: string;
  citations: number[];
}

export interface SourceDetail {
  chunkIndex: number;
  title: string;
  url: string;
  publishDate: string;
  credibilityScore: "High" | "Medium" | "Low";
  credibilityRationale: string;
  snippet: string;
}

export interface FactOpinionItem {
  statement: string;
  type: "Fact" | "Opinion" | "Speculation";
  rationale: string;
  citations: number[];
}

export interface TimelineItem {
  date: string;
  event: string;
  description: string;
  citations: number[];
}

export interface ContradictoryView {
  sourceName: string;
  view: string;
  citations: number[];
}

export interface ConflictTopic {
  topic: string;
  description: string;
  contradictoryViews: ContradictoryView[];
}

export interface ResearchReport {
  title: string;
  isTimeSensitive: boolean;
  timeSensitiveReason: string;
  summary: string;
  conclusions: Conclusion[];
  sources: SourceDetail[];
  factOpinionAnalysis: FactOpinionItem[];
  timeline: TimelineItem[];
  conflictAnalysis: ConflictTopic[];
}

export interface SavedReport {
  id: string;
  query: string;
  reportType: "brief" | "competitive" | "factcheck";
  languageStyle: "objective" | "simple" | "academic";
  createdAt: string;
  report: ResearchReport;
  groundingSources: GroundingSource[];
}
