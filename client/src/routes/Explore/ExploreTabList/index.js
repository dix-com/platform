import withQuery from '../../../hoc/withQuery';
import { useAppSelector } from '../../../app/store';

import { useGetTrendingCritsQuery } from '../../../features/api/critApi';
import { useGetRecommendedUsersQuery } from '../../../features/api/userApi';

import {
    MiddleColumn,
    LeftColumn,
    ColumnHeader,
    PaginatedList,
    PaginatedTabList,
    CritPreview,
    UserPreview
} from '../../../components';

const CritList = withQuery(useGetTrendingCritsQuery)(PaginatedList);
const PeopleList = withQuery(useGetRecommendedUsersQuery)(PaginatedList);

const ExploreTabList = () => {
    const { user: currentUser } = useAppSelector((state) => state.auth);

    const renderPanel = (currTab) => {
        switch (currTab) {
            case 'crits':
                return (
                    <CritList
                        component={CritPreview}
                    />
                )
            case 'people':
                return (
                    <PeopleList
                        component={UserPreview}
                        args={{ id: currentUser.id }}
                    />
                )
            default:
                break;
        }
    }


    return (
        <main>
            <MiddleColumn>
                <ColumnHeader routerBack={true}>
                    <h1>Connect</h1>
                </ColumnHeader>

                <PaginatedTabList
                    options={{
                        tabs: ["crits", "people"],
                    }}
                    renderPanel={renderPanel}
                />
            </MiddleColumn>

            <LeftColumn>

            </LeftColumn>
        </main>
    )
}

export default ExploreTabList;