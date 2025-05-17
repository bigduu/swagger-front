import React, { useEffect } from "react";
import { ConfigProvider, theme } from "antd";
import AppLayout from "./components/Layout";

const App: React.FC = () => {
  // 在组件挂载后启用动画
  useEffect(() => {
    // 延迟添加动画类，等待DOM布局稳定
    const timer = setTimeout(() => {
      document.documentElement.classList.add("spotlight-ready");
    }, 1000); // 1秒后启用动画

    return () => clearTimeout(timer);
  }, []);

  return (
    <ConfigProvider
      theme={{
        algorithm: theme.darkAlgorithm,
        token: {
          colorPrimary: "#0A0A31",
        },
      }}
    >
      <AppLayout />
    </ConfigProvider>
  );
};

export default App;
