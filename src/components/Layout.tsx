import React from "react";
import { Layout, Typography } from "antd";
import AppList from "./AppList.tsx";
import ChatPanel from "./ChatPanel.tsx";
import CompanyLogo from "./CompanyLogo.tsx";

const { Header, Content } = Layout;
const { Title } = Typography;

const AppLayout: React.FC = () => {
  return (
    <Layout style={{ height: "100vh", overflow: "hidden" }}>
      <Header
        style={{
          background: "#0A0A31",
          padding: "0 24px",
          display: "flex",
          alignItems: "center",
          height: "64px",
          position: "relative",
          zIndex: 2,
        }}
      >
        <CompanyLogo />
        <Title
          level={3}
          style={{ color: "white", margin: 0, marginLeft: "12px" }}
        >
          Company Apps Connector
        </Title>
        <div style={{ marginLeft: "16px", color: "#b0b0b0" }}>AI Adient</div>
      </Header>
      <Content
        className="spotlight-background"
        style={{
          padding: "24px",
          height: "calc(100vh - 64px)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          className="spotlight-extra spotlight-1"
          style={{ zIndex: 0 }}
        ></div>
        <div
          className="spotlight-extra spotlight-2"
          style={{ zIndex: 0 }}
        ></div>
        <div
          className="spotlight-extra spotlight-3"
          style={{ zIndex: 0 }}
        ></div>

        <div
          style={{
            height: "calc(100vh - 112px)",
            position: "absolute",
            top: "24px",
            left: "24px",
            right: "24px",
            bottom: "24px",
            zIndex: 1,
            display: "flex",
          }}
        >
          <ChatPanel
            style={{
              flex: 1,
              marginRight: "24px",
              borderRadius: "12px",
              overflow: "hidden",
              maxHeight: "100%",
              willChange: "transform",
            }}
            className="glass-effect"
          />
          <AppList
            style={{
              width: "320px",
              borderRadius: "12px",
              overflow: "hidden",
              maxHeight: "100%",
              willChange: "transform",
            }}
            className="glass-effect"
          />
        </div>
      </Content>
    </Layout>
  );
};

export default AppLayout;
