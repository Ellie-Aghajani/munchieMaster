import React, { useCallback, useState } from "react";
import Cropper from "react-easy-crop";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Slider,
  Stack,
  Typography,
} from "@mui/material";
import ZoomOutIcon from "@mui/icons-material/ZoomOut";
import ZoomInIcon from "@mui/icons-material/ZoomIn";
import { useTheme } from "@mui/material/styles";

const OUTPUT_SIZE = 512; // px; profile photos never show larger than this

const pillButtonSx = {
  borderRadius: 999,
  px: 3,
  textTransform: "none",
  fontSize: "1rem",
};

const loadImage = (src) =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = src;
  });

// Draw the selected square of the image onto a canvas and export it as a JPEG
async function cropToBlob(imageSrc, area, backgroundColor) {
  const image = await loadImage(imageSrc);
  const canvas = document.createElement("canvas");
  canvas.width = OUTPUT_SIZE;
  canvas.height = OUTPUT_SIZE;
  const context = canvas.getContext("2d");
  // JPEG has no transparency; fill so transparent PNGs don't turn black
  context.fillStyle = backgroundColor;
  context.fillRect(0, 0, OUTPUT_SIZE, OUTPUT_SIZE);
  context.imageSmoothingQuality = "high";
  context.drawImage(
    image,
    area.x,
    area.y,
    area.width,
    area.height,
    0,
    0,
    OUTPUT_SIZE,
    OUTPUT_SIZE,
  );
  return new Promise((resolve, reject) =>
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error("Crop failed"))),
      "image/jpeg",
      0.9,
    ),
  );
}

// Lets the user drag and zoom a photo inside a round frame before uploading it
const AvatarCropDialog = ({ imageSrc, open, onCancel, onCropped }) => {
  const theme = useTheme();
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [area, setArea] = useState(null);
  const [working, setWorking] = useState(false);

  const handleCropComplete = useCallback((_, croppedAreaPixels) => {
    setArea(croppedAreaPixels);
  }, []);

  const reset = () => {
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setArea(null);
  };

  const handleCancel = () => {
    reset();
    onCancel();
  };

  const handleSave = async () => {
    if (!area) return;
    setWorking(true);
    try {
      const blob = await cropToBlob(imageSrc, area, theme.palette.common.white);
      await onCropped(blob);
      reset();
    } finally {
      setWorking(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={working ? undefined : handleCancel}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 4, backgroundColor: "tiles.cream" },
      }}
    >
      <DialogTitle sx={{ color: "primary.main", fontSize: "1.5rem" }}>
        Crop your photo
      </DialogTitle>
      <DialogContent>
        <Box
          sx={{
            position: "relative",
            width: "100%",
            aspectRatio: "1",
            borderRadius: 3,
            overflow: "hidden",
            backgroundColor: "primary.main",
          }}
        >
          {imageSrc && (
            <Cropper
              image={imageSrc}
              crop={crop}
              zoom={zoom}
              aspect={1}
              cropShape="round"
              showGrid={false}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={handleCropComplete}
            />
          )}
        </Box>
        <Typography
          variant="body2"
          sx={{ color: "primary.main", mt: 1.5, textAlign: "center" }}
        >
          Drag to position your photo
        </Typography>
        <Stack
          direction="row"
          spacing={2}
          alignItems="center"
          sx={{ mt: 1, px: 1, color: "primary.main" }}
        >
          <ZoomOutIcon />
          <Slider
            value={zoom}
            min={1}
            max={3}
            step={0.01}
            onChange={(_, value) => setZoom(value)}
            aria-label="Zoom"
            sx={{ color: "accent.main" }}
          />
          <ZoomInIcon />
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2.5, gap: 1 }}>
        <Button
          onClick={handleCancel}
          disabled={working}
          variant="outlined"
          sx={pillButtonSx}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSave}
          disabled={!area || working}
          sx={{
            ...pillButtonSx,
            color: "accent.contrastText",
            backgroundColor: "accent.main",
            "&:hover": { backgroundColor: "accent.dark" },
            "&.Mui-disabled": { color: "accent.contrastText", opacity: 0.6 },
          }}
        >
          {working ? "Saving…" : "Save photo"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AvatarCropDialog;
