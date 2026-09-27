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

const pillButtonSx = {
  borderRadius: 999,
  px: 3,
  textTransform: "none",
  fontSize: "1rem",
};

// Confirms deleting a recipe and explains the coins it costs the author
const DeleteRecipeDialog = ({ recipeId, open, onClose, onDeleted }) => {
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
        showError(null, errorText(error, "Could not load this recipe."));
        onCloseRef.current();
      });
  }, [open, recipeId, showError]);

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
      showError(null, errorText(error, "Could not delete this recipe."));
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
        Delete this recipe?
      </DialogTitle>
      <DialogContent sx={{ color: "primary.main" }}>
        {!details ? (
          <Box display="flex" justifyContent="center" py={3}>
            <CircularProgress size={32} />
          </Box>
        ) : (
          <>
            <Typography sx={{ fontSize: "1.1rem", mb: 2 }}>
              "{details.name.trim()}" will be removed for everyone. This can't
              be undone.
            </Typography>
            {cost > 0 && (
              <Typography sx={{ lineHeight: 1.6, mb: 1.5 }}>
                {isAuthor ? "It costs you " : "It costs the author "}
                <strong>{coinsLabel(cost)}</strong>: the 5 coins earned for
                posting it
                {details.buyerCount === 1 &&
                  `, plus ${coinsLabel(
                    details.price,
                  )} back to the member who unlocked it`}
                {details.buyerCount > 1 &&
                  `, plus ${coinsLabel(details.price)} back to each of the ${
                    details.buyerCount
                  } members who unlocked it`}
                .
              </Typography>
            )}
            {isAuthor && cost > 0 && (
              <Typography
                sx={{
                  color: canAfford ? "primary.main" : "error.main",
                }}
              >
                {canAfford
                  ? `You have ${coinsLabel(balance)}; ${coinsLabel(
                      balance - cost,
                    )} will be left.`
                  : `You have ${coinsLabel(
                      balance,
                    )}, so you can't delete it yet.`}
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
          Cancel
        </Button>
        <Button
          onClick={handleDelete}
          disabled={!details || !canAfford || deleting}
          variant="contained"
          color="error"
          startIcon={<DeleteOutlineIcon />}
          sx={pillButtonSx}
        >
          {deleting ? "Deleting…" : "Delete"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteRecipeDialog;
