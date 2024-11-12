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
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import axios from "axios";
import config from "../config";

const { Title, Text } = Typography;

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
            <Text>Coins: {userData?.coins}</Text>
          </Col>
          <Col>
            <Button
              type="primary"
              onClick={() => message.info("Feature Coming Soon!")}
            >
              Add Coins
            </Button>
          </Col>
        </Row>
        <Row gutter={[16, 16]} style={{ marginTop: "20px" }}>
          <Col>
            <Text>Saved Recipes: {userData?.savedRecipesCount}</Text>
          </Col>
          <Col>
            <Text>Liked Recipes: {userData?.likedRecipesCount}</Text>
          </Col>
          <Col>
            <Text>Bought Recipes: {userData?.boughtRecipesCount}</Text>
          </Col>
          <Col>
            <Text>My Recipes: {userData?.myRecipesCount}</Text>
          </Col>
        </Row>
      </Card>

      {/* Recipe Sections */}
      <Row gutter={[16, 16]}>
        {/* Saved Recipes */}
        <Col span={24}>
          <Card title="Saved Recipes" bordered={false}>
            <Text>{userData?.savedRecipesCount}</Text>
            {/* Saved recipes can be listed here */}
          </Card>
        </Col>

        {/* Liked Recipes */}
        <Col span={24}>
          <Card title="Liked Recipes" bordered={false}>
            <Text>{userData?.likedRecipesCount}</Text>
            {/* Liked recipes can be listed here */}
          </Card>
        </Col>

        {/* Bought Recipes */}
        <Col span={24}>
          <Card title="Bought Recipes" bordered={false}>
            <Text>{userData?.boughtRecipesCount}</Text>
            {/* Bought recipes can be listed here */}
          </Card>
        </Col>

        {/* My Recipes with Image Upload */}
        <Col span={24}>
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
        </Col>
      </Row>

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
