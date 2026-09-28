// Numbers in the reader's language: 12 in English, ۱۲ in Persian
export const formatNumber = (value, language, options) =>
  new Intl.NumberFormat(language === "fa" ? "fa-IR" : "en-US", options).format(
    value
  );

// Signed amounts like "+5" / "−5" (true minus sign)
export const formatSigned = (value, language) =>
  `${value < 0 ? "−" : "+"}${formatNumber(Math.abs(value), language)}`;
