"use client";
// import React, { useState } from "react";
// import {
//   ComposableMap,
//   Geographies,
//   Geography,
//   Marker,
//   ZoomableGroup,
// } from "react-simple-maps";
// import { Tooltip } from "antd";
// import { InfoCircleOutlined } from "@ant-design/icons";

// // Ethiopia GeoJSON (you'll need to source or create this)
// import ethiopiaGeoJson from "./utils/geo.json";

// // Dummy data for demonstration
// const dummyData = [
//   {
//     name: "Ethiopia",
//     latitude: 8.5,
//     longitude: 39.0,
//   },
//   {
//     name: "Addis Ababa",
//     latitude: 9.045,
//     longitude: 38.7468,
//     population: 3.3,
//     description: "Capital city and largest metropolitan area",
//   },
//   {
//     name: "Dire Dawa",
//     latitude: 9.6136,
//     longitude: 41.8669,
//     population: 0.4,
//     description: "Important industrial and transport hub",
//   },
//   {
//     name: "Bahir Dar",
//     latitude: 11.5987,
//     longitude: 37.3892,
//     population: 0.2,
//     description: "Capital of Amhara Region, near Lake Tana",
//   },
// ];

// const EthiopiaMapComponent = ({
//   data = dummyData,
//   width = 800,
//   height = 600,
//   onRegionClick,
// }) => {
//   const [selectedRegion, setSelectedRegion] = useState(null);

//   const handleRegionClick = (geo) => {
//     setSelectedRegion(geo.properties);
//     onRegionClick && onRegionClick(geo.properties);
//   };

//   return (
//     <div className="relative w-full">
//       <ComposableMap
//         width={width}
//         height={height}
//         projection="geoMercator"
//         projectionConfig={{
//           center: [38, 9], // Centered on Kenya/East Africa
//           scale: 2500, // Adjust this to zoom in/out as needed
//         }}
//         className="bg-gray-100 border rounded-lg"
//       >
//         <ZoomableGroup zoom={1}>
//           <Geographies geography={ethiopiaGeoJson}>
//             {({ geographies }) =>
//               geographies.map((geo) => (
//                 <Geography
//                   key={geo.rsmKey}
//                   geography={geo}
//                   onClick={() => handleRegionClick(geo)}
//                   style={{
//                     default: {
//                       fill:
//                         selectedRegion &&
//                         selectedRegion.name === geo.properties.name
//                           ? "#1890ff"
//                           : "#E1E5E8",
//                       outline: "none",
//                       stroke: "#627BC1",
//                       strokeWidth: 0.5,
//                     },
//                     hover: {
//                       fill: "#1890ff",
//                       outline: "none",
//                       cursor: "pointer",
//                     },
//                   }}
//                 />
//               ))
//             }
//           </Geographies>

//           {data.map((point, idx) => (
//             <Marker key={idx} coordinates={[point.longitude, point.latitude]}>
//               <g transform="translate(-12, -12)">
//                 <circle r={8} fill="#FF4D4F" stroke="#fff" strokeWidth={2} />
//                 <Tooltip
//                   title={`${point.name} - Population: ${point.population}M`}
//                   placement="top"
//                 >
//                   <text
//                     x={0}
//                     y={-15}
//                     textAnchor="middle"
//                     style={{
//                       fontSize: "10px",
//                       fill: "#333",
//                       fontWeight: "bold",
//                     }}
//                   >
//                     {point.name}
//                   </text>
//                 </Tooltip>
//               </g>
//             </Marker>
//           ))}
//         </ZoomableGroup>
//       </ComposableMap>

//       {/* Region Info Overlay */}
//       {selectedRegion && (
//         <div className="absolute top-4 right-4 bg-white p-4 rounded-lg shadow-lg z-10 max-w-xs">
//           <div className="flex justify-between items-center mb-2">
//             <h3 className="font-bold text-lg">{selectedRegion.name}</h3>
//             <Tooltip title="Additional region information">
//               <InfoCircleOutlined className="text-blue-500 cursor-pointer" />
//             </Tooltip>
//           </div>
//           <p className="text-sm text-gray-600">
//             {selectedRegion.description ||
//               "No additional information available."}
//           </p>
//         </div>
//       )}

//       {/* Legend */}
//       <div className="absolute bottom-4 left-4 bg-white p-4 rounded-lg shadow-md z-10">
//         <div className="space-y-2">
//           <div className="flex items-center">
//             <div className="w-4 h-4 mr-2 bg-[#E1E5E8] border"></div>
//             <span className="text-sm">Regions</span>
//           </div>
//           <div className="flex items-center">
//             <div className="w-4 h-4 mr-2 bg-[#1890ff]"></div>
//             <span className="text-sm">Selected Region</span>
//           </div>
//           {data.length > 0 && (
//             <div className="flex items-center">
//               <div className="w-4 h-4 mr-2 bg-[#FF4D4F] rounded-full"></div>
//               <span className="text-sm">Data Points</span>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default EthiopiaMapComponent;

