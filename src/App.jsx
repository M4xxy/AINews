import { useEffect, useState } from "react";
import NewsCard from "./components/NewsCard";
import "./styles/App.css";

const categories = ["AI", "Machine Learning", "Robotics"];

export default function App() {
  const [news, setNews] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("AI");

  useEffect(() => {
    async function fetchNews() {
      try {
        const api1 = fetch(
          `https://newsapi.org/v2/everything?q=${category}&apiKey=e844642b1c50473d8766cd2ca4dea847`
        ).then((res) => res.json());

        const api2 = fetch(
          `https://content.guardianapis.com/search?q=${category}&api-key=6761175a-9f6b-4adb-ad8c-52e21756af91`
        ).then((res) => res.json());

        const api3 = fetch(
          `https://api.nytimes.com/svc/search/v2/articlesearch.json?q=${category}&api-key=UiyilFMltbGYukinBOqCanyDR3YG5YZ7`
        ).then((res) => res.json());

        const [data1, data2, data3] = await Promise.all([api1, api2, api3]);

        const formatted = [
          ...(data1.articles || []).map((n) => ({
            title: n.title,
            url: n.url,
            date: n.publishedAt,
            image: n.urlToImage,
            source: "NewsAPI",
          })),
          ...(data2.response?.results || []).map((n) => ({
            title: n.webTitle,
            url: n.webUrl,
            date: n.webPublicationDate,
            image: n.fields?.thumbnail,
            source: "The Guardian",
          })),
          ...(data3.response?.docs || []).map((n) => ({
            title: n.headline.main,
            url: n.web_url,
            date: n.pub_date,
            image: n.multimedia?.[0]
              ? `https://www.nytimes.com/${n.multimedia[0].url}`
              : null,
            source: "NYTimes",
          })),
        ];

        setNews(formatted);
      } catch (err) {
        console.error("Error fetching news:", err);
      }
    }
    fetchNews();
  }, [category]);

  const filteredNews = news.filter((item) =>
    item.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>      
      <header className="top-bar">
        <h1 className="app-title">📰 AI News Portal</h1>

        {/* Category Buttons */}
        <div className="categories">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`category-btn ${category === cat ? "active-category" : ""}`}
              onClick={() => setCategory(cat)}   // ✅ correct now
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="search-container">
          <input
            type="text"
            placeholder="Search news..."
            className="search-input"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </header>

      <div className="app-container">
        <div className="news-grid">
          {filteredNews.length > 0 ? (
            filteredNews.map((item, index) => (
              <NewsCard
                key={index}
                title={item.title}
                url={item.url}
                date={item.date}
                image={item.image}
                source={item.source}
              />
            ))
          ) : (
            <p className="no-news">No news found.</p>
          )}
        </div>
      </div>
    </>
  );
}
