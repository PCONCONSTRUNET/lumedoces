import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin — Rafa Lanches Delivery" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: () => <Outlet />,
});