import React, { useState, useEffect } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  ZoomableGroup,
  Annotation,
} from "react-simple-maps";
import { Tooltip, Popover, Select, Pagination } from "antd";
import { InfoCircleOutlined } from "@ant-design/icons";

// Ethiopia GeoJSON (you'll need to source or create this)
import ethiopiaGeoJson from "./utils/gadm41_ETH_1.json";

const EthiopiaMapComponent = ({
  data = [],
  width = 800,
  height = 600,
  onRegionClick,
}) => {
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [regionData, setRegionData] = useState({});
  const [hoveredRegion, setHoveredRegion] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  // Process the data to match with GeoJSON regions
  useEffect(() => {
    const processedData = {};

    // Iterate over the data to find regions with values
    data.forEach((item) => {
      Object.keys(item).forEach((key) => {
        // Check if the key is a region (e.g., Afar, Amhara, etc.)
        if (
          ethiopiaGeoJson.features.some(
            (feature) => feature.properties.NAME_1 === key
          )
        ) {
          const regionName = key;
          const regionValue = item[key];

          if (regionValue && !isNaN(regionValue)) {
            if (!processedData[regionName]) {
              processedData[regionName] = {
                values: [],
                total: 0,
              };
            }
            processedData[regionName].values.push(
              parseFloat(regionValue).toFixed(2)
            );
            processedData[regionName].total += parseFloat(regionValue);
          }
        }
      });
    });

    setRegionData(processedData);
  }, [data]);

  // Handle region hover
  const handleRegionHover = (geo) => {
    const regionName = geo.properties.NAME_1;
    setHoveredRegion(regionName);
  };

  // Handle region click
  const handleRegionClick = (geo) => {
    const regionName = geo.properties.NAME_1;
    setSelectedRegion(regionName);
    onRegionClick && onRegionClick(regionName);
  };

  // Paginate the values for the hovered region
  const paginatedValues = hoveredRegion
    ? regionData[hoveredRegion]?.values.slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize
      )
    : [];

  return (
    <div className="relative w-full">
      <ComposableMap
        width={width}
        height={height}
        projection="geoMercator"
        projectionConfig={{
          center: [38, 9], // Centered on Ethiopia
          scale: 2500, // Adjust this to zoom in/out as needed
        }}
        className="bg-gray-100 border rounded-lg"
      >
        <ZoomableGroup zoom={1}>
          <Geographies geography={ethiopiaGeoJson}>
            {({ geographies }) =>
              geographies.map((geo) => {
                const regionName = geo.properties.NAME_1;
                const hasData = regionData[regionName];

                return (
                  <React.Fragment key={geo.rsmKey}>
                    <Geography
                      geography={geo}
                      onClick={() => handleRegionClick(geo)}
                      onMouseEnter={() => handleRegionHover(geo)}
                      onMouseLeave={() => setHoveredRegion(null)}
                      style={{
                        default: {
                          fill: hasData ? "#A3D8FF" : "#E1E5E8",
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
                    {/* Display region names on the map */}
                    <Annotation
                      subject={geo.properties.center || [0, 0]} // Use center coordinates for label placement
                      dx={0}
                      dy={0}
                      connectorProps={{}}
                    >
                      <text
                        x={0}
                        y={0}
                        textAnchor="middle"
                        style={{
                          fontSize: "10px",
                          fill: "#333",
                          fontWeight: "bold",
                        }}
                      >
                        {regionName}
                      </text>
                    </Annotation>
                  </React.Fragment>
                );
              })
            }
          </Geographies>
        </ZoomableGroup>
      </ComposableMap>

      {/* Tooltip for hovered region */}
      {hoveredRegion && regionData[hoveredRegion] && (
        <div className="absolute top-4 right-4 bg-white p-4 rounded-lg shadow-lg z-10 max-w-xs">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-bold text-lg">{hoveredRegion}</h3>
            <Tooltip title="Additional region information">
              <InfoCircleOutlined className="text-blue-500 cursor-pointer" />
            </Tooltip>
          </div>
          <p className="text-sm text-gray-600">
            Total Items: {regionData[hoveredRegion].values.length}
          </p>
          <p className="text-sm text-gray-600">
            Total Value: {regionData[hoveredRegion].total.toFixed(2)}
          </p>
          <div className="mt-2">
            <h4 className="font-semibold">Values:</h4>
            {paginatedValues.map((value, index) => (
              <p key={index} className="text-sm text-gray-600">
                {parseFloat(value).toFixed(2)}
              </p>
            ))}
            {/* <Pagination
              current={currentPage}
              pageSize={pageSize}
              total={regionData[hoveredRegion].values.length}
              onChange={(page, size) => {
                setCurrentPage(page);
                setPageSize(size);
              }}
              showSizeChanger
              size="small"
            /> */}
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-white p-4 rounded-lg shadow-md z-10">
        <div className="space-y-2">
          <div className="flex items-center">
            <div className="w-4 h-4 mr-2 bg-[#E1E5E8] border"></div>
            <span className="text-sm">Regions</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 mr-2 bg-[#A3D8FF]"></div>
            <span className="text-sm">Regions with Data</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EthiopiaMapComponent;
