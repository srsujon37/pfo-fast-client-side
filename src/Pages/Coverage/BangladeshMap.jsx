import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import React, { useRef, useState } from "react";

function FlyTo({ position }) {
  const map = useMap();

  React.useEffect(() => {
    if (position) {
      map.flyTo(position, 9); // Zoom level
    }
  }, [position, map]);

  return null;
}

const BangladeshMap = ({ serviceCenters }) => {
  const [search, setSearch] = useState("");
  const [flyToPos, setFlyToPos] = useState(null);
  const markerRefs = useRef({});

  const handleSearch = () => {
    const match = serviceCenters.find((d) =>
      d.district.toLowerCase().includes(search.toLowerCase())
    );
    if (match) {
      setFlyToPos([match.latitude, match.longitude]);
      setTimeout(() => {
        markerRefs.current[match.district]?.openPopup();
      }, 800);
    } else {
      alert("District not found");
    }
  };

  return (
    <div className="relative h-[400px] w-full rounded-xl shadow-lg overflow-hidden mt-6">
      {/* Search bar positioned over the map */}
      <div className="absolute top-4 left-4 z-[1000] bg-white bg-opacity-90 p-3 rounded shadow-md flex gap-2">
        <input
          type="text"
          placeholder="Search district"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-3 py-2 border rounded"
        />
        <button
          onClick={handleSearch}
          className="bg-blue-600 text-white px-4 rounded"
        >
          Search
        </button>
      </div>

      {/* Map container */}
      <MapContainer
        center={[23.685, 90.3563]}
        zoom={7}
        scrollWheelZoom={true}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; OpenStreetMap contributors'
        />
        {serviceCenters.map((center, index) => (
          <Marker
            key={index}
            position={[center.latitude, center.longitude]}
            ref={(ref) => {
              if (ref) markerRefs.current[center.district] = ref;
            }}
          >
            <Popup>
              <strong>{center.district}</strong>
              <br />
              Covered Areas: {center.covered_area.join(", ")}
            </Popup>
          </Marker>
        ))}
        {flyToPos && <FlyTo position={flyToPos} />}
      </MapContainer>
    </div>
  );
};

export default BangladeshMap;
