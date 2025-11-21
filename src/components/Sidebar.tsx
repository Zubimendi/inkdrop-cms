'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  FileText, 
  PlusCircle, 
  Settings, 
  LogOut,
  Droplet,
  Archive,
  Eye
} from 'lucide-react';
import { signOut } from 'next-auth/react';

export default function Sidebar() {
  const pathname = usePathname();

  const navItems = [
    { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { href: '/content/new', icon: PlusCircle, label: 'New Content' },
    { href: '/dashboard?filter=published', icon: Eye, label: 'Published' },
    { href: '/dashboard?filter=draft', icon: FileText, label: 'Drafts' },
    { href: '/dashboard?filter=archived', icon: Archive, label: 'Archived' },
    { href: '/settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col">
      <div className="p-6 border-b border-slate-800">
        <Link href="/dashboard" className="flex items-center space-x-2">
          <Droplet className="w-8 h-8 text-blue-400" />
          <span className="text-xl font-bold text-white">Inkdrop</span>
        </Link>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || pathname.startsWith(item.href);
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition ${
                isActive
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <button
          onClick={() => signOut({ callbackUrl: '/login' })}
          className="flex items-center space-x-3 px-4 py-3 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition w-full"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Sign Out</span>
        </button>
      </div>
    </aside>
  );
}