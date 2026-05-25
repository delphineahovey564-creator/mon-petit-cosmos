import { createFileRoute, Outlet } from "@tanstack/react-router";
export const Route = createFileRoute("/module/stories/story/$storyId")({ component: () => <Outlet /> });
