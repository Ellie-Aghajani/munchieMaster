import React, { useState, useEffect } from "react";
import {
  Avatar,
  Card,
  Col,
  Row,
  Typography,
  Button,
  Upload,
  Image,
  message,
  Divider,
} from "antd";
import {
  CardContent,
  CardMedia,
  Box,
  CircularProgress,
  Paper,
  IconButton,
  Snackbar,
  Alert,
} from "@mui/material";
import { PlusOutlined } from "@ant-design/icons";
import { Link as ScrollLink } from "react-scroll";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import axios from "axios";
import config from "../config";

const { Title, Text } = Typography;

// Function to convert image file to base64
const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

const Dashboard = () => {
  const [userData, setUserData] = useState(null);
  const [fileList, setFileList] = useState([]);
  const [userLikedRecipes, setUserLikedRecipes] = useState([]);
  const [userSavedRecipes, setUserSavedRecipes] = useState([]);
  const [savedRecipes, setSavedRecipes] = useState([]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");

  useEffect(() => {
    // Fetch user dashboard data
    const fetchUserData = async () => {
      try {
        const response = await axios.get(
          `${config.serverUrl}/api/dashboard/summary`,
          {
            headers: { "x-auth-token": localStorage.getItem("token") },
          }
        );
        const savedRecipesResponse = await axios.get(
          `${config.serverUrl}/api/dashboard/saved-recipes`,
          { headers: { "x-auth-token": localStorage.getItem("token") } }
        );

        setUserData(response.data);
        setSavedRecipes(savedRecipesResponse.data);
      } catch (error) {
        message.error("Failed to fetch dashboard data.");
      }
    };
    fetchUserData();
  }, []);

  // Image preview handler
  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
  };

  // Handle file list updates
  const handleChange = ({ fileList: newFileList }) => {
    setFileList(newFileList.slice(0, 3)); // Limit to 3 images
  };

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  // recipe card
  const handleLikeRecipe = async (recipeId) => {
    try {
      const response = await axios.post(
        `/api/recipes/${recipeId}/like`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            "x-auth-token": localStorage.getItem("token"),
          },
          baseURL: config.serverUrl,
        }
      );
      if (response.data.success) {
        setUserLikedRecipes((prevLiked) =>
          prevLiked.includes(recipeId)
            ? prevLiked.filter((id) => id !== recipeId)
            : [...prevLiked, recipeId]
        );
        setRecipes((prevRecipes) =>
          prevRecipes.map((recipe) =>
            recipe._id === recipeId
              ? { ...recipe, likeCount: response.data.likeCount }
              : recipe
          )
        );
      }
    } catch (error) {
      console.error("Error liking recipe:", error);
      showError("An error occurred while liking the recipe");
    }
  };

  const handleSaveRecipe = async (recipeId) => {
    try {
      const response = await axios.post(
        "/api/users/save-recipe",
        { recipeId },
        {
          headers: {
            "Content-Type": "application/json",
            "x-auth-token": localStorage.getItem("token"),
          },
        }
      );
      if (response.data.success) {
        setUserSavedRecipes((prevSaved) =>
          prevSaved.includes(recipeId)
            ? prevSaved.filter((id) => id !== recipeId)
            : [...prevSaved, recipeId]
        );
        setRecipes((prevRecipes) =>
          prevRecipes.map((recipe) =>
            recipe._id === recipeId
              ? { ...recipe, savedBy: response.data.savedByCount }
              : recipe
          )
        );
      }
    } catch (error) {
      console.error("Error saving recipe:", error);
      showError("An error occurred while saving the recipe");
    }
  };

  const renderRecipeCards = (recipes) =>
    recipes.map((recipe) => (
      <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
        <CardMedia
          component="img"
          height="200"
          image={`${config.serverUrl}/uploads/${recipe.image.replace(
            /^\/?uploads\/?/,
            ""
          )}`}
          alt={recipe.name}
        />
        <CardContent sx={{ flexGrow: 1 }}>
          <Typography gutterBottom variant="h5" component="div">
            {recipe.name}
          </Typography>
          <Box display="flex" alignItems="center" mb={2}>
            <AccessTimeIcon sx={{ mr: 1 }} />
            <Typography variant="body2" color="text.secondary">
              {recipe.preparationTime}
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary" paragraph>
            Ingredients: {recipe.ingredients.slice(0, 3).join(", ")}
            {recipe.ingredients.length > 3 && "..."}
          </Typography>

          <Paper
            elevation={3}
            sx={{
              maxHeight: 200,
              overflowY: "auto",
              padding: 2,
              backgroundColor: "#f8f8f8",
              borderRadius: 2,
              "&::-webkit-scrollbar": {
                width: "6px",
              },
              "&::-webkit-scrollbar-track": {
                backgroundColor: "#f1f1f1",
              },
              "&::-webkit-scrollbar-thumb": {
                backgroundColor: "#888",
                borderRadius: "3px",
              },
              "&::-webkit-scrollbar-thumb:hover": {
                backgroundColor: "#555",
              },
            }}
          >
            {recipe.directions.map((step, index) => (
              <Box
                key={index}
                sx={{ mb: 2, display: "flex", alignItems: "flex-start" }}
              >
                <Typography variant="body2">{step}</Typography>
              </Box>
            ))}
          </Paper>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mt={2}
          >
            <Box>
              <IconButton onClick={() => handleLikeRecipe(recipe._id)}>
                {userLikedRecipes.includes(recipe._id) ? (
                  <FavoriteIcon color="error" />
                ) : (
                  <FavoriteBorderIcon />
                )}
              </IconButton>
              <Typography variant="body2" component="span">
                {recipe.likeCount} likes
              </Typography>
            </Box>
            <Box>
              <IconButton onClick={() => handleSaveRecipe(recipe._id)}>
                {userSavedRecipes.includes(recipe._id) ? (
                  <BookmarkIcon color="primary" />
                ) : (
                  <BookmarkBorderIcon />
                )}
              </IconButton>
              <Typography variant="body2" component="span">
                {userSavedRecipes.includes(recipe._id) ? "Saved" : "Save"}
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>
    ));

  return (
    <div
      style={{
        padding: "20px",
        backgroundColor: "#f0f2f5",
        minHeight: "100vh",
      }}
    >
      <Card style={{ marginBottom: "20px" }}>
        <Row gutter={[16, 16]} align="middle">
          <Col>
            <Avatar size={64} src={`${config.serverUrl}${userData?.avatar}`} />
          </Col>
          <Col>
            <Title level={4}>Welcome, {userData?.name}</Title>
            <Text>My Coins: {userData?.coins}</Text>
          </Col>
        </Row>
        <Divider />
        <Row gutter={[16, 16]} justify="center">
          {/* Counts with links */}
          <Col>
            <ScrollLink to="savedRecipesSection" smooth duration={500}>
              <Text style={{ cursor: "pointer" }}>
                Saved Recipes: {userData?.savedRecipesCount || 0}
              </Text>
            </ScrollLink>
          </Col>
          <Col>
            <ScrollLink to="likedRecipesSection" smooth duration={500}>
              <Text style={{ cursor: "pointer" }}>
                Liked Recipes: {userData?.likedRecipesCount || 0}
              </Text>
            </ScrollLink>
          </Col>
          <Col>
            <ScrollLink to="boughtRecipesSection" smooth duration={500}>
              <Text style={{ cursor: "pointer" }}>
                Bought Recipes: {userData?.boughtRecipesCount || 0}
              </Text>
            </ScrollLink>
          </Col>
          <Col>
            <ScrollLink to="myRecipesSection" smooth duration={500}>
              <Text style={{ cursor: "pointer" }}>
                My Recipes: {userData?.myRecipesCount || 0}
              </Text>
            </ScrollLink>
          </Col>
        </Row>
      </Card>

      {/* Recipe Sections */}
      <div id="savedRecipesSection">
        <Card
          title="Saved Recipes"
          bordered={false}
          style={{ marginTop: "20px" }}
        >
          {savedRecipes.length > 0 ? (
            renderRecipeCards(savedRecipes)
          ) : (
            <Text>No saved recipes found.</Text>
          )}
        </Card>
      </div>
      <div id="likedRecipesSection" style={{ marginTop: "20px" }}>
        <Card title="Liked Recipes" bordered={false}>
          <Text>Details about liked recipes go here...</Text>
        </Card>
      </div>
      <div id="boughtRecipesSection" style={{ marginTop: "20px" }}>
        <Card title="Bought Recipes" bordered={false}>
          <Text>Details about bought recipes go here...</Text>
        </Card>
      </div>
      <div id="myRecipesSection" style={{ marginTop: "20px" }}>
        <Card title="My Recipes" bordered={false}>
          <Button type="primary" style={{ marginBottom: "10px" }}>
            Add Recipe
          </Button>
          <Upload
            action={`${config.serverUrl}/api/recipes/upload`}
            listType="picture-card"
            fileList={fileList}
            onPreview={handlePreview}
            onChange={handleChange}
            maxCount={3}
            beforeUpload={(file) => {
              const isImage = file.type.startsWith("image/");
              if (!isImage) {
                message.error("You can only upload image files!");
              }
              return isImage || Upload.LIST_IGNORE;
            }}
          >
            {fileList.length >= 3 ? null : uploadButton}
          </Upload>
        </Card>
      </div>

      {/* Preview Image */}
      {previewImage && (
        <Image
          wrapperStyle={{ display: "none" }}
          preview={{
            visible: previewOpen,
            onVisibleChange: (visible) => setPreviewOpen(visible),
            afterOpenChange: (visible) => !visible && setPreviewImage(""),
          }}
          src={previewImage}
        />
      )}
    </div>
  );
};

export default Dashboard;
