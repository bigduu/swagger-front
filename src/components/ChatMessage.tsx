import React from "react";
import { Button, Space, Tooltip, Typography, theme, Avatar } from "antd";
import {
  UserOutlined,
  RobotOutlined,
  DownloadOutlined,
  FileTextOutlined,
} from "@ant-design/icons";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

const { Text } = Typography;
const { useToken } = theme;

export interface ChatMessageProps {
  content: string;
  timestamp: string;
  isUser: boolean;
  fileUrl?: string;
  fileName?: string;
  onDownload?: (fileUrl: string, fileName: string) => void;
}

const ChatMessage: React.FC<ChatMessageProps> = ({
  content,
  timestamp,
  isUser,
  fileUrl,
  fileName,
  onDownload,
}) => {
  const { token } = useToken();

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString() + " " + date.toLocaleDateString();
  };

  // User and system message colors - Brightened user color
  const userColor = "#00b8ff";
  const systemColor = token.colorSuccess;

  return (
    <div
      style={{
        padding: token.paddingSM,
        background: isUser
          ? "rgba(0, 200, 255, 0.2)" // Brighter, more vibrant blue background
          : "rgba(0, 130, 252, 0.15)",
        borderRadius: token.borderRadiusLG,
        marginBottom: token.marginSM,
        textAlign: isUser ? "right" : "left",
        boxShadow: isUser
          ? "0 4px 12px rgba(0, 140, 255, 0.3)" // Brighter glow
          : "0 4px 12px rgba(0, 130, 252, 0.1)",
        border: isUser
          ? "1px solid rgba(0, 200, 200, 0.2)" // More visible border
          : "1px solid rgba(0, 130, 252, 0.2)",
        position: "relative",
        overflow: "hidden",
        transform: "translateZ(0)",
        willChange: "transform",
        contain: "layout style paint",
        minHeight: "80px", // 添加最小高度
        width: "100%", // 确保宽度固定
        boxSizing: "border-box", // 确保padding不会增加元素宽度
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          marginBottom: token.marginSM,
          justifyContent: isUser ? "flex-end" : "flex-start",
          contain: "layout style",
          minHeight: "24px", // 使用minHeight而不是固定高度
          maxHeight: "24px", // 限制最大高度
          overflow: "hidden", // 超出部分隐藏
        }}
      >
        {!isUser && (
          <Avatar
            icon={<RobotOutlined />}
            style={{
              backgroundColor: systemColor,
              marginRight: token.marginXS,
              transform: "translateZ(0)",
            }}
            size="small"
          />
        )}
        <Text
          style={{
            color: isUser ? userColor : systemColor,
            fontWeight: isUser ? 600 : 400, // Make user text bolder
            fontSize: "14px",
          }}
        >
          {isUser ? "You" : "System"} • {formatTime(timestamp)}
        </Text>
        {isUser && (
          <Avatar
            icon={<UserOutlined />}
            style={{
              backgroundColor: userColor,
              marginLeft: token.marginXS,
              boxShadow: "0 0 8px rgba(0, 184, 255, 0.6)", // Add glow effect
              transform: "translateZ(0)",
            }}
            size="small"
          />
        )}
      </div>

      <div
        style={{
          textAlign: "left",
          color: isUser
            ? "rgba(255, 255, 255, 0.95)"
            : token.colorTextLightSolid, // Brighter text for user messages
          padding: `0 ${token.paddingSM}px`,
          contain: "content",
          minHeight: "20px", // 最小内容高度
          width: "100%", // 确保内容区域宽度固定
          boxSizing: "border-box", // 确保padding不会增加元素宽度
        }}
      >
        <ReactMarkdown
          components={{
            code: ({ node, inline, className, children, ...props }: any) => {
              const match = /language-(\w+)/.exec(className || "");
              return !inline && match ? (
                <SyntaxHighlighter
                  style={vscDarkPlus as any}
                  language={match[1]}
                  PreTag="div"
                  {...props}
                >
                  {String(children).replace(/\n$/, "")}
                </SyntaxHighlighter>
              ) : (
                <code
                  className={className}
                  style={{
                    background: "rgba(0, 0, 0, 0.3)",
                    padding: "2px 4px",
                    borderRadius: "3px",
                  }}
                  {...props}
                >
                  {children}
                </code>
              );
            },
            p: ({ children }) => (
              <p
                style={{
                  margin: `${token.marginXS}px 0`,
                  contain: "content",
                }}
              >
                {children}
              </p>
            ),
            h1: ({ children }) => (
              <h1
                style={{
                  fontSize: "1.5em",
                  fontWeight: "bold",
                  margin: `${token.marginSM}px 0`,
                  borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
                  paddingBottom: token.paddingXS,
                }}
              >
                {children}
              </h1>
            ),
            h2: ({ children }) => (
              <h2
                style={{
                  fontSize: "1.3em",
                  fontWeight: "bold",
                  margin: `${token.marginSM}px 0`,
                  borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
                  paddingBottom: token.paddingXXS,
                }}
              >
                {children}
              </h2>
            ),
            h3: ({ children }) => (
              <h3
                style={{
                  fontSize: "1.1em",
                  fontWeight: "bold",
                  margin: `${token.marginSM}px 0`,
                }}
              >
                {children}
              </h3>
            ),
            ul: ({ children }) => (
              <ul style={{ paddingLeft: token.paddingLG }}>{children}</ul>
            ),
            ol: ({ children }) => (
              <ol style={{ paddingLeft: token.paddingLG }}>{children}</ol>
            ),
            li: ({ children }) => (
              <li style={{ margin: `${token.marginXXS}px 0` }}>{children}</li>
            ),
            blockquote: ({ children }) => (
              <blockquote
                style={{
                  borderLeft: `4px solid rgba(255, 255, 255, 0.2)`,
                  paddingLeft: token.paddingSM,
                  margin: `${token.marginSM}px 0`,
                  color: "rgba(255, 255, 255, 0.7)",
                }}
              >
                {children}
              </blockquote>
            ),
          }}
        >
          {content}
        </ReactMarkdown>
      </div>

      {fileUrl && fileName && (
        <div
          style={{
            marginTop: token.marginSM,
            background: "rgba(0, 0, 0, 0.2)",
            padding: token.paddingXS,
            borderRadius: token.borderRadiusSM,
            display: "inline-block",
            contain: "content",
            minHeight: "32px", // 使用minHeight而不是固定高度
            transform: "translateZ(0)",
          }}
        >
          <Space>
            <Button
              type="text"
              icon={<FileTextOutlined />}
              onClick={() => onDownload?.(fileUrl, fileName)}
              style={{
                padding: 0,
                height: "auto",
                color: "rgba(255, 255, 255, 0.85)",
                transform: "translateZ(0)",
              }}
            >
              {fileName}
            </Button>
            <Tooltip title="Download file">
              <Button
                type="primary"
                shape="circle"
                size="small"
                icon={<DownloadOutlined />}
                onClick={() => onDownload?.(fileUrl, fileName)}
                style={{
                  transform: "translateZ(0)",
                }}
              />
            </Tooltip>
          </Space>
        </div>
      )}
    </div>
  );
};

export default React.memo(ChatMessage);
