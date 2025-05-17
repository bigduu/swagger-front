import React, { memo } from "react";
import { Card, List, Avatar, Switch } from "antd";
import {
  GithubOutlined,
  CodeOutlined,
  CloudOutlined,
  AppstoreOutlined,
  DatabaseOutlined,
  DashboardOutlined,
} from "@ant-design/icons";

interface AppItem {
  id: string;
  name: string;
  icon: React.ReactNode;
  selected: boolean;
  color: string;
}

const APPS_DATA: AppItem[] = [
  {
    id: "1",
    name: "GitHaIm",
    icon: <GithubOutlined style={{ color: "#fff" }} />,
    selected: true,
    color: "#6e40c9",
  },
  {
    id: "2",
    name: "CopIlot Jenkes",
    icon: <CodeOutlined style={{ color: "#fff" }} />,
    selected: true,
    color: "#ff5722",
  },
  {
    id: "3",
    name: "Bitgucc Ussague",
    icon: <CloudOutlined style={{ color: "#fff" }} />,
    selected: true,
    color: "#4caf50",
  },
  {
    id: "4",
    name: "Pod Master",
    icon: <DatabaseOutlined style={{ color: "#fff" }} />,
    selected: true,
    color: "#2196f3",
  },
  {
    id: "5",
    name: "Pod Master",
    icon: <CloudOutlined style={{ color: "#fff" }} />,
    selected: true,
    color: "#9c27b0",
  },
  {
    id: "6",
    name: "Service NOW",
    icon: <DashboardOutlined style={{ color: "#fff" }} />,
    selected: true,
    color: "#ff9800",
  },
  {
    id: "7",
    name: "Conflolange",
    icon: <AppstoreOutlined style={{ color: "#fff" }} />,
    selected: true,
    color: "#e91e63",
  },
];

interface AppListProps {
  style?: React.CSSProperties;
  className?: string;
}

// Memoize individual list items for better performance
const AppListItem = memo(
  ({ item, onToggle }: { item: AppItem; onToggle: (id: string) => void }) => (
    <List.Item
      style={{
        padding: "12px 24px",
        borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
      }}
    >
      <List.Item.Meta
        avatar={
          <Avatar
            style={{
              background: item.selected
                ? item.color
                : "rgba(255, 255, 255, 0.1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {item.icon}
          </Avatar>
        }
        title={<span style={{ color: "white" }}>{item.name}</span>}
        description={
          <span style={{ color: "rgba(255, 255, 255, 0.5)" }}>
            App {item.id}
          </span>
        }
      />
      <Switch
        checked={item.selected}
        onChange={() => onToggle(item.id)}
        size="small"
        style={{ backgroundColor: item.selected ? "#44b03c" : undefined }}
      />
    </List.Item>
  )
);

const AppList: React.FC<AppListProps> = ({ style, className }) => {
  const [apps, setApps] = React.useState<AppItem[]>(APPS_DATA);

  const handleToggleApp = React.useCallback((id: string) => {
    setApps((prevApps) =>
      prevApps.map((app) =>
        app.id === id ? { ...app, selected: !app.selected } : app
      )
    );
  }, []);

  return (
    <Card
      title="Apps"
      style={{
        ...style,
        background: "transparent",
        color: "white",
        borderRadius: "8px",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        willChange: "transform",
        transform: "translateZ(0)",
      }}
      className={`${className} glass-effect`}
      headStyle={{
        color: "white",
        borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
      }}
      bodyStyle={{
        padding: "0",
        flex: 1,
        overflow: "auto",
        display: "flex",
        flexDirection: "column",
        contain: "content",
      }}
      bordered={false}
    >
      <List
        style={{ flex: 1 }}
        dataSource={apps}
        renderItem={(item) => (
          <AppListItem item={item} onToggle={handleToggleApp} />
        )}
      />
    </Card>
  );
};

export default memo(AppList);
