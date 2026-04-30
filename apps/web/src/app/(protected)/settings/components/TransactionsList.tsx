'use client';

import { Activity, ArrowDownRight, ArrowUpRight } from 'lucide-react';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function TransactionsList({ transactions }: { transactions: any[] }) {
  if (!transactions || transactions.length === 0) {
    return (
      <div className="text-center py-10 bg-neutral-50 dark:bg-neutral-900/40 rounded-xl border border-dashed border-neutral-200 dark:border-neutral-800">
        <Activity className="w-8 h-8 mx-auto text-neutral-400 mb-3" />
        <p className="text-sm text-neutral-500">
          No recent credit transactions found.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold">Credit History</h2>
        <span className="text-xs font-medium text-neutral-500 bg-neutral-100 dark:bg-neutral-800 px-2.5 py-1 rounded-full text-center">
          Last 20
        </span>
      </div>

      <div className="space-y-3">
        {transactions.map((tx) => (
          <div
            key={tx.id}
            className="flex items-center justify-between p-4 bg-white/60 dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-800 rounded-xl"
          >
            <div className="flex items-center gap-4">
              <div
                className={`p-2 rounded-full ${
                  tx.amount > 0
                    ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400'
                    : 'bg-rose-100 text-rose-600 dark:bg-rose-500/20 dark:text-rose-400'
                }`}
              >
                {tx.amount > 0 ? (
                  <ArrowUpRight className="w-4 h-4" />
                ) : (
                  <ArrowDownRight className="w-4 h-4" />
                )}
              </div>
              <div>
                <p className="font-semibold text-sm capitalize">
                  {tx.action.replace(/_/g, ' ')}
                </p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-xs text-neutral-500">
                    {new Date(tx.created_at).toLocaleString()}
                  </span>
                  {tx.metadata?.contextType && (
                    <span className="text-[10px] font-medium text-neutral-400 uppercase border border-neutral-200 dark:border-neutral-800 rounded-sm px-1 shrink-0">
                      {tx.metadata.contextType}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div
              className={`font-mono font-bold text-base whitespace-nowrap ${
                tx.amount > 0
                  ? 'text-emerald-600 dark:text-emerald-400'
                  : 'text-neutral-900 dark:text-neutral-200'
              }`}
            >
              {tx.amount > 0 ? '+' : ''}
              {tx.amount}{' '}
              <span className="text-xs opacity-60 font-sans ml-0.5">CR</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
