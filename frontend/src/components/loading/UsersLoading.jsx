import React from "react";
import { useThemeStore } from "../../store/useThemeStore";

const UsersLoading = () => {
  const {theme}=useThemeStore()
  return (
    <div className="flex flex-col space-y-4 w-full">
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className={`flex items-center w-full border-b border-gray-300 p-2 ${theme === "dark" ? "hover:bg-gray-700":"hover:bg-gray-50"} transition-shadow duration-300`}
        >
          {/* Profile Skeleton */}
          <div className="w-14 h-14 skeleton rounded-full"></div>

          {/* Name & Status Skeleton */}
          <div className="ml-4 flex-1">
            <div className="h-4 w-32 skeleton rounded mb-2"></div>
            <div className="h-3 w-20 skeleton rounded"></div>
          </div>

          {/* Settings Icon Skeleton */}
          <div className="relative">
            <div className="size-6 skeleton rounded-full"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default UsersLoading;
