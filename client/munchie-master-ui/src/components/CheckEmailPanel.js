import React, { useEffect, useState } from "react";
import { Button, Stack, Typography } from "@mui/material";
import MarkEmailReadOutlinedIcon from "@mui/icons-material/MarkEmailReadOutlined";
import { Trans, useTranslation } from "react-i18next";
import { useAuth } from "../contexts/AuthContext";

const RESEND_WAIT_SECONDS = 60; // Matches the server's limit

// "Check your email" message with a resend button (after sign-up, or when an
// unconfirmed account tries to log in)
const CheckEmailPanel = ({
  email,
  messageKey = "verify.checkBody",
  note,
  onBack,
}) => {
  const { t } = useTranslation();
  const { resendVerification } = useAuth();
  const [wait, setWait] = useState(RESEND_WAIT_SECONDS);
  const [resent, setResent] = useState(false);

  useEffect(() => {
    if (wait <= 0) return undefined;
    const timer = setTimeout(() => setWait((seconds) => seconds - 1), 1000);
    return () => clearTimeout(timer);
  }, [wait]);

  const handleResend = async () => {
    setWait(RESEND_WAIT_SECONDS);
    setResent(await resendVerification(email));
  };

  return (
    <Stack spacing={2} alignItems="center" textAlign="center" sx={{ py: 1 }}>
      <MarkEmailReadOutlinedIcon sx={{ fontSize: 56, color: "accent.main" }} />
      <Typography sx={{ fontSize: "1.4rem" }}>
        {t("verify.checkTitle")}
      </Typography>
      {note && <Typography color="error">{note}</Typography>}
      <Typography sx={{ lineHeight: 1.7 }}>
        <Trans
          i18nKey={messageKey}
          values={{ email }}
          components={{ bold: <strong dir="ltr" /> }}
        />
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {t("verify.spamHint")}
      </Typography>
      {resent && (
        <Typography variant="body2" sx={{ color: "secondary.main" }}>
          {t("verify.resent")}
        </Typography>
      )}
      <Button
        onClick={handleResend}
        disabled={wait > 0}
        variant="outlined"
        sx={{
          borderRadius: 999,
          px: 3,
          textTransform: "none",
          fontSize: "1rem",
        }}
      >
        {wait > 0
          ? t("verify.resendIn", { seconds: wait })
          : t("verify.resend")}
      </Button>
      {onBack && (
        <Button
          onClick={onBack}
          sx={{
            textTransform: "none",
            fontSize: "1rem",
            color: "primary.main",
          }}
        >
          {t("verify.backToLogin")}
        </Button>
      )}
    </Stack>
  );
};

export default CheckEmailPanel;
