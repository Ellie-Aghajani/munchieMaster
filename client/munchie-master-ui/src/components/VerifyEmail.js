import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
  Box,
  Button,
  CircularProgress,
  Container,
  Typography,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { useAuth } from "../contexts/AuthContext";
import { useError } from "../contexts/ErrorContext";
import CheckEmailPanel from "./CheckEmailPanel";

const cardSx = {
  p: { xs: 3, md: 4 },
  borderRadius: 4,
  color: "primary.main",
  backgroundColor: "tiles.cream",
  boxShadow: (theme) => theme.customShadows.raised,
  textAlign: "center",
};

// Opened from the link in the confirmation email
const VerifyEmail = () => {
  const { t } = useTranslation();
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { verifyEmail } = useAuth();
  const { showSuccess } = useError();
  const [result, setResult] = useState(null);
  const started = useRef(false);

  useEffect(() => {
    // The token works once, so don't send it twice (React may run effects twice)
    if (started.current) return;
    started.current = true;
    verifyEmail(params.get("token") || "").then((outcome) => {
      if (outcome.ok) {
        showSuccess(t("verify.success"));
        navigate("/dashboard", { replace: true });
      } else {
        setResult(outcome);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Container maxWidth="xs" sx={{ py: { xs: 4, md: 8 } }}>
      <Box sx={cardSx}>
        {!result ? (
          <>
            <CircularProgress sx={{ color: "accent.main", mb: 2 }} />
            <Typography>{t("verify.verifying")}</Typography>
          </>
        ) : result.code === "EXPIRED_LINK" && result.email ? (
          <CheckEmailPanel
            email={result.email}
            note={t("verify.expiredTitle")}
            messageKey="verify.notVerified"
            onBack={() => navigate("/login")}
          />
        ) : (
          <>
            <Typography sx={{ fontSize: "1.4rem", mb: 1.5 }}>
              {t("verify.invalidTitle")}
            </Typography>
            <Typography sx={{ lineHeight: 1.7, mb: 3 }}>
              {t("verify.invalidBody")}
            </Typography>
            <Button
              component={Link}
              to="/login"
              sx={{
                borderRadius: 999,
                px: 3,
                textTransform: "none",
                fontSize: "1rem",
                color: "accent.contrastText",
                backgroundColor: "accent.main",
                "&:hover": { backgroundColor: "accent.dark" },
              }}
            >
              {t("verify.backToLogin")}
            </Button>
          </>
        )}
      </Box>
    </Container>
  );
};

export default VerifyEmail;
