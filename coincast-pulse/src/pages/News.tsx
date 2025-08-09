import { Badge } from "@/components/ui/badge";
import { Clock, ExternalLink, Loader2, AlertCircle } from "lucide-react";
import Layout from "@/components/Layout";
import { useState, useEffect } from "react";
import { cryptoPanicApi, NewsItem } from "@/services/cryptoPanicApi";

const News = () => {
  const [newsArticles, setNewsArticles] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number | string>(1);
  const [nextPage, setNextPage] = useState<string | null>(null);

  useEffect(() => {
    fetchNews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchNews = async () => {
    try {
      setLoading(true);
      setError(null);
      const { items, next } = await cryptoPanicApi.getLatest(currentPage);
      setNewsArticles(items);
      setNextPage(next ?? null);
    } catch (err) {
      console.error('News fetch error:', err);
      setError('Failed to fetch news. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const formatTimeAgo = (pubDate: string) => {
    try {
      const now = new Date();
      const publishDate = new Date(pubDate);
      const diffInHours = Math.floor((now.getTime() - publishDate.getTime()) / (1000 * 60 * 60));
      
      if (diffInHours < 1) return 'Just now';
      if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
      
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
    } catch {
      return 'Recently';
    }
  };

  const getCategoryBadge = (categories?: string[]) => {
    if (!categories || categories.length === 0) return { label: 'Crypto', variant: 'secondary' as const };
    
    const category = categories[0].toLowerCase();
    if (category.includes('technology') || category.includes('tech')) {
      return { label: 'Technology', variant: 'secondary' as const };
    } else if (category.includes('business') || category.includes('finance')) {
      return { label: 'Business', variant: 'outline' as const };
    } else if (category.includes('politics') || category.includes('government')) {
      return { label: 'Regulation', variant: 'destructive' as const };
    } else {
      return { label: 'Crypto', variant: 'secondary' as const };
    }
  };

  const handleArticleClick = (link: string) => {
    if (link) {
      window.open(link, '_blank', 'noopener,noreferrer');
    }
  };

  const loadMoreNews = async () => {
    if (!nextPage) return;
    try {
      setLoading(true);
      const pageParam = new URL(nextPage, "https://cryptopanic.com").searchParams.get("page");
      const { items, next } = await cryptoPanicApi.getLatest(pageParam ?? undefined);
      setNewsArticles((prev) => [...prev, ...items]);
      setNextPage(next ?? null);
      setCurrentPage(pageParam ?? currentPage);
    } catch (err) {
      console.error('Load more error:', err);
    } finally {
      setLoading(false);
    }
  };

  const retryConnection = () => {
    setCurrentPage(1);
    setNewsArticles([]);
    setError(null);
    fetchNews();
  };

  if (loading && newsArticles.length === 0) {
    return (
      <Layout>
        <div className="min-h-screen px-4 py-16">
          <div className="max-w-4xl mx-auto space-y-12">
            <div className="text-center space-y-6 animate-fade-in">
              <h1 className="text-5xl md:text-6xl font-light tracking-tight">
                <span className="bg-gradient-secondary bg-clip-text text-transparent">
                  The LumiPanel Stream
                </span>
              </h1>
            </div>
            
            <div className="flex justify-center items-center py-20">
              <div className="flex items-center gap-3 text-muted-foreground">
                <Loader2 className="w-6 h-6 animate-spin" />
                <span>Loading latest crypto news...</span>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen px-4 py-16">
        <div className="max-w-4xl mx-auto space-y-12">
          {/* Page Header */}
          <div className="text-center space-y-6 animate-fade-in">
            <h1 className="text-5xl md:text-6xl font-light tracking-tight">
              <span className="bg-gradient-secondary bg-clip-text text-transparent">
                The LumiPanel Stream
              </span>
            </h1>
          </div>

          {/* API Status/Debug removed in favor of a simpler UX */}

          {/* Error Message */}
          {error && (
            <div className="flex items-center justify-between gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5" />
                <span>{error}</span>
              </div>
              <button
                onClick={retryConnection}
                className="px-3 py-1 bg-red-500/20 hover:bg-red-500/30 rounded text-sm transition-colors"
              >
                Retry
              </button>
            </div>
          )}

          {/* News List */}
          {newsArticles.length > 0 ? (
            <div className="space-y-6 animate-scale-in">
              {newsArticles.map((article, index) => {
                const badge = getCategoryBadge(article.category);
                
                return (
                  <div
                    key={`${article.id}-${index}`}
                    className="glass rounded-2xl p-8 space-y-4 category-card cursor-pointer
                             hover:bg-hover transition-all duration-300"
                    style={{ 
                      animationDelay: `${index * 100}ms`,
                      animation: 'fade-in 0.6s ease-out forwards'
                    }}
                    onClick={() => handleArticleClick(article.link)}
                  >
                    <div className="flex items-center justify-between flex-wrap gap-4">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Clock className="w-4 h-4" />
                        <span className="text-sm">{formatTimeAgo(article.pubDate)}</span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Badge 
                          variant={badge.variant}
                          className="rounded-pill"
                        >
                          {badge.label}
                        </Badge>
                        <ExternalLink className="w-4 h-4 text-muted-foreground" />
                      </div>
                    </div>

                    <h3 className="text-2xl font-semibold text-foreground hover:text-primary 
                                 transition-colors duration-300 line-clamp-2">
                      {article.title}
                    </h3>

                    <p className="text-muted-foreground leading-relaxed line-clamp-3">
                      {article.description}
                    </p>

                    {article.image_url && (
                      <div className="mt-4">
                        <img 
                          src={article.image_url} 
                          alt={article.title}
                          className="w-full h-48 object-cover rounded-lg"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : !loading && !error ? (
            <div className="text-center py-20">
              <div className="space-y-4">
                <AlertCircle className="w-16 h-16 text-muted-foreground mx-auto" />
                <h3 className="text-xl font-semibold text-foreground">No News Available</h3>
                <p className="text-muted-foreground">Check back later for the latest cryptocurrency news.</p>
              </div>
            </div>
          ) : null}

          {/* Load More Button */}
          {newsArticles.length > 0 && nextPage && (
            <div className="text-center pt-8">
              <button
                onClick={loadMoreNews}
                disabled={loading}
                className="px-6 py-3 bg-primary text-primary-foreground rounded-full
                         hover:bg-primary/90 transition-colors duration-300
                         disabled:opacity-50 disabled:cursor-not-allowed
                         flex items-center gap-2 mx-auto"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Loading...
                  </>
                ) : (
                  'Load More News'
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default News;