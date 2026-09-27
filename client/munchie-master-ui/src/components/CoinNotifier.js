import { useEffect, useRef } from "react";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";
import { useError } from "../contexts/ErrorContext";
import { coinsLabel } from "../api/recipeActions";

const plural = (count, word) => `${count} ${word}${count === 1 ? "" : "s"}`;

// Once per login, tells the user what they earned from other members' activity
const CoinNotifier = () => {
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
        const earned = [
          data.likes && plural(data.likes, "like"),
          data.saves && plural(data.saves, "save"),
          data.sales && plural(data.sales, "unlock"),
        ].filter(Boolean);
        const parts = [];
        if (earned.length) parts.push(`${earned.join(", ")} on your recipes`);
        if (data.refunds)
          parts.push(
            `${plural(data.refunds, "refund")} for deleted recipes you had unlocked`
          );
        showSuccess(
          `Welcome back! You received ${coinsLabel(data.coins)}: ${parts.join(
            "; "
          )}.`
        );
      })
      .catch(() => {
        // The notice is optional; ignore failures
      });
  }, [currentUser?._id, showSuccess]);

  return null;
};

export default CoinNotifier;
