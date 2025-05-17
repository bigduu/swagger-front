import React, { useState, useEffect, useRef } from "react";
import {
  Card,
  Input,
  Button,
  Space,
  Spin,
  message,
  List,
  Typography,
  Layout,
  Row,
  Col,
  theme,
  Divider,
  Tooltip,
} from "antd";
import {
  SendOutlined,
  LoadingOutlined,
  DeleteOutlined,
  UploadOutlined,
  QuestionCircleOutlined,
  ExperimentOutlined,
} from "@ant-design/icons";
import ChatMessage from "./ChatMessage";

const { useToken } = theme;
const { Content } = Layout;
const { Title } = Typography;

interface ChatPanelProps {
  style?: React.CSSProperties;
  className?: string;
}

interface ChatMessage {
  content: string;
  timestamp: string;
  isUser: boolean;
  fileUrl?: string;
  fileName?: string;
  fileContent?: string; // Store file content instead of URL for persistence
}

const STORAGE_KEY = "chat_history";

// Example markdown content for better demo
const EXAMPLE_RESPONSE = `
# Response Title

Here's the information you requested:

## Section 1
- First bullet point
- Second bullet point
- Third bullet point

## Code Example
\`\`\`javascript
function exampleCode() {
  const greeting = "Hello, world!";
  console.log(greeting);
  return greeting;
}
\`\`\`

> This is a blockquote with important information.

Visit [Example Link](https://example.com) for more details.
`;

