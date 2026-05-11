import type { AuthResponse, LoginRequest, RegisterRequest, User } from '@/types/auth';

const STORAGE_KEY = 'auth_user';
const TOKEN_KEY = 'auth_token';

function generateId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

function delay(ms = 600): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

export async function login(data: LoginRequest): Promise<AuthResponse> {
  await delay();
  // Mock: accept any email/password, return stored user or create one
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    const user: User = JSON.parse(stored);
    if (user.email === data.email) {
      const token = `mock_token_${generateId()}`;
      localStorage.setItem(TOKEN_KEY, token);
      return { user, token };
    }
  }
  throw new Error('Invalid email or password');
}

export async function register(data: RegisterRequest): Promise<AuthResponse> {
  await delay();
  const user: User = {
    id: generateId(),
    name: data.name,
    email: data.email,
    plan: 'free',
    createdAt: new Date().toISOString(),
  };
  const token = `mock_token_${generateId()}`;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  localStorage.setItem(TOKEN_KEY, token);
  return { user, token };
}

export async function getUser(): Promise<User | null> {
  const token = localStorage.getItem(TOKEN_KEY);
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!token || !stored) return null;
  return JSON.parse(stored);
}

export function logout(): void {
  localStorage.removeItem(TOKEN_KEY);
}

export async function updateUser(updates: Partial<User>): Promise<User> {
  await delay(300);
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) throw new Error('Not authenticated');
  const user: User = { ...JSON.parse(stored), ...updates };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  return user;
}
