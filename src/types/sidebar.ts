export type NavItemId = 'chat' | 'agent' | 'folder' | 'ai-ppt' | 'full-stack' | 'expert';

export type SettingsSection =
  | 'general'
  | 'account'
  | 'dashboard'
  | 'connectors'
  | 'data'
  | 'about';

export type Theme = 'light' | 'dark';

export interface SidebarContextValue {
  // Sidebar collapse state
  isCollapsed: boolean;
  toggleCollapse: () => void;

  // Hover-to-peek (when collapsed, hovering temporarily expands)
  isHoverExpanded: boolean;
  setHoverExpanded: (val: boolean) => void;

  // Derived: should sidebar render in expanded mode?
  isExpanded: boolean;

  // Active navigation
  activeNav: NavItemId;
  setActiveNav: (id: NavItemId) => void;

  // Chat
  chatInitialMessage: string | null;
  chatAgentKey: string | null;
  startChat: (message: string, agentKey?: string) => void;
  clearChat: () => void;
  chatHistory: { id: string; title: string; timestamp: number }[];
  addChatHistory: (title: string) => void;

  // Settings panel
  isSettingsOpen: boolean;
  openSettings: () => void;
  closeSettings: () => void;
  activeSettingsSection: SettingsSection;
  setActiveSettingsSection: (section: SettingsSection) => void;
  settingsFromTasks: boolean;
  openSettingsFromTasks: () => void;

  // Theme
  theme: Theme;
  toggleTheme: () => void;

  // Responsive
  isMobile: boolean;

  // Template save tip
  showTemplateTip: boolean;
  setShowTemplateTip: (v: boolean) => void;
}
