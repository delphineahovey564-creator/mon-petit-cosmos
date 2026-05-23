import { createFileRoute, Outlet } from "@tanstack/react-router";
export const Route = createFileRoute("/module/stories")({ component: () => <Outlet /> });