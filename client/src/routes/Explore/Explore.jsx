import "./styles.css";

import { Link } from "react-router-dom";

import { useAppSelector } from "../../app/store";
import useConditionalRender from "../../hooks/useConditionalRender";

import { useGetRecommendedUsersQuery } from "../../features/api/userApi";
import { useGetTrendingKeywordsQuery } from "../../features/api/critApi";

import {
    LeftColumn,
    MiddleColumn,
    ColumnHeader,
    TrendingItem,
    ConnectItem,
    SearchBar,
    Placeholder,
    ErrorPlaceholder,
    Spinner,
    Links
} from "../../components";

const Explore = () => {
    const { user: currentUser } = useAppSelector((state) => state.auth);

    const {
        data: recommendedUsers,
        isFetching: isFetchingUsers,
        isError: isErrorUsers
    } = useGetRecommendedUsersQuery({ id: currentUser.id, page: 1, limit: 10 });

    const {
        data: trendingHashtags,
        isFetching: isFetchingHashtags,
        isError: isErrorHashtags
    } = useGetTrendingKeywordsQuery({ page: 1, limit: 10 });

    const usersContent = useConditionalRender({
        isError: isErrorUsers,
        isFetching: isFetchingUsers,
        data: recommendedUsers?.data || [],
        renderFunc: (user, idx) => (
            <ConnectItem
                key={idx}
                user={user}
                isFollowed={
                    user.followers.includes(currentUser.id)
                }
            />
        ),
    })

    const trendingContent = useConditionalRender({
        isError: isErrorHashtags,
        isFetching: isFetchingHashtags,
        data: trendingHashtags?.data || [],
        renderFunc: (trend, idx) => (
            <TrendingItem
                key={idx}
                trend={trend}
            />
        ),
    })

    return (
        <main className="explore-route">
            <MiddleColumn>
                <ColumnHeader
                    routerBack={true}
                    className="explore-route_header"
                >
                    <SearchBar defaultSearch={true} />
                </ColumnHeader>


                <section className="explore-users">
                    <div className="explore-section-header">
                        <h2>Explore connections</h2>
                        <p>Check out these recommended users for you</p>
                    </div>

                    <div className="explore-users_content">
                        {usersContent}
                    </div>

                    <Link
                        to={`/explore/people`}
                        className="explore-route_more-btn"
                    >
                        Show more
                    </Link>

                </section>


                <section className="explore-crits">
                    <div className="explore-section-header">
                        <h2>Explore trending crits</h2>
                        <p>Check out these trending crits</p>
                    </div>

                    <div className="explore-crits_content">
                        {trendingContent}
                    </div>

                    <Link
                        to={`/explore/crits`}
                        className="explore-route_more-btn"
                    >
                        Show crits
                    </Link>
                </section>
            </MiddleColumn>

            <LeftColumn>
                <Links />
            </LeftColumn>
        </main>
    );
};

export default Explore;
