import {
  createContext,
  useState,
  useCallback,
  useMemo,
  useEffect,
  useRef,
  type ReactNode,
} from 'react';
import type { NavItemId, SettingsSection, SidebarContextValue, SavedTemplate, Theme } from '@/types/sidebar';
import { useMediaQuery } from '@/hooks/useMediaQuery';

export const SidebarContext = createContext<SidebarContextValue | null>(null);

export function SidebarProvider({ children }: { children: ReactNode }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isHoverExpanded, setIsHoverExpanded] = useState(false);
  const [activeNav, setActiveNav] = useState<NavItemId>('agent');
  const [chatInitialMessage, setChatInitialMessage] = useState<string | null>(null);
  const [chatAgentKey, setChatAgentKey] = useState<string | null>(null);
  const [chatHistory, setChatHistory] = useState<{ id: string; title: string; timestamp: number }[]>(() => {
    try { return JSON.parse(localStorage.getItem('z-chat-history') || '[]'); } catch { return []; }
  });
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [settingsFromTasks, setSettingsFromTasks] = useState(false);
  const [activeSettingsSection, setActiveSettingsSection] =
    useState<SettingsSection>('general');
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('z-theme') as Theme) || 'light';
    }
    return 'light';
  });
  const isMobile = useMediaQuery('(max-width: 768px)');
  const [showTemplateTip, setShowTemplateTip] = useState(false);
  const [savedTemplates, setSavedTemplates] = useState<SavedTemplate[]>(() => {
    try { return JSON.parse(localStorage.getItem('z-saved-templates') || '[]'); } catch { return []; }
  });

  const toggleTheme = useCallback(() => {
    setTheme((prev) => {
      const next = prev === 'light' ? 'dark' : 'light';
      localStorage.setItem('z-theme', next);
      return next;
    });
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  // Debounce hover to prevent flicker
  const hoverTimerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const toggleCollapse = useCallback(() => {
    setIsCollapsed((prev) => !prev);
    setIsHoverExpanded(false);
  }, []);

  const handleSetHoverExpanded = useCallback(
    (val: boolean) => {
      if (!isCollapsed) return;
      clearTimeout(hoverTimerRef.current);
      if (val) {
        hoverTimerRef.current = setTimeout(() => setIsHoverExpanded(true), 50);
      } else {
        hoverTimerRef.current = setTimeout(() => setIsHoverExpanded(false), 150);
      }
    },
    [isCollapsed]
  );

  const openSettings = useCallback(() => {
    setIsSettingsOpen(true);
    setSettingsFromTasks(false);
  }, []);

  const openSettingsFromTasks = useCallback(() => {
    setIsSettingsOpen(true);
    setSettingsFromTasks(true);
  }, []);

  const closeSettings = useCallback(() => {
    setIsSettingsOpen(false);
    setSettingsFromTasks(false);
  }, []);

  const startChat = useCallback((message: string, agentKey?: string) => {
    setChatInitialMessage(message);
    setChatAgentKey(agentKey || null);
    setIsSettingsOpen(false);
    if (!isCollapsed) setIsCollapsed(true);
  }, [isCollapsed]);

  const clearChat = useCallback(() => {
    setChatInitialMessage(null);
    setChatAgentKey(null);
    if (isCollapsed) toggleCollapse();
  }, [isCollapsed, toggleCollapse]);

  const addChatHistory = useCallback((title: string) => {
    setChatHistory(prev => {
      const next = [{ id: Math.random().toString(36).substring(2), title, timestamp: Date.now() }, ...prev];
      localStorage.setItem('z-chat-history', JSON.stringify(next.slice(0, 50)));
      return next;
    });
  }, []);

  const addSavedTemplate = useCallback((t: SavedTemplate) => {
    setSavedTemplates(prev => {
      const next = [t, ...prev];
      localStorage.setItem('z-saved-templates', JSON.stringify(next));
      return next;
    });
  }, []);

  // Escape key handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isSettingsOpen) {
          setIsSettingsOpen(false);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSettingsOpen]);

  // Cleanup timer
  useEffect(() => {
    return () => clearTimeout(hoverTimerRef.current);
  }, []);

  const isExpanded = !isCollapsed || isHoverExpanded;

  const value = useMemo<SidebarContextValue>(
    () => ({
      isCollapsed,
      toggleCollapse,
      isHoverExpanded,
      setHoverExpanded: handleSetHoverExpanded,
      isExpanded,
      activeNav,
      setActiveNav,
      chatInitialMessage,
      chatAgentKey,
      startChat,
      clearChat,
      chatHistory,
      addChatHistory,
      isSettingsOpen,
      openSettings,
      closeSettings,
      activeSettingsSection,
      setActiveSettingsSection,
      settingsFromTasks,
      openSettingsFromTasks,
      theme,
      toggleTheme,
      isMobile,
      showTemplateTip,
      setShowTemplateTip,
      savedTemplates,
      addSavedTemplate,
    }),
    [
      isCollapsed,
      toggleCollapse,
      isHoverExpanded,
      handleSetHoverExpanded,
      isExpanded,
      activeNav,
      chatInitialMessage,
      chatAgentKey,
      startChat,
      clearChat,
      chatHistory,
      addChatHistory,
      isSettingsOpen,
      openSettings,
      closeSettings,
      activeSettingsSection,
      settingsFromTasks,
      openSettingsFromTasks,
      theme,
      toggleTheme,
      isMobile,
      showTemplateTip,
      savedTemplates,
      addSavedTemplate,
    ]
  );

  return (
    <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>
  );
}
