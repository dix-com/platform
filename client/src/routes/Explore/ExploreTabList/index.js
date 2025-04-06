import { useAppSelector } from '../../../app/store';

import { useGetTrendingCritsQuery } from '../../../features/api/critApi';
import { useGetRecommendedUsersQuery } from '../../../features/api/userApi';

import {
    MiddleColumn,
    LeftColumn,
    ColumnHeader,
    PaginatedList,
    TabList,
    TabPanel,
    CritPreview,
    UserPreview,
    Trending,
    Connect,
    Links
} from '../../../components';


const ExploreTabList = () => {
    const { user: currentUser } = useAppSelector((state) => state.auth);

    return (
        <main>
            <MiddleColumn>
                <ColumnHeader routerBack={true}>
                    <h1>Explore</h1>
                </ColumnHeader>

                <TabList
                    options={{
                        tabs: ["crits", "people"],
                    }}
                >
                    <TabPanel name="crits">
                        <PaginatedList
                            queryHook={useGetTrendingCritsQuery}
                            renderItem={(data) =>
                                <CritPreview crit={data} />
                            }
                        />
                    </TabPanel>

                    <TabPanel name="people">
                        <PaginatedList
                            queryHook={useGetRecommendedUsersQuery}
                            args={{ id: currentUser.id }}
                            renderItem={(data) =>
                                <UserPreview user={data} />
                            }
                        />
                    </TabPanel>
                </TabList>

            </MiddleColumn>

            <LeftColumn>
                <Trending />
                <Connect />
                <Links />
            </LeftColumn>
        </main>
    )
}

export default ExploreTabList;