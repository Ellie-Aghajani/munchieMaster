const sdk = require("@anthropic-ai/sdk");
const Anthropic = sdk.default ?? sdk;

const MODEL = "claude-sonnet-5";

// Recipe text is stored either as one line per item or as one string with
// line breaks; translate it line by line
const toLines = (items = []) =>
  items
    .flatMap((item) => String(item).split(/\r?\n/))
    .map((line) => line.trim())
    .filter(Boolean);

const versionSchema = {
  type: "object",
  properties: {
    name: { type: "string" },
    preparationTime: { type: "string" },
    ingredients: { type: "array", items: { type: "string" } },
    directions: { type: "array", items: { type: "string" } },
  },
  required: ["name", "preparationTime", "ingredients", "directions"],
  additionalProperties: false,
};

const OUTPUT_SCHEMA = {
  type: "object",
  properties: {
    sourceLanguage: { type: "string", enum: ["en", "fa"] },
    translation: versionSchema,
  },
  required: ["sourceLanguage", "translation"],
  additionalProperties: false,
};

const SYSTEM_PROMPT = `You translate recipes for Munchie Master, a recipe app for busy families, between English and Persian (Farsi).

You receive one recipe as JSON. Work out which language it is written in ("en" or "fa") and translate it into the other one:
- Write a natural translation that a home cook would read comfortably, using everyday cooking words (for example "cup" is پیمانه, "tablespoon" is قاشق غذاخوری).
- Keep every quantity, number and unit amount the same; in Persian write numbers with Persian digits.
- Return exactly as many ingredients and directions as you were given, in the same order, one translated line for each line.
- Do not translate people's names or the app name "Munchie Master".
- If the recipe mixes languages, use the language most of the text is in as the source.`;

let client;
const getClient = () => {
  if (!client) client = new Anthropic(); // Reads ANTHROPIC_API_KEY
  return client;
};

const isConfigured = () => !!process.env.ANTHROPIC_API_KEY;

// Returns { sourceLanguage, en, fa } where the source version is the original
// text; throws if the result can't be trusted
async function translateRecipe(recipe) {
  const input = {
    name: recipe.name.trim(),
    preparationTime: recipe.preparationTime || "",
    ingredients: toLines(recipe.ingredients),
    directions: toLines(recipe.directions),
  };

  const response = await getClient().messages.create({
    model: MODEL,
    max_tokens: 16000,
    thinking: { type: "disabled" },
    output_config: { format: { type: "json_schema", schema: OUTPUT_SCHEMA } },
    system: SYSTEM_PROMPT,
    messages: [{ role: "user", content: JSON.stringify(input) }],
  });

  if (response.stop_reason !== "end_turn") {
    throw new Error(`Translation stopped early: ${response.stop_reason}`);
  }
  const text = response.content
    .filter((block) => block.type === "text")
    .map((block) => block.text)
    .join("");
  const { sourceLanguage, translation } = JSON.parse(text);

  // The translation must line up with the original, line for line
  if (
    translation.ingredients.length !== input.ingredients.length ||
    translation.directions.length !== input.directions.length
  ) {
    throw new Error("Translation changed the number of lines");
  }
  const targetLanguage = sourceLanguage === "en" ? "fa" : "en";
  return {
    sourceLanguage,
    [sourceLanguage]: input,
    [targetLanguage]: translation,
    usage: response.usage,
  };
}

module.exports = { translateRecipe, isConfigured, toLines, MODEL };
