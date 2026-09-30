export type ProjectState =
  | 'CREATED'
  | 'FETCHING'
  | 'ANALYZING'
  | 'ANALYZED'
  | 'GENERATING'
  | 'GENERATED'
  | 'VALIDATING'
  | 'REPAIRING'
  | 'READY'
  | 'MODIFYING'
  | 'FAILED';

export interface ThemeSpec {
  mode: 'light' | 'dark' | 'auto';
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  textColor: string;
  accentColor: string;
  borderRadius: string;
  shadow: string;
}

export interface NavLink {
  label: string;
  href: string;
}

export interface NavigationSpec {
  brand: string;
  logoUrl?: string;
  links: NavLink[];
  ctaButton?: {
    text: string;
    href: string;
  };
}

export interface SectionItem {
  title?: string;
  description?: string;
  icon?: string;
  badge?: string;
  price?: string;
  author?: string;
  role?: string;
  avatar?: string;
  features?: string[];
  imageUrl?: string;
}

export interface SectionSpec {
  id: string;
  type:
    | 'hero'
    | 'features'
    | 'testimonials'
    | 'pricing'
    | 'cta'
    | 'footer'
    | 'faq'
    | 'stats'
    | 'gallery'
    | 'content';
  title?: string;
  subtitle?: string;
  content?: string;
  items?: SectionItem[];
  cta?: {
    text: string;
    href: string;
    variant?: string;
  };
}

export interface AssetSpec {
  url: string;
  alt?: string;
  width?: number;
  height?: number;
  type: 'image' | 'svg' | 'icon' | 'logo';
  sectionId?: string;
}

export interface WebsiteAnalysis {
  url: string;
  title: string;
  description: string;
  theme: ThemeSpec;
  navigation: NavigationSpec;
  sections: SectionSpec[];
  components: string[];
  typography: {
    headingFont: string;
    bodyFont: string;
    baseFontSize: string;
    headingScale: string;
  };
  colors: {
    palette: string[];
    background: string;
    foreground: string;
    primary: string;
    secondary: string;
    accent: string;
    muted: string;
    border: string;
  };
  spacing: {
    sectionPadding: string;
    containerMaxWidth: string;
    elementGap: string;
  };
  assets: AssetSpec[];
  responsiveStructure: {
    mobileMenu: boolean;
    gridBreakpoints: string;
    collapsibleSections: string[];
  };
}

export interface LogEntry {
  timestamp: string;
  stage: string;
  message: string;
  type: 'info' | 'warn' | 'error' | 'success';
}

export interface ChangeRecord {
  timestamp: string;
  instruction: string;
  changedFiles: string[];
  plan: string;
  explanation: string;
}

export interface ValidationResult {
  status: 'passed' | 'failed' | 'pending';
  errors: string[];
  attemptCount: number;
}

export interface ProjectManifest {
  id: string;
  sourceUrl: string;
  createdAt: string;
  updatedAt: string;
  state: ProjectState;
  analysis?: WebsiteAnalysis;
  files: Record<string, string>; // relative file path -> content
  logs: LogEntry[];
  changes: ChangeRecord[];
  validation: ValidationResult;
  previewUrl: string;
}

export interface ModificationPlan {
  userInstruction: string;
  identifiedIntent: string;
  affectedFiles: string[];
  stepByStepPlan: string[];
  explanation: string;
}

export interface RepairPlan {
  errorSummary: string;
  rootCause: string;
  affectedFiles: string[];
  fixActions: Array<{
    file: string;
    description: string;
  }>;
}

export interface LLMConfig {
  provider: 'gemini' | 'openai' | 'anthropic' | 'ollama' | 'smart_engine';
  model?: string;
  apiKey?: string;
  baseUrl?: string;
}
