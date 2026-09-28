import config from "../config";
import i18n from "../i18n";

// Build a full URL for a file served from the server's /uploads folder
export const uploadUrl = (path) =>
  path
    ? `${config.serverUrl}/uploads/${path.replace(/^\/?uploads\/?/, "")}`
    : undefined;

// Ingredients and directions are stored as strings with one item per line
export const toLines = (items = []) =>
  items
    .flatMap((item) => item.split(/\r?\n/))
    .map((line) => line.replace(/^\s*(?:[-•*]|\d+[.)])\s*/, "").trim())
    .filter(Boolean);

export const authorIdOf = (recipe) => recipe.author?._id ?? recipe.author;

// Default recipes have no author and are shown as MunchieMaster's
export const authorNameOf = (recipe) =>
  recipe.author
    ? recipe.author.firstName || recipe.author.name || "A member"
    : i18n.t("brand");

export const isOwnRecipe = (recipe, user) =>
  !!user?._id && authorIdOf(recipe) === user._id;

// Paid recipes stay locked until the user buys them (authors always have access)
export const isRecipeLocked = (recipe, user) =>
  !!recipe.price &&
  !isOwnRecipe(recipe, user) &&
  !(user?.boughtRecipes || []).includes(recipe._id);
