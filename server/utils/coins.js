const { User } = require("../models/user");
const COINS = require("./coinRules");

// Fields sent for recipe cards; ingredients and directions only go to the detail page
const RECIPE_SUMMARY_FIELDS =
  "name image preparationTime likeCount price isFeatured author categories isVegetarian isGlutenFree isKetoFriendly";

const idOf = (value) => (value && value._id ? value._id : value);

const authorIdOf = (recipe) => idOf(recipe.author);

const authorNameOf = (recipe) =>
  recipe.author && recipe.author.name
    ? recipe.author.firstName || recipe.author.name
    : "The author";

// Free recipes are open to everyone; paid ones only to their author and buyers
function canViewRecipe(recipe, user) {
  if (!recipe.price) return true;
  if (!user) return false;
  const authorId = authorIdOf(recipe);
  if (authorId && authorId.equals(user._id)) return true;
  return (user.boughtRecipes || []).some((id) => idOf(id).equals(recipe._id));
}

// Pay the recipe's author once per user and action; returns the coins awarded.
// The caller saves the recipe so the updated rewarded list is stored.
async function rewardAuthor(recipe, actorId, { rewardedField, amount, counter }) {
  const authorId = authorIdOf(recipe);
  if (!authorId || authorId.equals(actorId)) return 0;
  if (recipe[rewardedField].some((id) => id.equals(actorId))) return 0;

  recipe[rewardedField].push(actorId);
  await User.updateOne(
    { _id: authorId },
    {
      $inc: {
        coins: amount,
        "unseenEarnings.coins": amount,
        [`unseenEarnings.${counter}`]: 1,
      },
    }
  );
  return amount;
}

module.exports = {
  COINS,
  RECIPE_SUMMARY_FIELDS,
  authorIdOf,
  authorNameOf,
  canViewRecipe,
  rewardAuthor,
};
