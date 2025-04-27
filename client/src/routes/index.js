import { createBrowserRouter } from "react-router-dom";
import { AppLayout } from "../components";

import Root from "./Root";
import NotFound from "./NotFound";
import Auth from "./Auth";
import Home from "./Home";
import Profile from "./Profile";
import ProfileConnections from "./Profile/ProfileConnections";
import Crit from "./Crit";
import CritEngagements from "./Crit/CritEngagements";
import Bookmarks from "./Bookmarks";
import Explore from "./Explore";
import ExploreTabList from "./Explore/ExploreTabList";
import Search from "./Search";

import PublicRoute from "./PublicRoute";


const router = createBrowserRouter([
    {
        element: <Root />,
        errorElement: <NotFound />,
        children: [
            {
                index: true,
                element: (
                    <PublicRoute>
                        <Auth />
                    </PublicRoute>
                ),
            },

            {
                path: "/",
                element: <AppLayout />,
                children: [
                    {
                        path: "/home",
                        element: (
                            <Home />
                        ),
                    },
                    {
                        path: "/:username",
                        element: <Profile />,
                        children: [
                            ...[
                                '',
                                'replies',
                                'media',
                                'likes'
                            ].map(path => ({
                                path: path,
                                element: null
                            }))
                        ],
                    },
                    ...[
                        '/:username/followers',
                        '/:username/following'
                    ].map(path => ({
                        path: path,
                        element: <ProfileConnections />
                    })),
                    {
                        path: "/:username/status/:critId",
                        element: <Crit />,
                    },
                    ...[
                        '/:username/status/:critId/quotes',
                        '/:username/status/:critId/reposts',
                        '/:username/status/:critId/likes'
                    ].map(path => ({
                        path: path,
                        element: <CritEngagements />
                    })),
                    {
                        path: "/bookmarks",
                        element: <Bookmarks />,
                    },
                    {
                        path: "/explore",
                        element: <Explore />,
                    },
                    ...[
                        '/explore/crits',
                        '/explore/people',
                    ].map(path => ({
                        path: path,
                        element: <ExploreTabList />
                    })),
                    {
                        path: "/search",
                        element: <Search />,
                        children: [
                            ...[
                                '/search/crits',
                                '/search/people',
                            ].map(path => ({
                                path: path,
                                element: <Search />
                            })),
                        ],
                    },
                ]
            },
            {
                path: "*",
                element: <NotFound />,
            }
        ],
    },
]);

export default router;