import EggAltOutlinedIcon from "@mui/icons-material/EggAltOutlined";
import LunchDiningOutlinedIcon from "@mui/icons-material/LunchDiningOutlined";
import DinnerDiningOutlinedIcon from "@mui/icons-material/DinnerDiningOutlined";
import CookieOutlinedIcon from "@mui/icons-material/CookieOutlined";
import CakeOutlinedIcon from "@mui/icons-material/CakeOutlined";
import SpaOutlinedIcon from "@mui/icons-material/SpaOutlined";
import LocalFireDepartmentOutlinedIcon from "@mui/icons-material/LocalFireDepartmentOutlined";
import GrainOutlinedIcon from "@mui/icons-material/GrainOutlined";

// Keep values in sync with CATEGORIES and DIETS in server/models/recipe.js.
// Colors live in theme.palette.tags under the same keys.
export const CATEGORY_OPTIONS = [
  { value: "breakfast", label: "Breakfast", Icon: EggAltOutlinedIcon },
  { value: "lunch", label: "Lunch", Icon: LunchDiningOutlinedIcon },
  { value: "dinner", label: "Dinner", Icon: DinnerDiningOutlinedIcon },
  { value: "snack", label: "Snack", Icon: CookieOutlinedIcon },
  { value: "sweets", label: "Sweets & Treats", Icon: CakeOutlinedIcon },
];

export const DIET_OPTIONS = [
  { value: "isVegetarian", label: "Vegetarian", Icon: SpaOutlinedIcon },
  { value: "isGlutenFree", label: "Gluten-free", Icon: GrainOutlinedIcon },
  {
    value: "isKetoFriendly",
    label: "Keto-friendly",
    Icon: LocalFireDepartmentOutlinedIcon,
  },
];

const toTag = (option) => ({
  key: option.value,
  label: option.label,
  Icon: option.Icon,
});

// Tags to show for a recipe: its categories first, then its diets
export const recipeTags = (recipe) => [
  ...CATEGORY_OPTIONS.filter((option) =>
    (recipe.categories || []).includes(option.value),
  ).map(toTag),
  ...DIET_OPTIONS.filter((option) => recipe[option.value]).map(toTag),
];
