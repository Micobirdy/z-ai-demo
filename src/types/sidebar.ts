export type NavItemId = 'chat' | 'agent' | 'new-task' | 'expert' | 'folder';

export type SettingsSection =
  | 'general'
  | 'account'
  | 'dashboard'
  | 'connectors'
  | 'data'
  | 'about';

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

  // Settings panel
  isSettingsOpen: boolean;
  openSettings: () => void;
  closeSettings: () => void;
  activeSettingsSection: SettingsSection;
  setActiveSettingsSection: (section: SettingsSection) => void;

  // Responsive
  isMobile: boolean;
}
