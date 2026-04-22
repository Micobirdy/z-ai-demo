import {
  createContext,
  useState,
  useCallback,
  useMemo,
  useEffect,
  useRef,
  type ReactNode,
} from 'react';
import type { NavItemId, SettingsSection, SidebarContextValue, Theme } from '@/types/sidebar';
import { useMediaQuery } from '@/hooks/useMediaQuery';

export const SidebarContext = createContext<SidebarContextValue | null>(null);

export function SidebarProvider({ children }: { children: ReactNode }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isHoverExpanded, setIsHoverExpanded] = useState(false);
  const [activeNav, setActiveNav] = useState<NavItemId>('chat');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [activeSettingsSection, setActiveSettingsSection] =
    useState<SettingsSection>('general');
  const [theme, setTheme] = useState<Theme>('light');
  const isMobile = useMediaQuery('(max-width: 768px)');

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  }, []);

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
  }, []);

  const closeSettings = useCallback(() => {
    setIsSettingsOpen(false);
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
      isSettingsOpen,
      openSettings,
      closeSettings,
      activeSettingsSection,
      setActiveSettingsSection,
      theme,
      toggleTheme,
      isMobile,
    }),
    [
      isCollapsed,
      toggleCollapse,
      isHoverExpanded,
      handleSetHoverExpanded,
      isExpanded,
      activeNav,
      isSettingsOpen,
      openSettings,
      closeSettings,
      activeSettingsSection,
      theme,
      toggleTheme,
      isMobile,
    ]
  );

  return (
    <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>
  );
}
