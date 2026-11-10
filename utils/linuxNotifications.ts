export interface GnomeNotification {
  id: string;
  source: string;
  title: string;
  message: string;
  time: string;
  timestamp?: number;
  category: 'system' | 'security' | 'terminal' | 'network' | 'disguise';
}

const STORAGE_KEY = 'linux_gnome_notifications';
const MAX_NOTIFICATIONS = 25;

export const DEFAULT_LINUX_NOTIFICATIONS: GnomeNotification[] = [
  {
    id: 'notif-boot-1',
    source: 'GNOME Shell',
    title: 'Session Initialized',
    message: 'Linux GNOME desktop ready. Click the Windows icon in the top bar for Undercover mode.',
    time: 'Just now',
    timestamp: Date.now(),
    category: 'disguise',
  },
  {
    id: 'notif-term-2',
    source: 'Kali Terminal',
    title: 'Zsh Environment Ready',
    message: 'Toolchain, bash aliases, and interactive commands online on /dev/pts/1.',
    time: '2m ago',
    timestamp: Date.now() - 2 * 60 * 1000,
    category: 'terminal',
  },
  {
    id: 'notif-badge-3',
    source: '3D Holographic Badge',
    title: 'Rapier Physics Sensor Synced',
    message: 'Interactive lanyard & inertia physics engine active.',
    time: '5m ago',
    timestamp: Date.now() - 5 * 60 * 1000,
    category: 'system',
  },
  {
    id: 'notif-sec-4',
    source: 'Security Audit',
    title: 'System Protection Active',
    message: 'Zero unauthorized ports detected. Sandbox isolation verified.',
    time: '12m ago',
    timestamp: Date.now() - 12 * 60 * 1000,
    category: 'security',
  },
  {
    id: 'notif-net-5',
    source: 'Network Manager',
    title: 'Connected to WolfNet-5G',
    message: 'High-speed link established via interface wlan0 (10.10.14.88).',
    time: '24m ago',
    timestamp: Date.now() - 24 * 60 * 1000,
    category: 'network',
  },
];

export function formatNotificationTime(timestamp?: number, fallback?: string): string {
  if (!timestamp) return fallback || 'Just now';
  const diffSec = Math.max(0, Math.floor((Date.now() - timestamp) / 1000));
  if (diffSec < 45) return 'Just now';
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h ago`;
  const diffDay = Math.floor(diffHr / 24);
  return `${diffDay}d ago`;
}

export function getStoredLinuxNotifications(): GnomeNotification[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw === null) {
      const seeded = DEFAULT_LINUX_NOTIFICATIONS.map((n, idx) => ({
        ...n,
        timestamp: Date.now() - idx * 3 * 60 * 1000,
      }));
      localStorage.setItem(STORAGE_KEY, JSON.stringify(seeded));
      return seeded;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed;
    }
  } catch {
    // ignore storage errors
  }
  return [];
}

export function saveLinuxNotifications(notifications: GnomeNotification[]): GnomeNotification[] {
  const trimmed = notifications.slice(0, MAX_NOTIFICATIONS);
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
      window.dispatchEvent(
        new CustomEvent('linux-notifications-updated', { detail: trimmed })
      );
    } catch {
      // ignore storage errors
    }
  }
  return trimmed;
}

export function pushLinuxNotification(
  input: Omit<GnomeNotification, 'id' | 'time' | 'timestamp'> & { time?: string }
): GnomeNotification[] {
  const existing = getStoredLinuxNotifications();
  const now = Date.now();
  const newItem: GnomeNotification = {
    id: `notif-${now}-${Math.random().toString(36).slice(2, 6)}`,
    source: input.source,
    title: input.title,
    message: input.message,
    time: input.time || 'Just now',
    timestamp: now,
    category: input.category,
  };
  return saveLinuxNotifications([newItem, ...existing]);
}
