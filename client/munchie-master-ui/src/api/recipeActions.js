import axios from "axios";
import i18n from "../i18n";

const authHeaders = () => ({ "x-auth-token": localStorage.getItem("token") });

export const likeRecipe = async (recipeId) =>
  (
    await axios.post(
      `/api/recipes/${recipeId}/like`,
      {},
      { headers: authHeaders() },
    )
  ).data;

export const toggleSaveRecipe = async (recipeId) =>
  (
    await axios.post(
      "/api/users/save-recipe",
      { recipeId },
      { headers: authHeaders() },
    )
  ).data;

export const buyRecipe = async (recipeId) =>
  (
    await axios.post(
      `/api/recipes/${recipeId}/buy`,
      {},
      { headers: authHeaders() },
    )
  ).data;

// "5 coins" / "۵ سکه" in the current language
const coinsLabel = (amount) => i18n.t("coins", { count: amount });

// Snackbar text when a like or save paid the recipe's author
export const rewardMessage = (data, action) =>
  data.coinsAwarded > 0
    ? i18n.t(
        action === "save" ? "messages.rewardSave" : "messages.rewardLike",
        {
          name: data.authorName,
          coins: coinsLabel(data.coinsAwarded),
        },
      )
    : null;

export const unlockMessage = (data) =>
  i18n.t("messages.unlocked", {
    coins: coinsLabel(data.coinsSpent),
    name: data.authorName,
  });

export const postMessage = (data) =>
  i18n.t("messages.posted", { coins: coinsLabel(data.coinsEarned) });

// Server messages are English sentences; in English show them as-is,
// otherwise show the translated fallback
export const errorText = (error, fallback) =>
  i18n.language === "en" && typeof error.response?.data === "string"
    ? error.response.data
    : fallback;

export { coinsLabel };

export const deleteRecipe = async (recipeId) =>
  (await axios.delete(`/api/recipes/${recipeId}`, { headers: authHeaders() }))
    .data;

export const deleteMessage = (data) =>
  [
    i18n.t("messages.deleted"),
    data.coinsDeducted > 0 &&
      i18n.t("messages.deletedReturned", {
        coins: coinsLabel(data.coinsDeducted),
      }),
    data.refundedBuyers > 0 &&
      i18n.t("messages.deletedRefunded", { count: data.refundedBuyers }),
  ]
    .filter(Boolean)
    .join(" ");
