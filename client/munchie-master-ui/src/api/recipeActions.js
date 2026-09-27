import axios from "axios";

const authHeaders = () => ({ "x-auth-token": localStorage.getItem("token") });

export const likeRecipe = async (recipeId) =>
  (
    await axios.post(
      `/api/recipes/${recipeId}/like`,
      {},
      { headers: authHeaders() }
    )
  ).data;

export const toggleSaveRecipe = async (recipeId) =>
  (
    await axios.post(
      "/api/users/save-recipe",
      { recipeId },
      { headers: authHeaders() }
    )
  ).data;

export const buyRecipe = async (recipeId) =>
  (
    await axios.post(
      `/api/recipes/${recipeId}/buy`,
      {},
      { headers: authHeaders() }
    )
  ).data;

const coinsLabel = (amount) => `${amount} coin${amount === 1 ? "" : "s"}`;

// Snackbar text when a like or save paid the recipe's author
export const rewardMessage = (data, action) =>
  data.coinsAwarded > 0
    ? `${data.authorName} earned ${coinsLabel(data.coinsAwarded)} from your ${action}!`
    : null;

export const unlockMessage = (data) =>
  `Recipe unlocked! You spent ${coinsLabel(data.coinsSpent)} and ${
    data.authorName
  } earned them.`;

export const postMessage = (data) =>
  `Recipe posted! You earned ${coinsLabel(data.coinsEarned)}.`;

// Messages from the server are plain strings; fall back for anything else
export const errorText = (error, fallback) =>
  typeof error.response?.data === "string" ? error.response.data : fallback;

export { coinsLabel };

export const deleteRecipe = async (recipeId) =>
  (await axios.delete(`/api/recipes/${recipeId}`, { headers: authHeaders() }))
    .data;

export const deleteMessage = (data) => {
  const parts = [];
  if (data.coinsDeducted > 0)
    parts.push(`${coinsLabel(data.coinsDeducted)} were returned`);
  if (data.refundedBuyers > 0)
    parts.push(
      `${data.refundedBuyers} member${
        data.refundedBuyers === 1 ? " was" : "s were"
      } refunded`
    );
  return `Recipe deleted.${parts.length ? ` ${parts.join(" and ")}.` : ""}`;
};
