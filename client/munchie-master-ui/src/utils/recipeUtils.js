import config from "../config";

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
