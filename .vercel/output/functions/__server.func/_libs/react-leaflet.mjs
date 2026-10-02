import { r as reactExports, R as React } from "./react.mjs";
import { d as useLeafletContext, a as createLeafletContext, L as LeafletContext, b as createTileLayerComponent, u as updateGridLayer, w as withPane, c as createElementObject } from "./react-leaflet__core.mjs";
import { l as leafletSrcExports } from "./leaflet.mjs";
import "./react-dom.mjs";
function useMap() {
  return useLeafletContext().map;
}
function useMapEvents(handlers) {
  const map = useMap();
  reactExports.useEffect(function addMapEventHandlers() {
    map.on(handlers);
    return function removeMapEventHandlers() {
      map.off(handlers);
    };
  }, [
    map,
    handlers
  ]);
  return map;
}
function MapContainerComponent({ bounds, boundsOptions, center, children, className, id, placeholder, style, whenReady, zoom, ...options }, forwardedRef) {
  const [props] = reactExports.useState({
    className,
    id,
    style
  });
  const [context, setContext] = reactExports.useState(null);
  const mapInstanceRef = reactExports.useRef(void 0);
  reactExports.useImperativeHandle(forwardedRef, () => context?.map ?? null, [
    context
  ]);
  const mapRef = reactExports.useCallback((node) => {
    if (node !== null && !mapInstanceRef.current) {
      const map = new leafletSrcExports.Map(node, options);
      mapInstanceRef.current = map;
      if (center != null && zoom != null) {
        map.setView(center, zoom);
      } else if (bounds != null) {
        map.fitBounds(bounds, boundsOptions);
      }
      if (whenReady != null) {
        map.whenReady(whenReady);
      }
      setContext(createLeafletContext(map));
    }
  }, []);
  reactExports.useEffect(() => {
    return () => {
      context?.map.remove();
    };
  }, [
    context
  ]);
  const contents = context ? /* @__PURE__ */ React.createElement(LeafletContext, {
    value: context
  }, children) : placeholder ?? null;
  return /* @__PURE__ */ React.createElement("div", {
    ...props,
    ref: mapRef
  }, contents);
}
const MapContainer = /* @__PURE__ */ reactExports.forwardRef(MapContainerComponent);
const TileLayer = createTileLayerComponent(function createTileLayer({ url, ...options }, context) {
  const layer = new leafletSrcExports.TileLayer(url, withPane(options, context));
  return createElementObject(layer, context);
}, function updateTileLayer(layer, props, prevProps) {
  updateGridLayer(layer, props, prevProps);
  const { url } = props;
  if (url != null && url !== prevProps.url) {
    layer.setUrl(url);
  }
});
export {
  MapContainer as M,
  TileLayer as T,
  useMapEvents as u
};
