import { SidebarProvider } from '@/components/sidebar/SidebarProvider';
import { AuthProvider } from '@/contexts/AuthContext';
import { AppLayout } from '@/components/layout/AppLayout';
import { AuthPage } from '@/components/auth/AuthPage';
import { useAuth } from '@/hooks/useAuth';
import { ChatInputPreview } from '@/components/chat/ChatInputPreview';

function AppRouter() {
  const { isAuthenticated, isLoading } = useAuth();

  if (window.location.hash === '#chat-input-preview') {
    return <ChatInputPreview />;
  }

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-bg-page">
        <div className="w-[24px] h-[24px] rounded-[6px] bg-[#2d2d2d] border border-white/10 overflow-hidden flex items-center justify-center animate-pulse">
          <img src="/icons/zai-logo.png" alt="Z" className="w-[16px] h-[16px] object-cover" />
        </div>
      </div>
    );
  }

  if (!isAuthenticated) return <AuthPage />;

  return (
    <SidebarProvider>
      <AppLayout />
    </SidebarProvider>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppRouter />
    </AuthProvider>
  );
}

export default App;
