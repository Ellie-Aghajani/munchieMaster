// Translates every recipe that doesn't have an English/Persian translation yet.
// Usage (from server/):  node scripts/translateRecipes.js
// Uses the database in munchie_db and the key in ANTHROPIC_API_KEY (server/.env).
require("dotenv").config();
require("../startup/validation")();
const mongoose = require("mongoose");
const config = require("config");
const { Recipe } = require("../models/recipe");
const { translateRecipe, isConfigured } = require("../utils/translate");

// Matches the recipe's content version; recipes created before the field
// existed have no contentVersion, which counts as 0
const sameVersion = (version) =>
  version === 0 ? { $in: [0, null] } : version;

(async () => {
  if (!isConfigured()) {
    console.error("ANTHROPIC_API_KEY is not set in server/.env");
    process.exit(1);
  }
  await mongoose.connect(config.get("db"));
  const recipes = await Recipe.find({ translationStatus: { $ne: "done" } });
  console.log(`${recipes.length} recipe(s) to translate`);

  let inputTokens = 0;
  let outputTokens = 0;
  let failed = 0;
  for (const recipe of recipes) {
    try {
      const result = await translateRecipe(recipe);
      const saved = await Recipe.updateOne(
        { _id: recipe._id, contentVersion: sameVersion(recipe.contentVersion) },
        {
          $set: {
            sourceLanguage: result.sourceLanguage,
            translations: { en: result.en, fa: result.fa },
            translationStatus: "done",
            translationAttempts: 0,
          },
        }
      );
      if (saved.modifiedCount !== 1) throw new Error("recipe changed while translating; run again");
      inputTokens += result.usage.input_tokens;
      outputTokens += result.usage.output_tokens;
      const other = result.sourceLanguage === "en" ? "fa" : "en";
      console.log(`✓ ${recipe.name.trim()} → ${result[other].name}`);
    } catch (error) {
      failed += 1;
      console.log(`✗ ${recipe.name.trim()}: ${error.message}`);
    }
  }
  // Claude Sonnet 5: $2 per million input tokens, $10 per million output tokens
  const cost = (inputTokens * 2 + outputTokens * 10) / 1e6;
  console.log(`Done. ${recipes.length - failed} translated, ${failed} failed, about $${cost.toFixed(2)}.`);
  process.exit(failed ? 1 : 0);
})();
