import { useEffect, useState } from "react";
import { Activity, Brain, Radio, Sparkles, Target, TrendingDown, TrendingUp } from "lucide-react";
import HeaderSettings from "../Header-settings";

export function AiInsights() {
  const [insight, setInsight] = useState<Record<string, unknown> | null>(null);
  const [insights, setInsights] = useState<Record<string, unknown>[]>([]);
  const [historyPage, setHistoryPage] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    (async () => {
      const res = await fetch("http://localhost:8000/api/ai-insights");
      const data = await res.json();
      const raw = data?.choices?.[0]?.message?.content;
      const parsed = typeof raw === "string" ? (JSON.parse(raw) as Record<string, unknown>) : null;
      setInsight((prev) => ({ ...prev, ...parsed }));
    })();
  }, []);

  function timeAgo() {
    const now = new Date();
    const time = now.getTime();

    return `${new Date(time).toLocaleString()}`;
  }

  useEffect(() => {
    const getAiInsightsHistory = async () => {
      const page = historyPage;
      const response = await fetch(`http://localhost:8000/api/ai-insights-history?page=${page}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({}),
      });

      const data = await response.json();
      const pagePayload = data?.aiInsights;
      if (!pagePayload?.data) {
        setInsights([]);
        return;
      }
      setCurrentPage(pagePayload.current_page);
      setLastPage(pagePayload.last_page);
      setTotal(pagePayload.total);
      setInsights(Array.isArray(pagePayload.data) ? pagePayload.data : []);
    };

    getAiInsightsHistory();
  }, [historyPage]);
  return (
    <>
      <section className="ai-insights-container flex h-full w-full min-h-0 flex-col overflow-y-auto bg-black text-white">
        <div className="ai-insights-header flex h-16 w-full items-center justify-between border-b border-[#1B232B] bg-[#090E11] px-3">
          <div className="flex flex-col">
            <h1 className="text-lg font-bold">AI Insights</h1>
            <p className="text-sm text-gray-100">Track your favorite cryptocurrencies</p>
          </div>
          <HeaderSettings />
        </div>
        <div className="ai-insights-content min-h-0 flex-1 border-b border-[#1B232B] bg-black p-3">
          <div className="flex flex-col gap-6">
            {!insight ? (
              <p className="text-sm text-gray-100">Loading...</p>
            ) : (
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
                <article className="rounded-2xl border border-[#1B232B] bg-[#050D14] px-5 py-6">
                  <div className="flex items-center gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#071B14]">
                      <Activity className="h-5 w-5 text-[#00B65C]" />
                    </div>
                    <div className="min-w-0 flex flex-col">
                      <p className="text-[1rem] text-[#8C98A5]">Market</p>
                      <p className="text-[1.2rem] font-bold capitalize leading-none text-white">
                        {String(insight?.market_status ?? "—")}{" "}
                        <span
                          className={
                            typeof insight?.market_change_percent === "number" && insight.market_change_percent < 0
                              ? "text-[#FF3B5C]"
                              : "text-[#00B65C]"
                          }
                        >
                          {typeof insight?.market_change_percent === "number" ? `${insight.market_change_percent}%` : "—"}
                        </span>
                      </p>
                    </div>
                  </div>
                </article>
                <article className="rounded-2xl border border-[#1B232B] bg-[#050D14] px-5 py-6">
                  <div className="flex items-center gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#071B14]">
                      <Brain className="h-5 w-5 text-[#00B65C]" />
                    </div>
                    <div className="min-w-0 flex flex-col">
                      <p className="text-[1rem] text-[#8C98A5]">AI confidence</p>
                      <p className="text-[1.2rem] font-bold leading-none text-white">
                        {typeof insight?.ai_confidence === "number" ? `${insight.ai_confidence}%` : "—"}
                      </p>
                    </div>
                  </div>
                </article>
                <article className="rounded-2xl border border-[#1B232B] bg-[#050D14] px-5 py-6">
                  <div className="flex items-center gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#071B14]">
                      <Radio className="h-5 w-5 text-[#00B65C]" />
                    </div>
                    <div className="min-w-0 flex flex-col">
                      <p className="text-[1rem] text-[#8C98A5]">Active signals</p>
                      <p className="text-[1.2rem] font-bold leading-none text-white">
                        {Array.isArray(insight?.active_signals) ? insight.active_signals.length : "—"}
                      </p>
                    </div>
                  </div>
                </article>
                <article className="rounded-2xl border border-[#1B232B] bg-[#050D14] px-5 py-6">
                  <div className="flex items-center gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#071B14]">
                      <Target className="h-5 w-5 text-[#00B65C]" />
                    </div>
                    <div className="min-w-0 flex flex-col">
                      <p className="text-[1rem] text-[#8C98A5]">Accuracy</p>
                      <p className="text-[1.2rem] font-bold leading-none text-white">
                        {typeof insight?.accuracy === "number" ? `${insight.accuracy}%` : "—"}
                      </p>
                    </div>
                  </div>
                </article>
              </div>
            )}
            <section className="latest-insights">
              <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                <h2 className="text-lg font-bold text-white">Latest insights{total > 0 ? ` (${total} total)` : ""}</h2>
                <div className="flex flex-wrap items-center gap-2 text-sm text-[#8C98A5]">
                  <button
                    type="button"
                    className="rounded-lg border border-[#1B232B] bg-[#050D14] px-3 py-1.5 font-medium text-white transition hover:bg-[#1B232B] disabled:cursor-not-allowed disabled:opacity-40"
                    onClick={() => setHistoryPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage <= 1}
                  >
                    Previous
                  </button>
                  <span className="tabular-nums">
                    {currentPage} / {lastPage}
                  </span>
                  <button
                    type="button"
                    className="rounded-lg border border-[#1B232B] bg-[#050D14] px-3 py-1.5 font-medium text-white transition hover:bg-[#1B232B] disabled:cursor-not-allowed disabled:opacity-40"
                    onClick={() => setHistoryPage((p) => p + 1)}
                    disabled={currentPage >= lastPage}
                  >
                    Next
                  </button>
                </div>
              </div>

              {insights.map((row) => {
                return (
                  <article key={String(row?.id)} className="rounded-2xl border border-[#1B232B] bg-[#050D14] p-5 mb-3">
                    <div className="flex gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#071B14]">
                        {row?.market_status === "bullish" ? (
                          <TrendingUp className="h-6 w-6 text-[#00B65C]" />
                        ) : (
                          <TrendingDown className="h-6 w-6 text-[#00B65C]" />
                        )}
                      </div>
                      <div className="flex min-w-0 flex-1 flex-col gap-3">
                        <div className="flex flex-wrap items-start justify-between gap-2">
                          <h3 className="text-lg font-bold text-white">{String(row?.title)}</h3>
                          <span className="rounded-full bg-[#071B14] px-3 py-1 text-xs font-semibold text-[#00B65C]">
                            {String(row?.market_status)}
                          </span>
                        </div>
                        <p className="text-sm leading-relaxed text-[#8C98A5]">{String(row?.standout_summary)}</p>
                        <div className="flex flex-wrap items-center gap-4 text-xs text-[#8C98A5]">
                          <span className="inline-flex items-center gap-1">
                            <Sparkles className="h-3.5 w-3.5 text-[#00B65C]" />
                            {`${row?.ai_confidence}%`}
                          </span>
                          <span>{timeAgo()}</span>
                          <span className="rounded-full border border-[#1B232B] px-2 py-0.5 font-semibold uppercase tracking-wide text-white">
                            {String(row?.coin_name)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </section>
          </div>
        </div>
      </section>
    </>
  );
}

export default AiInsights;
