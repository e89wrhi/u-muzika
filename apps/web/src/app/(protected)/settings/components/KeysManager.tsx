'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Key, Copy, Trash, Plus, Check } from 'lucide-react';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function KeysManager({ initialKeys }: { initialKeys: any[] }) {
  const [keys, setKeys] = useState(initialKeys);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [newKey, setNewKey] = useState<{ id: string; key: string } | null>(
    null
  );

  async function handleGenerate() {
    setIsGenerating(true);
    try {
      const res = await fetch('/api/access-keys', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          label: `Key ${new Date().toLocaleDateString()}`,
        }),
      });
      if (!res.ok) throw new Error('Failed to generate key');
      const data = await res.json();

      setNewKey(data);
      // Fetch latest list
      const listRes = await fetch('/api/access-keys');
      if (listRes.ok) {
        setKeys((await listRes.json()).keys);
      }
      toast.success('New API key generated');
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setIsGenerating(false);
    }
  }

  async function handleRevoke(id: string) {
    if (!confirm('Are you sure you want to revoke this key?')) return;
    try {
      const res = await fetch('/api/access-keys', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) throw new Error('Failed to revoke key');

      setKeys(keys.filter((k) => k.id !== id));
      toast.success('Key revoked successfully');
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      toast.error(err.message);
    }
  }

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
    toast.success('Copied to clipboard');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold tracking-tight">API Keys</h2>
        <Button
          onClick={handleGenerate}
          disabled={isGenerating}
          size="sm"
          className="rounded-full shadow-lg"
        >
          <Plus className="w-4 h-4 mr-2" />
          Generate New Key
        </Button>
      </div>

      <p className="text-sm text-neutral-500 max-w-lg mb-4">
        Use these keys to access our API endpoints securely. Do not share them
        publicly. Note: You will only be able to view the full key once upon
        creation.
      </p>

      {newKey && (
        <div className="p-4 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 rounded-xl mb-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-emerald-800 dark:text-emerald-400">
              Your New Secret Key
            </h3>
            <span className="text-xs text-emerald-600 dark:text-emerald-500 bg-emerald-100 dark:bg-emerald-500/20 px-2 py-0.5 rounded-full font-medium">
              Please copy now
            </span>
          </div>
          <div className="flex gap-2">
            <input
              readOnly
              value={newKey.key}
              className="px-3 py-2 text-sm font-mono w-full bg-white dark:bg-black/50 border border-emerald-200 dark:border-emerald-500/20 rounded-lg text-neutral-800 dark:text-neutral-200"
            />
            <Button
              variant="outline"
              className="shrink-0 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-500/20 border-emerald-200 dark:border-emerald-500/20"
              onClick={() => copyToClipboard(newKey.key, newKey.id)}
            >
              {copiedId === newKey.id ? (
                <Check className="w-4 h-4" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>
      )}

      {keys.length === 0 ? (
        <div className="text-center py-12 bg-neutral-50 dark:bg-neutral-900/40 rounded-xl border border-dashed border-neutral-200 dark:border-neutral-800">
          <Key className="w-8 h-8 mx-auto text-neutral-400 mb-3" />
          <p className="text-sm text-neutral-500">
            You don&apos;t have any active API keys yet.
          </p>
        </div>
      ) : (
        <div className="divide-y divide-neutral-200 dark:divide-neutral-800 border border-neutral-200 dark:border-neutral-800 rounded-2xl overflow-hidden bg-white/50 dark:bg-neutral-900/50 backdrop-blur">
          {keys.map((k) => (
            <div
              key={k.id}
              className="p-4 flex items-center justify-between hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors"
            >
              <div>
                <p className="font-semibold text-sm text-neutral-800 dark:text-neutral-200">
                  {k.label}
                </p>
                <div className="flex items-center gap-3 mt-1 text-xs text-neutral-500 font-mono">
                  <span>umk_••••••••••••••••••••••••</span>
                  {k.last_used_at ? (
                    <span>
                      Last used {new Date(k.last_used_at).toLocaleDateString()}
                    </span>
                  ) : (
                    <span className="text-orange-500/90 dark:text-orange-400/90">
                      Never used
                    </span>
                  )}
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleRevoke(k.id)}
                className="text-neutral-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-full"
              >
                <Trash className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
