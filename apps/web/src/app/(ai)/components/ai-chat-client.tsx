'use client';

import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import { useEffect, useRef, useState } from 'react';
import {
  Send,
  Bot,
  User,
  ArrowLeft,
  Loader2,
  Sparkles,
  AlertCircle,
  Coins,
  Key,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { toast } from 'sonner';

interface AIChatClientProps {
  id: string;
  contextType: 'video' | 'album';
}

export function AIChatClient({ id, contextType }: AIChatClientProps) {
  const [input, setInput] = useState('');
  const [credits, setCredits] = useState<number | null>(null);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [accessKey, setAccessKey] = useState('');
  const [isRedeeming, setIsRedeeming] = useState(false);

  // Fetch initial credits
  useEffect(() => {
    fetch('/api/credits/balance')
      .then((r) => r.json())
      .then((d) => {
        if (d.credits !== undefined) setCredits(d.credits);
      })
      .catch(console.error);
  }, []);

  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({
      api: '/api/chat',
      body: {
        id,
        contextType,
      },
    }),
    onError: (err) => {
      // If the backend returns our 402 error (parsed from transport)
      if (err.message.includes('Insufficient credits')) {
        setShowUpgradeModal(true);
      } else {
        toast.error('An error occurred: ' + err.message);
      }
    },
  });

  const isLoading = status === 'submitted' || status === 'streaming';

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    if (credits !== null && credits <= 0) {
      setShowUpgradeModal(true);
      return;
    }

    sendMessage({ text: input });
    setInput('');
  };

  const handleRedeemKey = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!accessKey.trim()) return;

    setIsRedeeming(true);
    try {
      // Call redeem endpoint
      const res = await fetch('/api/credits/redeem', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: accessKey.trim() }),
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Failed to redeem key');

      setCredits(data.newBalance);
      toast.success(`Redeemed successfully! Added ${data.added} credits.`);
      setShowUpgradeModal(false);
      setAccessKey('');
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setIsRedeeming(false);
    }
  };

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const defaultVideoQuestions = [
    'What is this song about?',
    'Rate this song out of 10.',
    'Summarize the transcript of this video.',
    'Who is the artist?',
  ];

  const defaultAlbumQuestions = [
    'What is the overall theme of this album?',
    'What are the standout tracks from this collection?',
    'Can you rate this album and explain why?',
    'Who are the featured artists?',
  ];

  const questions =
    contextType === 'video' ? defaultVideoQuestions : defaultAlbumQuestions;

  const handleSuggestionClick = (question: string) => {
    if (credits !== null && credits <= 0) {
      setShowUpgradeModal(true);
      return;
    }
    sendMessage({ text: question });
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden max-w-4xl mx-auto w-full relative">
      {/* Insufficient Credits Modal */}
      {showUpgradeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl p-8 max-w-md w-full shadow-2xl relative">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400 rounded-full flex items-center justify-center mb-6 mx-auto">
              <AlertCircle className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-black text-center mb-2">
              Out of Credits
            </h2>
            <p className="text-neutral-500 text-center mb-8">
              You need more credits to continue chatting with the AI. Upgrade
              your plan or redeem an access key.
            </p>

            <div className="space-y-4">
              <form action="/api/stripe/checkout" method="POST">
                <input type="hidden" name="plan" value="PRO" />
                <Button
                  type="submit"
                  className="w-full h-12 bg-neutral-900 text-white hover:bg-neutral-800 dark:bg-white dark:text-black rounded-xl font-bold"
                >
                  <Coins className="w-4 h-4 mr-2" /> Upgrade to Pro
                </Button>
              </form>

              <div className="relative flex items-center py-2">
                <div className="flex-grow border-t border-neutral-200 dark:border-neutral-800"></div>
                <span className="flex-shrink-0 mx-4 text-neutral-400 text-xs uppercase font-medium">
                  Or redeem key
                </span>
                <div className="flex-grow border-t border-neutral-200 dark:border-neutral-800"></div>
              </div>

              <form onSubmit={handleRedeemKey} className="flex gap-2">
                <div className="relative flex-1">
                  <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                  <input
                    value={accessKey}
                    onChange={(e) => setAccessKey(e.target.value)}
                    placeholder="Enter access code..."
                    className="w-full h-10 pl-9 pr-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-black text-sm outline-none focus:border-red-500"
                  />
                </div>
                <Button
                  type="submit"
                  disabled={isRedeeming || !accessKey.trim()}
                  variant="secondary"
                  className="h-10 rounded-xl"
                >
                  Redeem
                </Button>
              </form>
            </div>

            <button
              onClick={() => setShowUpgradeModal(false)}
              className="absolute top-4 right-4 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between p-4 md:p-6 backdrop-blur-xl sticky top-0 z-10 shrink-0 border-b border-white/10">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild className="rounded-full">
            <Link href={contextType === 'video' ? `/v/${id}` : `/al/${id}`}>
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-red-600 dark:text-red-400">
              <Bot className="h-6 w-6" />
            </div>
            <div>
              <h1 className="font-bold text-lg leading-tight dark:text-white mt-1">
                U-Muzika AI
              </h1>
              <p className="text-xs text-neutral-500 font-medium uppercase tracking-wider">
                Chatting about this {contextType}
              </p>
            </div>
          </div>
        </div>

        {/* Realtime Credits Target UI */}
        {credits !== null && (
          <div className="flex items-center gap-2 bg-neutral-100 dark:bg-neutral-900 px-3 py-1.5 rounded-full border border-neutral-200 dark:border-neutral-800">
            <Coins className="w-4 h-4 text-orange-500" />
            <span className="text-sm font-bold font-mono">{credits}</span>
          </div>
        )}
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center space-y-8 animate-in fade-in duration-1000 pb-20">
            <div className="h-24 w-24 rounded-full bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center shadow-2xl shadow-red-500/30">
              <Sparkles className="h-10 w-10 text-white" />
            </div>
            <div className="max-w-md space-y-2">
              <h2 className="text-3xl font-black tracking-tighter dark:text-white">
                How can I help?
              </h2>
              <p className="text-neutral-500 font-medium leading-relaxed">
                I have access to the{' '}
                {contextType === 'video'
                  ? 'video details and transcript'
                  : 'album tracks and details'}
                . Ask me anything!
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-2xl mt-8">
              {questions.map((q, i) => (
                <button
                  key={i}
                  onClick={() => handleSuggestionClick(q)}
                  className="p-4 text-left rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 hover:border-red-500 dark:hover:border-red-500 hover:shadow-lg transition-all group duration-300"
                >
                  <p className="text-sm font-semibold text-neutral-700 dark:text-neutral-300 group-hover:text-red-600 dark:group-hover:text-red-400">
                    &quot;{q}&quot;
                  </p>
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((m) => (
            <div
              key={m.id}
              className={`flex items-start gap-3 md:gap-4 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <div
                className={`h-8 w-8 md:h-10 md:w-10 shrink-0 rounded-full flex items-center justify-center shadow-md ${
                  m.role === 'user'
                    ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900'
                    : 'bg-red-100 text-red-600 dark:bg-red-900/40 dark:text-red-400'
                }`}
              >
                {m.role === 'user' ? (
                  <User className="h-4 w-4 md:h-5 md:w-5" />
                ) : (
                  <Bot className="h-4 w-4 md:h-5 md:w-5" />
                )}
              </div>
              <div
                className={`px-4 py-3 md:px-6 md:py-4 rounded-[1.5rem] max-w-[85%] text-[15px] leading-relaxed shadow-sm whitespace-pre-wrap ${
                  m.role === 'user'
                    ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 rounded-tr-sm'
                    : 'bg-white text-neutral-800 border border-neutral-200 dark:bg-neutral-900 dark:border-neutral-800 dark:text-neutral-200 rounded-tl-sm'
                }`}
              >
                {m.parts
                  ?.map((p) => (p.type === 'text' ? p.text : ''))
                  .join('')}
              </div>
            </div>
          ))
        )}

        {isLoading && (
          <div className="flex items-start gap-3 md:gap-4">
            <div className="h-8 w-8 md:h-10 md:w-10 shrink-0 rounded-full bg-red-100 text-red-600 dark:bg-red-900/40 dark:text-red-400 flex items-center justify-center shadow-md">
              <Bot className="h-4 w-4 md:h-5 md:w-5" />
            </div>
            <div className="px-5 py-3 md:px-6 md:py-4 rounded-[1.5rem] bg-white text-neutral-800 border border-neutral-200 dark:bg-neutral-900 dark:border-neutral-800 dark:text-neutral-200 rounded-tl-sm flex items-center gap-3">
              <Loader2 className="h-4 w-4 md:h-5 md:w-5 animate-spin text-red-600 dark:text-red-400" />
              <span className="text-sm font-medium animate-pulse text-neutral-500">
                Thinking...
              </span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} className="h-4" />
      </div>

      {/* Input Form */}
      <div className="p-4 md:p-6 bg-neutral-50 dark:bg-black shrink-0 relative before:content-[''] before:absolute before:inset-x-0 before:bottom-full before:h-12 before:bg-gradient-to-t before:from-neutral-50/90 dark:before:from-black/90 before:to-transparent before:pointer-events-none">
        <form
          onSubmit={handleSubmit}
          className="flex relative items-center w-full max-w-3xl mx-auto rounded-[2rem] bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 focus-within:ring-2 focus-within:ring-red-500/50 focus-within:border-red-500 transition-all overflow-hidden p-1 shadow-[0_8px_30px_rgb(0,0,0,0.08)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.3)]"
        >
          <input
            value={input}
            onChange={handleInputChange}
            placeholder="Ask anything about this..."
            className="flex-1 bg-transparent px-5 py-3 outline-none placeholder:text-neutral-400 font-medium text-neutral-900 dark:text-white"
            disabled={isLoading}
          />
          <Button
            type="submit"
            disabled={isLoading || !input.trim()}
            size="icon"
            className="rounded-full h-10 w-10 shrink-0 bg-red-600 hover:bg-red-700 text-white transition-all mr-1 disabled:opacity-50 disabled:bg-neutral-300 dark:disabled:bg-neutral-800"
          >
            <Send className="h-4 w-4" />
          </Button>
        </form>
        <p className="text-center text-[10px] text-neutral-400 md:mt-3 mt-2 font-medium tracking-wide uppercase">
          AI can make mistakes. Provide feedback to help us improve.
        </p>
      </div>
    </div>
  );
}
