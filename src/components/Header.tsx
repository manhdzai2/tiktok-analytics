import { useState, useRef, useEffect } from "react";
import { Moon, Sun, Languages, Link2, Loader2, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme } from "@/context/ThemeContext";
import { useI18n } from "@/context/I18nContext";
import type { ChannelData } from "@/data/mockData";

interface HeaderProps {
  channels: ChannelData[];
  selectedChannel?: ChannelData | null;
  onChannelChange: (channel: ChannelData) => void;
  onImport: (url: string) => Promise<void>;
  isImporting?: boolean;
}

export function Header({ onImport, isImporting }: HeaderProps) {
  // const [isOpen, setIsOpen] = useState(false);
  const [importUrl, setImportUrl] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { theme, toggleTheme } = useTheme();
  const { locale, setLocale, t } = useI18n();

/*
    useEffect(() => {
      function handleClickOutside(e: MouseEvent) {
        if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
          // setIsOpen(false);
        }
      }
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);
    */

  const handleImportSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!importUrl.trim()) return;
    await onImport(importUrl);
    setImportUrl("");
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-card/80 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Top Row: Logo and Controls */}
        <div className="flex h-14 sm:h-16 items-center justify-between gap-4">
          <div className="flex items-center gap-3 shrink-0">
            <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-xl border border-border/50 bg-white shadow-sm">
              <img src="/logo.png" alt="Quang Mạnh Logo" className="h-full w-full object-contain p-1" />
            </div>
            <h1 className="text-sm sm:text-base font-bold tracking-tight text-foreground truncate max-w-[120px] sm:max-w-none">
              {t("app.title")}
            </h1>
          </div>

          {/* Desktop Search/Import Bar - Hidden on mobile */}
          <div className="hidden sm:flex flex-1 items-center justify-center px-4 max-w-xl">
            <form onSubmit={handleImportSubmit} className="relative w-full">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Link2 className="h-4 w-4 text-muted-foreground" />
              </div>
              <input
                type="text"
                value={importUrl}
                onChange={(e) => setImportUrl(e.target.value)}
                placeholder={t("header.placeholder")}
                disabled={isImporting}
                className="h-10 w-full rounded-xl border border-border bg-secondary/30 pl-10 pr-12 text-sm focus:border-primary/50 focus:bg-card focus:outline-none focus:ring-2 focus:ring-ring/10 transition-all"
              />
              <button
                type="submit"
                disabled={isImporting || !importUrl.trim()}
                className="absolute right-1.5 top-1.5 flex h-7 items-center gap-1 rounded-lg bg-primary px-3 text-xs font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
              >
                {isImporting ? <Loader2 className="h-3 w-3 animate-spin" /> : <Plus className="h-3 w-3" />}
                <span>{t("header.add")}</span>
              </button>
            </form>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <button
              onClick={() => setLocale(locale === "en" ? "vi" : "en")}
              className="flex h-9 items-center gap-1.5 rounded-xl border border-border bg-card px-2 sm:px-3 shadow-card hover:border-primary/20 transition-all"
            >
              <Languages className="h-4 w-4 text-muted-foreground" />
              <span className="text-[11px] sm:text-xs font-bold">{locale === "en" ? "EN" : "VI"}</span>
            </button>

            <button
              onClick={toggleTheme}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-card shadow-card hover:border-primary/20 transition-all"
            >
              {theme === "light" ? <Moon className="h-4 w-4 text-muted-foreground" /> : <Sun className="h-4 w-4 text-muted-foreground" />}
            </button>
          </div>
        </div>

        {/* Bottom Row: Mobile-only Import Bar */}
        <div className="flex sm:hidden pb-3">
          <form onSubmit={handleImportSubmit} className="relative w-full">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Link2 className="h-3.5 w-3.5 text-muted-foreground" />
            </div>
            <input
              type="text"
              value={importUrl}
              onChange={(e) => setImportUrl(e.target.value)}
              placeholder={t("header.placeholder")}
              disabled={isImporting}
              className="h-9 w-full rounded-xl border border-border bg-secondary/40 pl-9 pr-12 text-xs focus:border-primary/50 focus:bg-card focus:outline-none transition-all"
            />
            <button
              type="submit"
              disabled={isImporting || !importUrl.trim()}
              className="absolute right-1 top-1 flex h-7 items-center gap-1 rounded-lg bg-primary px-3 text-[10px] font-bold text-primary-foreground shadow-sm disabled:opacity-50"
            >
              {isImporting ? <Loader2 className="h-3 w-3 animate-spin" /> : <Plus className="h-3 w-3" />}
              <span>{t("header.add")}</span>
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}