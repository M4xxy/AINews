import "../styles/NewsCard.css";
import placeholder from "../assets/no-image.jpeg";

export default function NewsCard({ title, url, date, source, image }) {
  return (
    <div className="news-card">
      {image && 
      <img  src={image || placeholder}  
            alt={title} 
            className="news-image" 
            onError={(e) => (e.target.src = placeholder)}/>}
      <div className="news-content">
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="news-title"
        >
          {title}
        </a>
        <p className="news-meta">
          {new Date(date).toLocaleString()} – {source}
        </p>
      </div>
    </div>
  );
}
