import { useEffect, useRef } from "react";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";
import { useError } from "../contexts/ErrorContext";
import { coinsLabel } from "../api/recipeActions";
import { useTranslation } from "react-i18next";

// Once per login, tells the user what they earned from other members' activity
const CoinNotifier = () => {
  const { t, i18n } = useTranslation();
  const { currentUser } = useAuth();
  const { showSuccess } = useError();
  const notifiedFor = useRef(null);

  useEffect(() => {
    const userId = currentUser?._id;
    if (!userId || notifiedFor.current === userId) return;
    notifiedFor.current = userId;

    axios
      .get("/api/users/coin-notice", {
        headers: { "x-auth-token": localStorage.getItem("token") },
      })
      .then(({ data }) => {
        if (!data.coins) return;
        const list = (items) =>
          new Intl.ListFormat(i18n.language, { type: "conjunction" }).format(
            items,
          );
        const earned = [
          data.likes && t("counts.likes", { count: data.likes }),
          data.saves && t("counts.saves", { count: data.saves }),
          data.sales && t("counts.unlocks", { count: data.sales }),
        ].filter(Boolean);
        const parts = [];
        if (earned.length)
          parts.push(t("messages.onYourRecipes", { items: list(earned) }));
        if (data.refunds)
          parts.push(
            t("messages.forDeletedRecipes", {
              items: t("counts.refunds", { count: data.refunds }),
            }),
          );
        showSuccess(
          t("messages.welcomeBack", {
            coins: coinsLabel(data.coins),
            details: parts.join(t("messages.groupSeparator")),
          }),
        );
      })
      .catch(() => {
        // The notice is optional; ignore failures
      });
  }, [currentUser?._id, showSuccess, t, i18n.language]);

  return null;
};

export default CoinNotifier;
