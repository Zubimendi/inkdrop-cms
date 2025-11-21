"use client";

import { useSession } from "next-auth/react";
import { Bell, Search } from "lucide-react";

export default function DashboardHeader() {
  const { data: session } = useSession();

  return (
    <header className="bg-slate-900 border-b border-slate-800 px-8 py-4">
      <div className="flex items-center justify-between">
        <div className="flex-1 max-w-xl">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search content..."
              className="w-full pl-12 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-slate-500"
            />
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <button className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition relative">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-blue-500 rounded-full"></span>
          </button>

          <div className="flex items-center space-x-3 pl-4 border-l border-slate-700">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-semibold">
              {session?.user?.name?.[0]?.toUpperCase() || "U"}
            </div>
            <div>
              <p className="text-sm font-medium text-white">
                {session?.user?.name}
              </p>
              <p className="text-xs text-slate-400">{session?.user?.role}</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
