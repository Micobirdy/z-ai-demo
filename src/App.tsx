import { SidebarProvider } from '@/components/sidebar/SidebarProvider';
import { AppLayout } from '@/components/layout/AppLayout';

function App() {
  return (
    <SidebarProvider>
      <AppLayout />
    </SidebarProvider>
  );
}

export default App;
