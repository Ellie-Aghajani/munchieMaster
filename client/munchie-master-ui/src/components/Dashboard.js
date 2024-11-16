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
  Carousel,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import axios from "axios";
import config from "../config";

const { Title, Text } = Typography;

const Dashboard = () => {
  const [userData, setUserData] = useState(null);
  const [savedRecipes, setSavedRecipes] = useState([]);
  const [likedRecipes, setLikedRecipes] = useState([]);
  const [boughtRecipes, setBoughtRecipes] = useState([]);
  const [myRecipes, setMyRecipes] = useState([]);
  const [fileList, setFileList] = useState([]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");

  // Function to convert image file to base64
  const getBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const summaryResponse = await axios.get(
          `${config.serverUrl}/api/dashboard/summary`,
          { headers: { "x-auth-token": localStorage.getItem("token") } }
        );

        const savedRecipesResponse = await axios.get(
          `${config.serverUrl}/api/dashboard/saved-recipes`,
          { headers: { "x-auth-token": localStorage.getItem("token") } }
        );

        const likedRecipesResponse = await axios.get(
          `${config.serverUrl}/api/dashboard/liked-recipes`,
          { headers: { "x-auth-token": localStorage.getItem("token") } }
        );

        const boughtRecipesResponse = await axios.get(
          `${config.serverUrl}/api/dashboard/bought-recipes`,
          { headers: { "x-auth-token": localStorage.getItem("token") } }
        );

        const myRecipesResponse = await axios.get(
          `${config.serverUrl}/api/dashboard/my-recipes`,
          { headers: { "x-auth-token": localStorage.getItem("token") } }
        );

        setUserData(summaryResponse.data);
        setSavedRecipes(savedRecipesResponse.data);
        setLikedRecipes(likedRecipesResponse.data);
        setBoughtRecipes(boughtRecipesResponse.data);
        setMyRecipes(myRecipesResponse.data);
      } catch (error) {
        message.error("Failed to fetch dashboard data.");
      }
    };

    fetchData();
  }, []);

  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
  };

  const handleChange = ({ fileList: newFileList }) => {
    setFileList(newFileList.slice(0, 3));
  };

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  const renderRecipeCards = (recipes) => {
    return recipes.map((recipe) => (
      <div key={recipe._id}>
        <Card
          hoverable
          cover={
            <img
              alt={recipe.name}
              src={`${config.serverUrl}/uploads/${recipe.image}`}
            />
          }
        >
          <Card.Meta
            title={recipe.name}
            description={`Preparation Time: ${recipe.preparationTime}`}
          />
        </Card>
      </div>
    ));
  };

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
          <Col>
            <Text style={{ cursor: "pointer" }}>
              Saved Recipes: {savedRecipes.length || 0}
            </Text>
          </Col>
          <Col>
            <Text style={{ cursor: "pointer" }}>
              Liked Recipes: {likedRecipes.length || 0}
            </Text>
          </Col>
          <Col>
            <Text style={{ cursor: "pointer" }}>
              Bought Recipes: {boughtRecipes.length || 0}
            </Text>
          </Col>
          <Col>
            <Text style={{ cursor: "pointer" }}>
              My Recipes: {myRecipes.length || 0}
            </Text>
          </Col>
        </Row>
      </Card>

      <div id="savedRecipesSection">
        <Card title="Saved Recipes" bordered={false}>
          <Carousel arrows infinite={false}>
            {renderRecipeCards(savedRecipes)}
          </Carousel>
        </Card>
      </div>
      <div id="likedRecipesSection" style={{ marginTop: "20px" }}>
        <Card title="Liked Recipes" bordered={false}>
          <Carousel arrows infinite={false}>
            {renderRecipeCards(likedRecipes)}
          </Carousel>
        </Card>
      </div>
      <div id="boughtRecipesSection" style={{ marginTop: "20px" }}>
        <Card title="Bought Recipes" bordered={false}>
          <Carousel arrows infinite={false}>
            {renderRecipeCards(boughtRecipes)}
          </Carousel>
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
          <Carousel arrows infinite={false}>
            {renderRecipeCards(myRecipes)}
          </Carousel>
        </Card>
      </div>

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
