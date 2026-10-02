import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L } from "../_libs/leaflet.mjs";
import { M as MapContainer, T as TileLayer, u as useMapEvents } from "../_libs/react-leaflet.mjs";
import "../_libs/react-leaflet__core.mjs";
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});
function MapCenterListener({ setPosition }) {
  useMapEvents({
    moveend(e) {
      const map = e.target;
      const center = map.getCenter();
      setPosition([center.lat, center.lng]);
    }
  });
  return null;
}
function MapPicker({
  position,
  setPosition
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    MapContainer,
    {
      center: position,
      zoom: 16,
      scrollWheelZoom: true,
      className: "h-[300px] w-full z-0",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          TileLayer,
          {
            attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(MapCenterListener, { setPosition }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[41px] z-[400] pointer-events-none", children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png", alt: "pin", className: "w-[25px] h-[41px]" }) })
      ]
    }
  );
}
export {
  MapPicker as default
};
