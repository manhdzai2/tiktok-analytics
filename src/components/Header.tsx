import { useState, useRef, useEffect } from "react";
import { ChevronDown, BarChart3, Moon, Sun, Languages, Link2, Loader2, Plus } from "lucide-react";
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

export function Header({ channels, selectedChannel, onChannelChange, onImport, isImporting }: HeaderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [importUrl, setImportUrl] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { theme, toggleTheme } = useTheme();
  const { locale, setLocale, t } = useI18n();

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleImportSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!importUrl.trim()) return;
    await onImport(importUrl);
    setImportUrl("");
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-card/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo / App Name */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl border border-border/50 bg-white shadow-sm transition-smooth hover:shadow-md">
            <img src="/logo.png" alt="Quang Mạnh Logo" className="h-full w-full object-contain p-1" />
          </div>
          <div className="hidden lg:block">
            <h1 className="text-base font-semibold tracking-tight text-foreground">
              {t("app.title")}
            </h1>
          </div>
        </div>

        {/* Search/Import Bar */}
        <div className="flex flex-1 items-center justify-center px-4 max-w-xl">
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
              className={cn(
                "h-10 w-full rounded-2xl border border-border bg-secondary/30 pl-10 pr-12 text-sm",
                "transition-smooth focus:border-primary/50 focus:bg-card focus:outline-none focus:ring-2 focus:ring-ring/10",
                "disabled:opacity-50"
              )}
            />
            <button
              type="submit"
              disabled={isImporting || !importUrl.trim()}
              className="absolute right-1.5 top-1.5 flex h-7 items-center gap-1 rounded-xl bg-primary px-3 text-xs font-medium text-primary-foreground shadow-sm transition-smooth hover:bg-primary/90 disabled:opacity-50"
            >
              {isImporting ? (
                <Loader2 className="h-3 w-3 animate-spin" />
              ) : (
                <Plus className="h-3 w-3" />
              )}
              <span className="hidden sm:inline">{t("header.add")}</span>
            </button>
          </form>
        </div>

        {/* Right side controls */}
        <div className="flex items-center gap-2">
          {/* Language Toggle */}
          <button
            onClick={() => setLocale(locale === "en" ? "vi" : "en")}
            className={cn(
              "flex h-9 items-center gap-1.5 rounded-xl border border-border bg-card px-3",
              "shadow-card transition-smooth hover:shadow-card-hover hover:border-primary/20",
              "focus:outline-none focus:ring-2 focus:ring-ring/20"
            )}
            title={locale === "en" ? "Chuyển sang Tiếng Việt" : "Switch to English"}
          >
            <Languages className="h-4 w-4 text-muted-foreground" />
            <span className="text-xs font-medium text-foreground">
              {locale === "en" ? "EN" : "VI"}
            </span>
          </button>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className={cn(
              "flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-card",
              "shadow-card transition-smooth hover:shadow-card-hover hover:border-primary/20",
              "focus:outline-none focus:ring-2 focus:ring-ring/20"
            )}
            title={theme === "light" ? "Dark mode" : "Light mode"}
          >
            {theme === "light" ? (
              <Moon className="h-4 w-4 text-muted-foreground transition-smooth" />
            ) : (
              <Sun className="h-4 w-4 text-muted-foreground transition-smooth" />
            )}
          </button>

        </div>
      </div>
    </header>
  );
}