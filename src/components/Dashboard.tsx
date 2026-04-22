import { useState, useEffect } from "react";
import { Loader2, Plus, Users, Search, Trash2, X, CheckSquare, Upload } from "lucide-react";
import { useI18n } from "@/context/I18nContext";
import { Header } from "@/components/Header";
import { AccountRow } from "@/components/AccountRow";
import { BulkImportModal } from "@/components/BulkImportModal";
import { getChannels, importTikTok, deleteChannel, bulkDeleteChannels } from "@/lib/api";
import type { ChannelData } from "@/data/mockData";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export function Dashboard() {
  const { t } = useI18n();
  const [channels, setChannels] = useState<ChannelData[]>([]);
  const [pagination, setPagination] = useState({ current: 1, last: 1 });
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isMoreLoading, setIsMoreLoading] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [isBulkImportOpen, setIsBulkImportOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const init = async (page = 1) => {
    if (page === 1) setIsLoading(true);
    else setIsMoreLoading(true);

    try {
      const response = await getChannels(page);
      console.log("API Response:", response);
      
      const newData = response?.data || [];
      if (page === 1) {
        setChannels(newData);
      } else {
        setChannels(prev => [...prev, ...newData]);
      }
      
      setPagination({
        current: response?.current_page || 1,
        last: response?.last_page || 1
      });
    } catch (error) {
      console.error("Failed to load channels:", error);
    } finally {
      setIsLoading(false);
      setIsMoreLoading(false);
    }
  };

  useEffect(() => {
    init();
  }, []);

  const handleImport = async (url: string) => {
    setIsImporting(true);
    try {
      const response = await importTikTok(url);
      const newChannel = response.data;

      setChannels(prev => {
        if (prev.find(c => c.id === newChannel.id)) return prev;
        return [newChannel, ...prev];
      });
    } catch (error) {
      alert(t("error.import"));
      console.error("Import failed:", error);
    } finally {
      setIsImporting(false);
    }
  };

  const handleDeleteAccount = async (id: string) => {
    try {
      await deleteChannel(id);
      setChannels(prev => prev.filter(c => c.id !== id));
      setSelectedIds(prev => prev.filter(selectedId => selectedId !== id));
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;

    if (window.confirm(t("bulk.deleteConfirm").replace("{count}", selectedIds.length.toString()))) {
      try {
        await bulkDeleteChannels(selectedIds);
        setChannels(prev => prev.filter(c => !selectedIds.includes(c.id)));
        setSelectedIds([]);
      } catch (error) {
        console.error("Bulk delete failed:", error);
      }
    }
  };

  const handleSelect = (id: string, selected: boolean) => {
    setSelectedIds(prev =>
      selected ? [...prev, id] : prev.filter(i => i !== id)
    );
  };

  const filteredChannels = (channels || []).filter(c =>
    c && c.name && c.handle && (
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.handle.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const handleSelectAll = () => {
    if (selectedIds.length === filteredChannels.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredChannels.map(c => c.id));
    }
  };

  if (isLoading && channels.length === 0) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="text-center">
          <Loader2 className="mx-auto h-10 w-10 animate-spin text-primary" />
          <p className="mt-4 text-muted-foreground animate-pulse font-medium">{t("app.preparing")}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background selection:bg-primary/20">
      <Header
        channels={channels}
        selectedChannel={channels[0] || null}
        onChannelChange={() => { }}
        onImport={handleImport}
        isImporting={isImporting}
      />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 pb-32">
        {/* Compact Management Header */}
        <div className="mb-6 flex flex-col gap-4 px-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center justify-between sm:justify-start gap-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Users className="h-5 w-5" />
                </div>
                <h1 className="text-xl sm:text-2xl font-extrabold tracking-tighter text-foreground">{t("dashboard.title")}</h1>
              </div>

              {channels.length > 0 && (
                <button
                  onClick={handleSelectAll}
                  className="flex items-center gap-2 text-xs font-semibold text-muted-foreground hover:text-primary transition-colors"
                >
                  <CheckSquare className={cn(
                    "h-4 w-4",
                    selectedIds.length === filteredChannels.length && selectedIds.length > 0 ? "text-primary" : "text-muted-foreground/40"
                  )} />
                  <span className="hidden xs:inline">{t("bulk.selectAll")}</span>
                </button>
              )}
            </div>

            <div className="flex gap-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-64">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  placeholder={t("dashboard.search")}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-10 w-full rounded-xl border border-border/40 bg-secondary/20 pl-9 pr-4 text-sm focus:border-primary/40 focus:outline-none focus:ring-4 focus:ring-primary/5 transition-all"
                />
              </div>

              <button
                onClick={() => setIsBulkImportOpen(true)}
                className="flex h-10 items-center justify-center gap-2 rounded-xl bg-secondary/40 px-4 text-xs font-bold text-foreground hover:bg-secondary/60 transition-all active:scale-95 whitespace-nowrap"
              >
                <Upload className="h-4 w-4" />
                <span className="hidden sm:inline">{t("bulk.import")}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Account List Area */}
        <div className="space-y-1.5">
          {filteredChannels.length > 0 ? (
            filteredChannels.map((channel) => (
              <AccountRow
                key={channel.id}
                channel={channel}
                isSelected={selectedIds.includes(channel.id)}
                onSelect={handleSelect}
                onDelete={handleDeleteAccount}
              />
            ))
          ) : (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/40 bg-secondary/5 py-16">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-secondary/30">
                <Plus className="h-7 w-7 text-muted-foreground" />
              </div>
              <p className="text-base font-semibold text-foreground tracking-tight">{t("dashboard.noAccounts")}</p>
              <p className="text-xs text-muted-foreground mt-1">{t("dashboard.addAccountDesc")}</p>
            </div>
          )}
        </div>

        {pagination.current < pagination.last && (
          <div className="mt-8 flex justify-center">
            <button
              onClick={() => init(pagination.current + 1)}
              disabled={isMoreLoading}
              className="flex items-center gap-2 rounded-xl bg-secondary/50 px-8 py-3 text-sm font-bold text-foreground hover:bg-secondary/70 transition-all disabled:opacity-50"
            >
              {isMoreLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <Plus className="h-4 w-4" />
                  {t("dashboard.loadMore")}
                </>
              )}
            </button>
          </div>
        )}
      </main>

      {/* Floating Bulk Action Bar */}
      <AnimatePresence>
        {selectedIds.length > 0 && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-8 left-1/2 z-50 flex -translate-x-1/2 items-center gap-6 rounded-2xl border border-border/40 bg-card/80 px-6 py-4 shadow-2xl backdrop-blur-xl"
          >
            <div className="flex items-center gap-3 border-r border-border/20 pr-6">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-[11px] font-bold text-white shadow-lg shadow-primary/20">
                {selectedIds.length}
              </div>
              <span className="text-sm font-semibold text-foreground">{t("bulk.selected")}</span>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={() => setSelectedIds([])}
                className="flex items-center gap-2 text-xs font-bold text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="h-4 w-4" />
              </button>

              <button
                onClick={handleBulkDelete}
                className="flex items-center gap-2 rounded-xl bg-destructive px-5 py-2 text-xs font-bold text-white shadow-lg shadow-destructive/20 hover:bg-destructive/90 transition-all hover:scale-105 active:scale-95"
              >
                <Trash2 className="h-3.5 w-3.5" />
                {t("bulk.delete")}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <footer className="mt-16 border-t border-border/20 bg-card/20 py-8 text-center px-4">
        <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-widest">{t("footer.text")}</p>
      </footer>

      <BulkImportModal
        isOpen={isBulkImportOpen}
        onClose={() => setIsBulkImportOpen(false)}
        onSuccess={init}
      />
    </div>
  );
}