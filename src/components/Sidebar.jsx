import React, { useEffect, useState } from "react";

const Sidebar = ({ loadPath, locations }) => {
  return (
    <aside className="sidebar flex flex-col">
      <div className="w-full p-2">
        <h3>Recent Locations</h3>
      </div>
      <div className="w-full flex-grow overflow-scroll p-2 bg-gray-900">
        <ul>
          {locations.map((item, i) => (
            <li key={item.path}>
              <div
                role="button"
                className="w-full select-none cursor-pointer hover:bg-gray-700"
                onClick={() => {
                  loadPath(item.path);
                }}
              >
                {item.name}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
};

export default Sidebar;
