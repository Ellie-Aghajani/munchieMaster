const winston = require("winston");
const { Recipe } = require("../models/recipe");
const { translateRecipe, isConfigured } = require("../utils/translate");

const MAX_ATTEMPTS = 3;
// Matches the recipe's content version; recipes created before the field
// existed have no contentVersion, which counts as 0
const sameVersion = (version) =>
  version === 0 ? { $in: [0, null] } : version;

const RETRY_EVERY_MS = 5 * 60 * 1000;
const BATCH_SIZE = 5;
const inProgress = new Set();

// Translate one recipe and store both language versions. Only saves if the
// recipe wasn't edited meanwhile; otherwise the newer text gets translated next.
async function translateOne(recipeId) {
  const key = String(recipeId);
  if (inProgress.has(key) || !isConfigured()) return;
  inProgress.add(key);
  try {
    const recipe = await Recipe.findById(recipeId);
    if (!recipe || recipe.translationStatus === "done") return;

    const version = recipe.contentVersion;
    try {
      const result = await translateRecipe(recipe);
      await Recipe.updateOne(
        { _id: recipeId, contentVersion: sameVersion(version) },
        {
          $set: {
            sourceLanguage: result.sourceLanguage,
            translations: { en: result.en, fa: result.fa },
            translationStatus: "done",
            translationAttempts: 0,
          },
        }
      );
    } catch (error) {
      winston.error(`Translating recipe ${key} failed: ${error.message}`);
      await Recipe.updateOne(
        { _id: recipeId, contentVersion: sameVersion(version) },
        { $set: { translationStatus: "failed" }, $inc: { translationAttempts: 1 } }
      );
    }
  } finally {
    inProgress.delete(key);
  }
}

// Start translating a recipe without making the request wait for it
const queueTranslation = (recipeId) => {
  translateOne(recipeId).catch((error) =>
    winston.error(`Translation queue error: ${error.message}`)
  );
};

// Pick up recipes that were never translated or whose translation failed
async function translatePending() {
  const recipes = await Recipe.find({
    translationStatus: { $ne: "done" },
    translationAttempts: { $not: { $gte: MAX_ATTEMPTS } },
  })
    .select("_id")
    .limit(BATCH_SIZE);
  for (const recipe of recipes) await translateOne(recipe._id);
}

module.exports = function () {
  if (!isConfigured()) {
    winston.info("ANTHROPIC_API_KEY not set; recipe translation is off.");
    return;
  }
  const run = () =>
    translatePending().catch((error) =>
      winston.error(`Translation job error: ${error.message}`)
    );
  setTimeout(run, 10 * 1000); // Shortly after startup, once the DB is connected
  setInterval(run, RETRY_EVERY_MS);
};

module.exports.queueTranslation = queueTranslation;
module.exports.translatePending = translatePending;
