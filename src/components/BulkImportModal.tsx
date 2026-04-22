import { useState, useEffect, useRef } from "react";
import { X, Upload, FileText, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { bulkImportTikTok, getImportStatus } from "@/lib/api";
import { useI18n } from "@/context/I18nContext";
import { cn } from "@/lib/utils";

interface BulkImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function BulkImportModal({ isOpen, onClose, onSuccess }: BulkImportModalProps) {
  // const { t } = useI18n();
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [importId, setImportId] = useState<string | null>(null);
  const [status, setStatus] = useState<any>(null);
  const [isPolling, setIsPolling] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isOpen) {
      setFile(null);
      setImportId(null);
      setStatus(null);
      setIsPolling(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  }, [isOpen]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setIsUploading(true);
    try {
      const response = await bulkImportTikTok(file);
      setImportId(response.import_id);
      setIsPolling(true);
    } catch (error: any) {
      console.error("Upload failed:", error);
      const errorMessage = error.response?.data?.message || error.message || "Upload failed. Please check the file format.";
      const validationErrors = error.response?.data?.errors;
      
      if (validationErrors) {
        const firstError = Object.values(validationErrors).flat()[0];
        alert(`Upload failed: ${firstError}`);
      } else {
        alert(errorMessage);
      }
    } finally {
      setIsUploading(false);
    }
  };

  const prevProcessedCount = useRef(0);

  useEffect(() => {
    let interval: any;

    if (isPolling && importId) {
      interval = setInterval(async () => {
        try {
          const data = await getImportStatus(importId);
          setStatus(data);
          
          // Trigger semi-live refresh when progress improves
          if (data.processed_count > prevProcessedCount.current) {
            prevProcessedCount.current = data.processed_count;
            onSuccess();
          }

          if (data.status === 'completed' || data.status === 'failed') {
            setIsPolling(false);
            onSuccess(); // Final sync
          }
        } catch (error) {
          console.error("Polling error:", error);
          setIsPolling(false);
        }
      }, 2000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPolling, importId, onSuccess]);

  if (!isOpen) return null;

  const progress = status ? (status.processed_count + status.error_count) / Math.max(status.total_count, 1) * 100 : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-lg overflow-hidden rounded-3xl border border-border/40 bg-card shadow-2xl"
      >
        <div className="flex items-center justify-between border-b border-border/10 px-6 py-4">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-bold text-foreground">Bulk Import (Excel/CSV)</h2>
          </div>
          <button onClick={onClose} className="rounded-full p-2 hover:bg-secondary/20 transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-8">
          {!importId ? (
            <div className="space-y-6">
              <div 
                onClick={() => fileInputRef.current?.click()}
                className={cn(
                  "flex flex-col items-center justify-center rounded-2xl border-2 border-dashed py-12 transition-all cursor-pointer",
                  file ? "border-primary/40 bg-primary/5" : "border-border/40 hover:border-primary/20 bg-secondary/5"
                )}
              >
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileChange} 
                  accept=".csv,.txt,.xlsx,.xls"
                  className="hidden" 
                />
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-secondary/30">
                  {file ? <CheckCircle2 className="h-7 w-7 text-primary" /> : <Upload className="h-7 w-7 text-muted-foreground" />}
                </div>
                <p className="text-sm font-semibold text-foreground">
                  {file ? file.name : "Click to select Excel or CSV file"}
                </p>
                <p className="text-xs text-muted-foreground mt-1">First column must contain TikTok IDs (@abc) or Links</p>
              </div>

              <div className="flex justify-end gap-3">
                <button 
                  onClick={onClose}
                  className="rounded-xl px-4 py-2 text-sm font-bold text-muted-foreground hover:text-foreground transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpload}
                  disabled={!file || isUploading}
                  className="flex items-center gap-2 rounded-xl bg-primary px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all disabled:opacity-50"
                >
                  {isUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                  Start Import
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-8">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-foreground">
                    {status?.status === 'completed' ? 'Import Complete' : (status?.status === 'failed' ? 'Import Failed' : 'Processing...')}
                  </span>
                  <span className="text-sm font-bold text-primary">{Math.round(progress)}%</span>
                </div>
                
                <div className="h-3 w-full overflow-hidden rounded-full bg-secondary/30">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    className="h-full bg-primary shadow-lg shadow-primary/20 transition-all duration-500"
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="rounded-2xl bg-secondary/10 p-4 text-center">
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold italic">Total</p>
                    <p className="text-xl font-black text-foreground">{status?.total_count || 0}</p>
                  </div>
                  <div className="rounded-2xl bg-green-500/10 p-4 text-center">
                    <p className="text-[10px] uppercase tracking-wider text-green-500 font-bold italic">Success</p>
                    <p className="text-xl font-black text-green-500">{status?.processed_count || 0}</p>
                  </div>
                  <div className="rounded-2xl bg-destructive/10 p-4 text-center">
                    <p className="text-[10px] uppercase tracking-wider text-destructive font-bold italic">Failed</p>
                    <p className="text-xl font-black text-destructive">{status?.error_count || 0}</p>
                  </div>
                </div>
              </div>

              {status?.errors_log && status.errors_log.length > 0 && (
                <div className="max-h-32 overflow-y-auto rounded-xl bg-destructive/5 p-4 space-y-1.5 border border-destructive/10">
                  {status.errors_log.map((err: string, i: number) => (
                    <div key={i} className="flex items-start gap-2 text-[11px] text-destructive font-medium">
                      <AlertCircle className="h-3 w-3 mt-0.5 shrink-0" />
                      <span>{err}</span>
                    </div>
                  ))}
                </div>
              )}

              {(status?.status === 'completed' || status?.status === 'failed') && (
                <button
                  onClick={onClose}
                  className={cn(
                    "w-full rounded-2xl py-3.5 text-sm font-bold text-white shadow-xl transition-all hover:scale-[1.02] active:scale-95",
                    status?.status === 'failed' ? "bg-destructive shadow-destructive/20 hover:bg-destructive/90" : "bg-primary shadow-primary/20 hover:bg-primary/90"
                  )}
                >
                  Done
                </button>
              )}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
