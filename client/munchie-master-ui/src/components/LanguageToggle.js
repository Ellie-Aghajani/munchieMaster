import React from "react";
import { Button, Tooltip } from "@mui/material";
import { useTranslation } from "react-i18next";

// Switches between English and Persian; shows the language you'd switch to
const LanguageToggle = ({ sx }) => {
  const { t, i18n } = useTranslation();
  const next = i18n.language === "fa" ? "en" : "fa";

  return (
    <Tooltip title={t("language.switchTo")}>
      <Button
        color="inherit"
        onClick={() => i18n.changeLanguage(next)}
        aria-label={t("language.switchTo")}
        lang={next}
        sx={{
          minWidth: 0,
          px: 1.25,
          borderRadius: 999,
          textTransform: "none",
          fontSize: "1rem",
          ...sx,
        }}
      >
        {next === "fa" ? "فا" : "EN"}
      </Button>
    </Tooltip>
  );
};

export default LanguageToggle;
