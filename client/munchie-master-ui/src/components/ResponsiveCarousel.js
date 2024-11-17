import React from "react";
import { Carousel } from "antd";
import RecipeCard from "./RecipeCard";
import "./carouselStyles.css"; // Create this file to style arrows and carousel

const ResponsiveCarousel = ({ recipes }) => {
  const settings = {
    dots: true,
    arrows: true,
    infinite: false,
    speed: 500,
    slidesToShow: 4, // Default number of slides
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1200, // Desktop
        settings: { slidesToShow: 3 },
      },
      {
        breakpoint: 992, // Laptop
        settings: { slidesToShow: 2 },
      },
      {
        breakpoint: 768, // Tablet
        settings: { slidesToShow: 1 },
      },
    ],
  };

  return (
    <Carousel {...settings}>
      {recipes.map((recipe) => (
        <div key={recipe._id}>
          <RecipeCard recipe={recipe} />
        </div>
      ))}
    </Carousel>
  );
};

export default ResponsiveCarousel;
