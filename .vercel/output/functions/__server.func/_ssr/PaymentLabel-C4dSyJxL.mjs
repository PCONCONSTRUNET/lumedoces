import { j as jsxRuntimeExports } from "../_libs/react.mjs";
const pixIcon = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAAAsTAAALEwEAmpwYAAADmElEQVR4nO2ZbU/TUBTH9w3UT2KyzV5fkDgVn6KRROVr+MaXgPpl1HcmxGQs3Rjb2t4ZtrVFRHxCg0ICbiB7kDnGOObcrWzsibW9ZcVwkpM07Xru/5feh3POPJ4z+89sRHp3QaD6U0HRMkTRSg1PE0Wfujinnfe42UhSCxBFzxKqQzcXqP7rMlWveNxoJLlwR6BauZf4Q1e0iiCrY55TKZ66EIKYFe8mCGJVvBsgiF3xw4QgvMTTIUBwF09PEMI3HR7zheJlvyiDEE/hoDyEA8bCmP5QvOKbFscdEZ/L5R7t1WoHpWoVMrlteK4vgSBKIMiqZfECvitKLJaa2waMjWPgWFzFJ36uP67WajVos1R2CwJhCQQpY168lGHvprPb7WFhb3//IPJj7QkX8ZfCyj1vMFr2BucAPSDGYVJdhI3dMhtseacAV01C4G/xneWdAouBsSbURQiEE2yMukcr/lD8If8Fi3M2Ng+3ZmX4XiwxAR9NQBji8R00jIGxMGbHmrKzsI/bbVDIaFiCr4UiE/JppwDXIv0h6tMmAR9+54+Kl/qAW4EYdKs0IL7k6xCf870hLImnFiDM7vMMIiIfQnwrlOBGmzC8vh6RGKAh/uYxX4tYgajn81rFyo7SC8IQbzyzJJ42IXrWE1hJ9StGBoOQYKWxJlDwePwtc0M8Phu1Kp42xqHapi+dPtcBgGWg1aBHIGblw4XdangPn9kRT5pfYrILgKbaDtyAGBET8GJlFdb+7DLHa7zHRTxlAOnO+Y/FN4/g6LIK/mgS/KFE3aNJdo9XfIFqhW5foHhaAIii5zsBsA3CbQrF4dXKKqw3ptBL3lOI6qkuU0ifcnwR29yBiOFJbaIDAJtO2LfhuY0+ijmwjSraRtdtFA0PCcsHWUtK0e0gaz2FB04hqImDrAmh3zadSrQkdd3yIVt5EG2KJ8mF+33Fm4Uwk5HaTebIoOIHhTDmvJV0eslkOk3Miu8LccIFDbEq3jAhrNz1BmNl70wM0ANiAqbURdgs/+VaUk5iSSkm2BjMg3MVvyg98DhZ1M+zol62VdSnslvOFvXtbZXiXpV1Ep5p77m0VQRRYrEwJsZ2pK1imO/1TL2xFVb4N7bCSr2x9SbijHir54Qj+7zrIJQTFM8dQhmCeG4QyhDF24Zwg3jLEG4SbxrCjeINw1wd+zY9Dy5F23DtH92GYbWEfRusW7FR0GgWzGMZ2LOSOjPP6bV/lQMAGil/vdYAAAAASUVORK5CYII=";
function PixIcon({ className = "h-4 w-4" }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: pixIcon, alt: "PIX", className: `inline-block object-contain ${className}` });
}
function PaymentLabel({ name, className = "" }) {
  const label = name ?? "—";
  const isPix = (name ?? "").toLowerCase().includes("pix");
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: `inline-flex items-center gap-1.5 ${className}`, children: [
    isPix && /* @__PURE__ */ jsxRuntimeExports.jsx(PixIcon, { className: "h-4 w-4" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: label })
  ] });
}
export {
  PaymentLabel as P,
  PixIcon as a
};
