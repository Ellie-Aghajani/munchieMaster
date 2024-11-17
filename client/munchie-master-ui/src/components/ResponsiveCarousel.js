import React from "react";
import { Carousel } from "antd";
import RecipeCard from "./RecipeCard";
import "./carouselStyles.css"; // Ensure styles for arrows, dots, and spacing are here

const ResponsiveCarousel = ({
  recipes,
  userLikedRecipes,
  userSavedRecipes,
  onLike,
  onSave,
}) => {
  const settings = {
    dots: true,
    arrows: true,
    infinite: false,
    speed: 500,
    slidesToShow: 4,
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
    <div style={{ padding: "20px", position: "relative" }}>
      <Carousel {...settings} className="custom-carousel">
        {recipes.map((recipe) => (
          <div
            key={recipe._id}
            style={{
              padding: "10px", // Space between cards
              boxSizing: "border-box",
            }}
          >
            <RecipeCard
              recipe={recipe}
              userLikedRecipes={userLikedRecipes}
              userSavedRecipes={userSavedRecipes}
              onLike={onLike}
              onSave={onSave}
            />
          </div>
        ))}
      </Carousel>
    </div>
  );
};

export default ResponsiveCarousel;
