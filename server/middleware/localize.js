// Sends recipes in the reader's language. Any recipe in a JSON response that
// carries `translations` gets its text swapped for that language's version.
// Only fields already in the response are swapped, so text removed on purpose
// (e.g. a locked recipe's ingredients) stays removed.
const TRANSLATED_FIELDS = ["name", "preparationTime", "ingredients", "directions"];
const INTERNAL_FIELDS = [
  "translations",
  "translationStatus",
  "translationAttempts",
  "contentVersion",
];

const requestLanguage = (req) => {
  const requested = String(
    req.query.lang || req.headers["accept-language"] || ""
  ).toLowerCase();
  return requested.startsWith("fa") ? "fa" : "en";
};

function localizeRecipe(recipe, language, keepOriginal) {
  const version = recipe.translations && recipe.translations[language];
  const isTranslated =
    !keepOriginal && !!version && !!recipe.sourceLanguage && recipe.sourceLanguage !== language;
  if (isTranslated) {
    TRANSLATED_FIELDS.forEach((field) => {
      if (field in recipe && version[field] !== undefined) recipe[field] = version[field];
    });
  }
  INTERNAL_FIELDS.forEach((field) => delete recipe[field]);
  recipe.isTranslated = isTranslated;
  return recipe;
}

function localizeDeep(value, language, keepOriginal) {
  if (Array.isArray(value)) return value.map((item) => localizeDeep(item, language, keepOriginal));
  if (value && typeof value === "object") {
    Object.keys(value).forEach((key) => {
      value[key] = localizeDeep(value[key], language, keepOriginal);
    });
    if ("translations" in value || "translationStatus" in value)
      localizeRecipe(value, language, keepOriginal);
  }
  return value;
}

module.exports = function (req, res, next) {
  const json = res.json.bind(res);
  res.json = (body) => {
    if (body === null || typeof body !== "object") return json(body);
    // Plain copy first so Mongoose documents become ordinary objects
    const plain = JSON.parse(JSON.stringify(body));
    // ?original=1 returns the author's own text (used by the edit form)
    return json(localizeDeep(plain, requestLanguage(req), req.query.original === "1"));
  };
  next();
};
