import React, { useState } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  ZoomableGroup,
} from "react-simple-maps";
import { Tooltip } from "antd";
import { InfoCircleOutlined } from "@ant-design/icons";

// Import your GeoJSON
import geoData from "./utils/geo.json";

const MapComponent = ({
  data = [],
  onRegionClick,
  width = 800,
  height = 600,
}) => {
  console.log("geoData: ", geoData);
  const [selectedRegion, setSelectedRegion] = useState(null);

  const handleRegionClick = (geo) => {
    setSelectedRegion(geo.properties);
    onRegionClick && onRegionClick(geo.properties);
  };

  return (
    <div className="relative w-full">
      <ComposableMap
        width={width}
        height={height}
        projection="geoMercator"
        projectionConfig={{
          center: [39.5, 8.6],
          scale: 4500,
        }}
        className="bg-gray-100 border rounded-lg"
      >
        <ZoomableGroup zoom={1}>
          <Geographies geography={geoData}>
            {({ geographies }) =>
              geographies.map((geo) => (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  onClick={() => handleRegionClick(geo)}
                  style={{
                    default: {
                      fill:
                        selectedRegion &&
                        selectedRegion.name === geo.properties.name
                          ? "#1890ff"
                          : "#E1E5E8",
                      outline: "none",
                      stroke: "#627BC1",
                      strokeWidth: 0.5,
                    },
                    hover: {
                      fill: "#1890ff",
                      outline: "none",
                      cursor: "pointer",
                    },
                  }}
                />
              ))
            }
          </Geographies>

          {data.map((point, idx) => (
            <Marker key={idx} coordinates={[point.longitude, point.latitude]}>
              <circle r={5} fill="#FF4D4F" stroke="#fff" strokeWidth={2} />
              <text
                textAnchor="middle"
                y={-10}
                style={{ fontSize: "10px", fill: "#333" }}
              >
                {point.name}
              </text>
            </Marker>
          ))}
        </ZoomableGroup>
      </ComposableMap>

      {/* Region Info Overlay */}
      {selectedRegion && (
        <div className="absolute top-4 right-4 bg-white p-3 rounded shadow-md z-10 max-w-xs">
          <h3 className="font-bold mb-2">{selectedRegion.name}</h3>
          <Tooltip title="Additional region information">
            <InfoCircleOutlined className="text-blue-500 cursor-pointer" />
          </Tooltip>
        </div>
      )}

      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-white p-3 rounded shadow-md z-10">
        <div className="flex items-center mb-2">
          <div className="w-4 h-4 mr-2 bg-[#E1E5E8]"></div>
          <span>Regions</span>
        </div>
        <div className="flex items-center mb-2">
          <div className="w-4 h-4 mr-2 bg-[#1890ff]"></div>
          <span>Selected Region</span>
        </div>
        {data.length > 0 && (
          <div className="flex items-center">
            <div className="w-4 h-4 mr-2 bg-[#FF4D4F] rounded-full"></div>
            <span>Data Points</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default MapComponent;
