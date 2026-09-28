import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";
import { useError } from "../contexts/ErrorContext";
import {
  coinsLabel,
  deleteMessage,
  deleteRecipe,
  errorText,
} from "../api/recipeActions";
import { isOwnRecipe } from "../utils/recipeUtils";
import { Trans, useTranslation } from "react-i18next";

const pillButtonSx = {
  borderRadius: 999,
  px: 3,
  textTransform: "none",
  fontSize: "1rem",
};

// Confirms deleting a recipe and explains the coins it costs the author
const DeleteRecipeDialog = ({ recipeId, open, onClose, onDeleted }) => {
  const { t } = useTranslation();
  const { currentUser, checkAuthStatus } = useAuth();
  const { showError, showSuccess } = useError();
  const [details, setDetails] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    if (!open || !recipeId) return;
    setDetails(null);
    axios
      .get(`/api/recipes/${recipeId}`, {
        headers: { "x-auth-token": localStorage.getItem("token") },
      })
      .then(({ data }) => setDetails(data))
      .catch((error) => {
        showError(null, errorText(error, t("errors.loadRecipe")));
        onCloseRef.current();
      });
  }, [open, recipeId, showError, t]);

  const isAuthor = details && isOwnRecipe(details, currentUser);
  const cost = details?.deletionCost ?? 0;
  const balance = currentUser?.coins ?? 0;
  // Admins deleting someone else's recipe are never blocked
  const canAfford = !isAuthor || balance >= cost;

  const handleDelete = async () => {
    setDeleting(true);
    try {
      const data = await deleteRecipe(recipeId);
      showSuccess(deleteMessage(data));
      await checkAuthStatus();
      onDeleted(recipeId);
    } catch (error) {
      showError(null, errorText(error, t("errors.delete")));
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={deleting ? undefined : onClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 4, p: 1, backgroundColor: "tiles.cream" },
      }}
    >
      <DialogTitle sx={{ color: "primary.main", fontSize: "1.5rem" }}>
        {t("delete.title")}
      </DialogTitle>
      <DialogContent sx={{ color: "primary.main" }}>
        {!details ? (
          <Box display="flex" justifyContent="center" py={3}>
            <CircularProgress size={32} />
          </Box>
        ) : (
          <>
            <Typography sx={{ fontSize: "1.1rem", mb: 2 }}>
              {t("delete.warning", { name: details.name.trim() })}
            </Typography>
            {cost > 0 && (
              <Typography sx={{ lineHeight: 1.6, mb: 1.5 }}>
                <Trans
                  i18nKey={isAuthor ? "delete.costYou" : "delete.costAuthor"}
                  values={{
                    coins: coinsLabel(cost),
                    refund:
                      details.buyerCount === 1
                        ? t("delete.refundOne", {
                            coins: coinsLabel(details.price),
                          })
                        : details.buyerCount > 1
                          ? t("delete.refundMany", {
                              coins: coinsLabel(details.price),
                              count: details.buyerCount,
                            })
                          : "",
                  }}
                  components={{ bold: <strong /> }}
                />
              </Typography>
            )}
            {isAuthor && cost > 0 && (
              <Typography
                sx={{
                  color: canAfford ? "primary.main" : "error.main",
                }}
              >
                {canAfford
                  ? t("delete.left", {
                      balance: coinsLabel(balance),
                      left: coinsLabel(balance - cost),
                    })
                  : t("delete.cantAfford", { balance: coinsLabel(balance) })}
              </Typography>
            )}
          </>
        )}
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
        <Button
          onClick={onClose}
          disabled={deleting}
          variant="outlined"
          sx={pillButtonSx}
        >
          {t("form.cancel")}
        </Button>
        <Button
          onClick={handleDelete}
          disabled={!details || !canAfford || deleting}
          variant="contained"
          color="error"
          startIcon={<DeleteOutlineIcon />}
          sx={pillButtonSx}
        >
          {deleting ? t("delete.deleting") : t("delete.confirm")}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteRecipeDialog;
