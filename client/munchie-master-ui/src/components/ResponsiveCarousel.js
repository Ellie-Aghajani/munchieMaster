import React, { useEffect, useRef, useState } from "react";
import { Box, IconButton, Stack } from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import RecipeCard from "./RecipeCard";

const GAP = 24; // px between cards

// Visible cards per breakpoint; on phones the next card peeks in
const slideWidth = {
  xs: "85%",
  sm: `calc((100% - ${GAP}px) / 2)`,
  md: `calc((100% - ${GAP * 2}px) / 3)`,
  lg: `calc((100% - ${GAP * 3}px) / 4)`,
};

const arrowSx = {
  backgroundColor: "common.white",
  color: "primary.main",
  boxShadow: (theme) => theme.customShadows.soft,
  "&:hover": { backgroundColor: "accent.main", color: "accent.contrastText" },
};

const ResponsiveCarousel = ({
  recipes,
  userLikedRecipes,
  userSavedRecipes,
  onLike,
  onSave,
  onDelete,
}) => {
  const trackRef = useRef(null);
  const [canScroll, setCanScroll] = useState(false);

  // Only show the arrows when the cards don't all fit
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const update = () =>
      setCanScroll(track.scrollWidth > track.clientWidth + 1);
    update();
    const observer = new ResizeObserver(update);
    observer.observe(track);
    return () => observer.disconnect();
  }, [recipes.length]);

  const scrollBySlide = (direction) => {
    const track = trackRef.current;
    const slide = track?.firstElementChild;
    if (!slide) return;
    track.scrollBy({
      left: direction * (slide.offsetWidth + GAP),
      behavior: "smooth",
    });
  };

  return (
    <Box>
      <Box
        ref={trackRef}
        sx={{
          display: "flex",
          gap: `${GAP}px`,
          overflowX: "auto",
          scrollSnapType: "x mandatory",
          scrollbarWidth: "none",
          "&::-webkit-scrollbar": { display: "none" },
          // Room for the card hover lift and shadow
          pt: 1,
          pb: 2,
        }}
      >
        {recipes.map((recipe) => (
          <Box
            key={recipe._id}
            sx={{
              flex: "0 0 auto",
              width: slideWidth,
              scrollSnapAlign: "start",
            }}
          >
            <RecipeCard
              recipe={recipe}
              userLikedRecipes={userLikedRecipes}
              userSavedRecipes={userSavedRecipes}
              onLike={onLike}
              onSave={onSave}
              onDelete={onDelete}
            />
          </Box>
        ))}
      </Box>

      {canScroll && (
        <Stack direction="row" spacing={1.5} justifyContent="flex-end" mt={1}>
          <IconButton
            aria-label="Previous recipes"
            onClick={() => scrollBySlide(-1)}
            sx={arrowSx}
          >
            <ChevronLeftIcon />
          </IconButton>
          <IconButton
            aria-label="Next recipes"
            onClick={() => scrollBySlide(1)}
            sx={arrowSx}
          >
            <ChevronRightIcon />
          </IconButton>
        </Stack>
      )}
    </Box>
  );
};

export default ResponsiveCarousel;
