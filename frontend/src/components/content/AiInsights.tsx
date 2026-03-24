import { useEffect, useState } from "react";
import { Activity, Brain, Radio, Sparkles, Target, TrendingDown, TrendingUp } from "lucide-react";
import HeaderSettings from "../Header-settings";

export function AiInsights() {
  const [insight, setInsight] = useState<Record<string, unknown> | null>(null);
  const [insights, setInsights] = useState<Record<string, unknown>[]>([]);

  useEffect(() => {
    (async () => {
      const res = await fetch("http://localhost:8000/api/ai-insights");
      const data = await res.json();
      const raw = data?.choices?.[0]?.message?.content;
      const parsed = typeof raw === "string" ? (JSON.parse(raw) as Record<string, unknown>) : null;
      setInsight((prev) => ({ ...prev, ...parsed }));
      if (parsed) {
        setInsights((prev) => [...prev, parsed]);
      }
    })();
  }, []);

  function timeAgo() {
    const now = new Date();
    const time = now.getTime();

    return `${new Date(time).toLocaleString()}`;
  }
  return (
    <>
      <section className="ai-insights-container w-full text-white h-screen flex flex-col">
        <div className="ai-insights-header h-16 flex justify-between w-full p-3 bg-[#090E11] border-b border-[#1B232B]">
          <div className="flex flex-col">
            <h1 className="text-lg font-bold">AI Insights</h1>
            <p className="text-sm text-gray-100">Track your favorite cryptocurrencies</p>
          </div>
          <HeaderSettings />
        </div>
        <div className="ai-insights-content bg-black p-3 flex-1 border-b border-[#1B232B] overflow-y-auto">
          <div className="flex flex-col gap-6">
            {!insight ? (
              <p className="text-sm text-gray-100">Loading...</p>
            ) : (
              <div className="grid grid-cols-4 gap-3">
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
              <h2 className="mb-3 text-lg font-bold text-white">Latest insights{insights.length > 0}</h2>

              {insights.map((insight) => {
                return (
                  <article
                    key={String(insight?.news_created_at ?? "")}
                    className="rounded-2xl border border-[#1B232B] bg-[#050D14] p-5 mb-3"
                  >
                    <div className="flex gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#071B14]">
                        {insight?.market_status === "bullish" ? (
                          <TrendingUp className="h-6 w-6 text-[#00B65C]" />
                        ) : (
                          <TrendingDown className="h-6 w-6 text-[#00B65C]" />
                        )}
                      </div>
                      <div className="flex min-w-0 flex-1 flex-col gap-3">
                        <div className="flex flex-wrap items-start justify-between gap-2">
                          <h3 className="text-lg font-bold text-white">{String(insight?.title)}</h3>
                          <span className="rounded-full bg-[#071B14] px-3 py-1 text-xs font-semibold text-[#00B65C]">
                            {String(insight?.market_status)}
                          </span>
                        </div>
                        <p className="text-sm leading-relaxed text-[#8C98A5]">{String(insight?.standout_summary)}</p>
                        <div className="flex flex-wrap items-center gap-4 text-xs text-[#8C98A5]">
                          <span className="inline-flex items-center gap-1">
                            <Sparkles className="h-3.5 w-3.5 text-[#00B65C]" />
                            {`${insight?.ai_confidence}%`}
                          </span>
                          <span>{timeAgo()}</span>
                          <span className="rounded-full border border-[#1B232B] px-2 py-0.5 font-semibold uppercase tracking-wide text-white">
                            {String(insight?.coin_name)}
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
