import { useContext } from 'react';
import { SidebarContext } from '@/components/sidebar/SidebarProvider';
import type { SidebarContextValue } from '@/types/sidebar';

export function useSidebar(): SidebarContextValue {
  const context = useContext(SidebarContext);
  if (context === null) {
    throw new Error('useSidebar must be used within a SidebarProvider');
  }
  return context;
}