const ChatPanel: React.FC<ChatPanelProps> = ({ style, className }) => {
  const { token } = useToken();
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const blobUrlsRef = useRef<{ [key: string]: string }>({});

  // Load chat history from localStorage on component mount
  useEffect(() => {
    const savedHistory = localStorage.getItem(STORAGE_KEY);
    if (savedHistory) {
      try {
        const parsedHistory: ChatMessage[] = JSON.parse(savedHistory);

        // Regenerate blob URLs for messages with fileContent
        const updatedHistory = parsedHistory.map((msg) => {
          if (msg.fileContent && msg.fileName) {
            const blob = new Blob([msg.fileContent], { type: "text/plain" });
            const url = URL.createObjectURL(blob);

            // Store the URL reference for cleanup later
            blobUrlsRef.current[msg.fileName] = url;

            return {
              ...msg,
              fileUrl: url,
            };
          }
          return msg;
        });

        setChatHistory(updatedHistory);
      } catch (error) {
        console.error("Failed to parse chat history:", error);
        localStorage.removeItem(STORAGE_KEY);
      }
    }
  }, []);

  // Save chat history to localStorage whenever it changes
  useEffect(() => {
    // When saving to localStorage, store the fileContent instead of fileUrl
    const historyForStorage = chatHistory.map((msg) => {
      if (msg.fileUrl && !msg.fileContent) {
        // We need to clone the message for storage
        return { ...msg, fileUrl: undefined };
      }
      return msg;
    });

    localStorage.setItem(STORAGE_KEY, JSON.stringify(historyForStorage));
  }, [chatHistory]);

  // Clean up blob URLs when component unmounts
  useEffect(() => {
    return () => {
      Object.values(blobUrlsRef.current).forEach((url) => {
        URL.revokeObjectURL(url);
      });
    };
  }, []);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current && chatHistory.length > 0) {
      const animationId = window.requestAnimationFrame(() => {
        try {
          // 先获取当前滚动容器
          const scrollContainer = messagesEndRef.current?.parentElement;
          if (scrollContainer) {
            // 直接设置滚动位置，避免平滑滚动引起的动画
            scrollContainer.scrollTop = scrollContainer.scrollHeight;
          }
        } catch (e) {
          console.error("Scroll error:", e);
        }
      });
      return () => window.cancelAnimationFrame(animationId);
    }
  }, [chatHistory]);

  // 将消息添加到历史记录的函数
  const addMessageToHistory = (message: ChatMessage) => {
    // 使用函数式更新，避免直接替换整个数组
    setChatHistory((prev) => {
      const newHistory = [...prev, message];
      // 异步保存到 localStorage
      setTimeout(() => {
        const historyForStorage = newHistory.map((msg) => {
          if (msg.fileUrl && !msg.fileContent) {
            return { ...msg, fileUrl: undefined };
          }
          return msg;
        });
        localStorage.setItem(STORAGE_KEY, JSON.stringify(historyForStorage));
      }, 0);
      return newHistory;
    });
  };

  // 处理发送消息
  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const userMessage: ChatMessage = {
      content: inputValue.trim(),
      timestamp: new Date().toISOString(),
      isUser: true,
    };

    // 添加用户消息到历史记录
    addMessageToHistory(userMessage);
    setInputValue("");
    setIsLoading(true);

    // Simulate API call with requestAnimationFrame for更平滑的UI更新
    requestAnimationFrame(() => {
      setTimeout(() => {
        // Sample file content
        const fileContent = "Sample file content";

        // Create blob URL
        const blob = new Blob([fileContent], { type: "text/plain" });
        const downloadUrl = URL.createObjectURL(blob);

        // Store URL reference
        const fileName = "response.txt";
        blobUrlsRef.current[fileName] = downloadUrl;

        // Add system response to history with file download link
        const systemResponse: ChatMessage = {
          content: EXAMPLE_RESPONSE,
          timestamp: new Date().toISOString(),
          isUser: false,
          fileUrl: downloadUrl,
          fileName: fileName,
          fileContent: fileContent,
        };

        addMessageToHistory(systemResponse);
        setIsLoading(false);
        message.success("Message processed and file generated!");
      }, 2000);
    });
  };

  const clearHistory = () => {
    // Revoke any object URLs to prevent memory leaks
    Object.values(blobUrlsRef.current).forEach((url) => {
      URL.revokeObjectURL(url);
    });
    blobUrlsRef.current = {};

    setChatHistory([]);
    localStorage.removeItem(STORAGE_KEY);
    message.success("Chat history cleared");
  };

  const handleDownload = (fileUrl: string, fileName: string) => {
    console.log("Downloading file:", { fileUrl, fileName }); // Debug log

    try {
      const a = document.createElement("a");
      a.href = fileUrl;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (error) {
      console.error("Error downloading file:", error);
      message.error("Failed to download file");
    }
  };

  return (
    <Card
      style={{ ...style, height: "100%" }}
      bodyStyle={{
        height: "100%",
        padding: token.padding,
      }}
      bordered={false}
      className={className}
      styles={{
        body: {
          background: "transparent",
          borderRadius: token.borderRadiusLG,
          display: "flex",
          flexDirection: "column",
        },
      }}
    >
      <Layout hasSider={false} style={{ background: "transparent" }}>
        <Content
          style={{ display: "flex", flexDirection: "column", height: "100%" }}
        >
          {/* Header Section */}
          <Row
            justify="space-between"
            align="middle"
            style={{
              marginBottom: token.marginSM,
              padding: `${token.paddingXS}px ${token.paddingLG}px`,
              background: "rgba(0, 0, 0, 0.2)",
              borderRadius: token.borderRadiusLG,
              backdropFilter: "blur(8px)",
            }}
          >
            <Col>
              <Space>
                <ExperimentOutlined
                  style={{ color: token.colorPrimary, fontSize: "24px" }}
                />
                <Title
                  level={3}
                  style={{ color: "rgba(255, 255, 255, 0.85)", margin: 0 }}
                >
                  AI Assistant
                </Title>
              </Space>
            </Col>
            <Col>
              <Space>
                <Tooltip title="Need help?">
                  <Button
                    type="text"
                    shape="circle"
                    icon={<QuestionCircleOutlined />}
                    style={{ color: "rgba(255, 255, 255, 0.65)" }}
                  />
                </Tooltip>
                {chatHistory.length > 0 && (
                  <Button
                    icon={<DeleteOutlined />}
                    danger
                    onClick={clearHistory}
                  >
                    Clear History
                  </Button>
                )}
              </Space>
            </Col>
          </Row>

          <Divider
            style={{
              margin: `${token.marginXS}px 0`,
              borderColor: "rgba(255, 255, 255, 0.1)",
            }}
          />

          {/* Messages Section */}
          <Content
            className="hide-scrollbar"
            style={{
              flex: 1,
              overflow: "auto",
              marginBottom: token.marginSM,
              padding: token.paddingMD,
              maxHeight: "calc(100vh - 240px)",
              minHeight: "200px",
              willChange: "transform", // Add will-change for better performance
              transform: "translateZ(0)", // Force GPU acceleration
              contain: "content", // CSS containment for better performance
              position: "relative", // 相对定位，确保内部元素绝对定位基于此
            }}
          >
            {chatHistory.length === 0 ? (
              <Row
                justify="center"
                align="middle"
                style={{
                  height: "100%",
                  flexDirection: "column",
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                }}
              >
                <Col>
                  <ExperimentOutlined
                    style={{
                      fontSize: "48px",
                      color: "rgba(255, 255, 255, 0.3)",
                    }}
                  />
                </Col>
                <Col style={{ marginTop: token.marginSM }}>
                  <Typography.Text
                    type="secondary"
                    style={{ fontSize: "16px" }}
                  >
                    No message history yet. Start a conversation!
                  </Typography.Text>
                </Col>
              </Row>
            ) : (
              <List
                dataSource={chatHistory}
                split={false}
                style={{
                  width: "100%",
                  boxSizing: "border-box",
                  position: "relative",
                }}
                renderItem={(msg) => (
                  <List.Item
                    style={{
                      padding: 0,
                      border: "none",
                      width: "100%",
                    }}
                  >
                    <div style={{ width: "100%" }}>
                      <ChatMessage
                        content={msg.content}
                        timestamp={msg.timestamp}
                        isUser={msg.isUser}
                        fileUrl={msg.fileUrl}
                        fileName={msg.fileName}
                        onDownload={handleDownload}
                      />
                    </div>
                  </List.Item>
                )}
              />
            )}
            <div
              ref={messagesEndRef}
              style={{ height: "1px", clear: "both" }}
            />
          </Content>

          {/* Input Section */}
          <div
            style={{
              padding: token.paddingSM,
              background: "rgba(0, 0, 0, 0.2)",
              borderRadius: token.borderRadiusLG,
              backdropFilter: "blur(8px)",
            }}
          >
            <Space.Compact block>
              <Tooltip title="Upload a file">
                <Button
                  icon={<UploadOutlined />}
                  style={{
                    background: "rgba(255, 255, 255, 0.1)",
                    borderColor: "rgba(255, 255, 255, 0.2)",
                    color: "white",
                  }}
                />
              </Tooltip>
              <Input
                placeholder="Type your message..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onPressEnter={handleSendMessage}
                disabled={isLoading}
                styles={{
                  input: {
                    background: "rgba(255, 255, 255, 0.1)",
                    color: token.colorWhite,
                    borderColor: "rgba(255, 255, 255, 0.2)",
                  },
                }}
              />
              <Button
                type="primary"
                icon={isLoading ? <LoadingOutlined /> : <SendOutlined />}
                onClick={handleSendMessage}
                disabled={isLoading || !inputValue.trim()}
              >
                {isLoading ? "Processing..." : "Send"}
              </Button>
            </Space.Compact>

            {isLoading && (
              <Row justify="center" style={{ marginTop: token.marginSM }}>
                <Col>
                  <Spin size="small" tip="Processing your request..." />
                </Col>
              </Row>
            )}
          </div>
        </Content>
      </Layout>
    </Card>
  );
};

export default ChatPanel;
