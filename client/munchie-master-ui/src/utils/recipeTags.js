import EggAltOutlinedIcon from "@mui/icons-material/EggAltOutlined";
import LunchDiningOutlinedIcon from "@mui/icons-material/LunchDiningOutlined";
import DinnerDiningOutlinedIcon from "@mui/icons-material/DinnerDiningOutlined";
import CookieOutlinedIcon from "@mui/icons-material/CookieOutlined";
import CakeOutlinedIcon from "@mui/icons-material/CakeOutlined";
import SpaOutlinedIcon from "@mui/icons-material/SpaOutlined";
import LocalFireDepartmentOutlinedIcon from "@mui/icons-material/LocalFireDepartmentOutlined";
import GrainOutlinedIcon from "@mui/icons-material/GrainOutlined";
import i18n from "../i18n";

// Keep values in sync with CATEGORIES and DIETS in server/models/recipe.js.
// Colors live in theme.palette.tags under the same keys.
export const CATEGORY_OPTIONS = [
  { value: "breakfast", Icon: EggAltOutlinedIcon },
  { value: "lunch", Icon: LunchDiningOutlinedIcon },
  { value: "dinner", Icon: DinnerDiningOutlinedIcon },
  { value: "snack", Icon: CookieOutlinedIcon },
  { value: "sweets", Icon: CakeOutlinedIcon },
];

export const DIET_OPTIONS = [
  { value: "isVegetarian", Icon: SpaOutlinedIcon },
  { value: "isGlutenFree", Icon: GrainOutlinedIcon },
  { value: "isKetoFriendly", Icon: LocalFireDepartmentOutlinedIcon },
];

// Tag label in the current language
export const tagLabel = (value) => i18n.t(`tags.${value}`);

const toTag = (option) => ({
  key: option.value,
  label: tagLabel(option.value),
  Icon: option.Icon,
});

// Tags to show for a recipe: its categories first, then its diets
export const recipeTags = (recipe) => [
  ...CATEGORY_OPTIONS.filter((option) =>
    (recipe.categories || []).includes(option.value),
  ).map(toTag),
  ...DIET_OPTIONS.filter((option) => recipe[option.value]).map(toTag),
];
