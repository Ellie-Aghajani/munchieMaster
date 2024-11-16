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
import { PlusOutlined } from "@ant-design/icons";
import { Link as ScrollLink } from "react-scroll";
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
        setUserData(response.data);
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
          <Text>Details about saved recipes go here...</Text>
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
