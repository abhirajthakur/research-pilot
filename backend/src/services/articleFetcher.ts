export type Article = {
  title: string;
  url: string;
  content: string;
};

interface NewsResponse {
  status: string;
  totalResults: number;
  articles: {
    source: { id: string | null; name: string };
    author: string;
    title: string;
    description: string;
    url: string;
    urlToImage: string;
    publisedAt: string;
    content: string;
  }[];
}

const NEWS_API_KEY = process.env.NEWS_API_KEY || "";

export async function fetchArticles(topic: string): Promise<Article[]> {
  const endpoint = `https://newsapi.org/v2/everything?q=${encodeURIComponent(topic)}&language=en&pageSize=10`;

  try {
    const response = await fetch(endpoint, {
      headers: {
        "X-Api-Key": NEWS_API_KEY,
      },
    });

    const data = (await response.json()) as NewsResponse;

    if (!data.articles || data.articles.length === 0) {
      console.log(`No articles found for topic: "${topic}"`);
      return [];
    }

    const articles = data.articles.slice(0, 5).map((article) => ({
      title: article.title,
      url: article.url,
      content: article.content,
    }));

    return articles;
  } catch (error) {
    console.error("Error fetching articles:", error);
    return [];
  }
}
