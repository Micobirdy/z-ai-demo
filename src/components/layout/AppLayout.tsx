import { Sidebar } from '@/components/sidebar/Sidebar';
import { MainContent } from './MainContent';

export function AppLayout() {
  return (
    <div className="flex h-screen overflow-hidden bg-bg-page">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <MainContent />
      </main>
    </div>
  );
}
