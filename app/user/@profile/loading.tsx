"use client";

import { Skeleton } from "antd";

export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="bg-[#22407F] text-white text-center py-6">
          <div className="flex justify-center mb-4">
            <div className="w-24 h-24 bg-[#BB9271] rounded-full flex items-center justify-center">
              <Skeleton.Avatar
                active={true}
                shape="circle"
                className="w-12 h-12 text-white"
              />
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="mb-4 flex items-center">
            <Skeleton paragraph />
          </div>

          <div className="mb-4 flex items-center">
            <Skeleton paragraph />
          </div>

          <div className="mb-4 flex items-center">
            <Skeleton paragraph />
          </div>
          <div className="mb-4 flex items-center">
            <Skeleton paragraph />
          </div>
        </div>
      </div>
    </div>
  );
}
