import React from "react";
import '../style/card.css'

const Card = ({ imageSrc, title, authorImage, authorName, date, description }) => {
 return (
    <div className="card">
      <img src={imageSrc} alt={title} className="card-image" />
      <h2 className="card-title">{title}</h2>
      <div className="card-meta">
        <img src={authorImage} alt={authorName} className="author-image" />
        <span className="author-name">{authorName}</span>
        <span className="date">{date}</span>
      </div>
      <p className="card-description">{description}</p>
    </div>
 )
};

export default Card;