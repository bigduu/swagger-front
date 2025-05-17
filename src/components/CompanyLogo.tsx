import React from "react";

const CompanyLogo: React.FC = () => {
  return (
    <div
      style={{
        width: "36px",
        height: "36px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <svg
        width="36"
        height="36"
        viewBox="0 0 36 36"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect width="36" height="36" fill="#ffffff" />
        <polygon points="0,0 18,0 0,18" fill="#DB0011" />
        <polygon points="36,0 36,18 18,0" fill="#DB0011" />
        <polygon points="0,36 0,18 18,36" fill="#DB0011" />
        <polygon points="36,36 18,36 36,18" fill="#DB0011" />
      </svg>
    </div>
  );
};

export default CompanyLogo;
