import React from 'react';
import Card from './Card';
import '../style/card.css';

const CardContainer = ({ cards }) => {
  return (
    <div className="card-container">
      {cards.map((card, index) => (
        <a href='#'>
            <Card
                key={index}
                imageSrc={card.imageSrc}
                title={card.title}
                authorImage={card.authorImage}
                authorName={card.authorName}
                date={card.date}
                description={card.description}
            />
        </a>
      ))}
    </div>
  );
};

export default CardContainer;
