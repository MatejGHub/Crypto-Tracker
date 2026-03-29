import { Sparkles } from "lucide-react";
import { useEffect, useState } from "react";

export function News() {
  const [news, setNews] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const timeAgo = (date: string) => {
    const m = Math.floor((Date.now() - new Date(date).getTime()) / 60000);
    if (m < 1) return "now";
    if (m < 60) return `${m}m ago`;
    const h = Math.floor(m / 60);
    if (h < 24) return `${h}h ago`;
    return `${Math.floor(h / 24)}d ago`;
  };

  async function getNews() {
    const url = "https://cryptocurrency.cv/api/news";
    try {
      const response = await fetch(url);
      if (!response.ok) {
        return { items: [], error: `News API error (${response.status})` };
      }
      const data = await response.json();
      const articles = Array.isArray(data?.articles) ? data.articles : Array.isArray(data) ? data : [];
      return { items: articles, error: "" };
    } catch {
      return { items: [], error: "News source unavailable right now." };
    }
  }

  useEffect(() => {
    const loadNews = async () => {
      setIsLoading(true);
      const result = await getNews();
      setNews(result.items ?? []);
      setErrorMessage(result.error ?? "");
      setIsLoading(false);
    };

    loadNews();

    const id = setInterval(loadNews, 1000 * 60 * 60 * 24);

    return () => clearInterval(id);
  }, []);
  return (
    <>
      <div className="flex flex-row gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Sparkles className="h-4 w-4" />
        </div>
        <div className="flex flex-col">
          <h2 className="text-lg font-bold">News</h2>
          <p className="text-sm text-gray-100">Get the latest news from the world of crypto</p>
        </div>
      </div>
      <div className="news-container mt-3 flex flex-col gap-3">
        {isLoading ? <p className="text-sm text-[#8C98A5]">Loading news...</p> : null}
        {!isLoading && errorMessage ? <p className="text-sm text-[#FF3B5C]">{errorMessage}</p> : null}
        {!isLoading && !errorMessage && news.length === 0 ? (
          <p className="text-sm text-[#8C98A5]">No news available at the moment.</p>
        ) : null}
        {news.slice(0, 3).map((newsItem) => {
          return (
            <article
              className="news-item group rounded-xl border border-[#1B232B] bg-[#0B1620] p-4 transition-colors duration-200 hover:border-[#00B65C]/50"
              key={newsItem.title}
            >
              <h3 className="text-sm font-semibold leading-snug text-white">{newsItem.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-[#8C98A5]">{newsItem.description}</p>
              <a
                className="cursor-pointer mt-3 inline-flex w-fit text-sm font-medium text-[#00B65C] hover:text-[#00D26A]"
                href={newsItem.link}
                target="_blank"
                rel="noopener noreferrer"
              >
                Read more
              </a>
              <p className="mt-2 text-xs text-[#8C98A5]">{timeAgo(newsItem.publishedAt ?? newsItem.pubDate)}</p>
            </article>
          );
        })}
      </div>
    </>
  );
}

export default News;
