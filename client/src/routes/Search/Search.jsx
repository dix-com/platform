
import { useNavigate, useSearchParams } from "react-router-dom";

import withQuery from "../../hoc/withQuery"

import { useGetSearchUsersQuery } from "../../features/api/userApi";
import { useGetSearchCritsQuery } from "../../features/api/critApi";

import {
    MiddleColumn,
    LeftColumn,
    ColumnHeader,
    PaginatedList,
    UserPreview,
    CritPreview,
    Placeholder,
    PaginatedTabList,
    Trending,
    Connect,
    Links
} from '../../components';
import { useEffect } from "react";

const CritList = withQuery(useGetSearchCritsQuery)(PaginatedList);
const PeopleList = withQuery(useGetSearchUsersQuery)(PaginatedList);

const Search = () => {
    const navigate = useNavigate();

    const [searchParams] = useSearchParams();
    const query = searchParams.get('q');

    useEffect(() => {
        if (!query || query.length === 0) {
            navigate('/')
        }
    }, [query])


    const renderPanel = (currTab) => {
        switch (currTab) {
            case 'crits':
                return (
                    <CritList
                        component={CritPreview}
                        renderPlaceholder={() => (
                            <Placeholder
                                title="No results found"
                                subtitle="Try searching again with another query!"
                            />
                        )}
                        args={{ searchQuery: query }}
                    />
                )
            case 'people':
                return (
                    <PeopleList
                        component={UserPreview}
                        renderPlaceholder={() => (
                            <Placeholder
                                title="No results found"
                                subtitle="Try searching again with another query!"
                            />
                        )}
                        args={{ searchQuery: query }}

                    />
                )
            default:
                break;
        }
    }

    return (
        <main>

            <MiddleColumn>
                <ColumnHeader
                    routerBack={true}
                    className="search-route_header"
                >
                    <h1>Search</h1>
                </ColumnHeader>

                <PaginatedTabList
                    options={{
                        tabs: ["crits", "people"],
                        index: `/search`,
                    }}
                    renderPanel={renderPanel}
                />
            </MiddleColumn>

            <LeftColumn>
                <Trending />
                <Connect />
                <Links />
            </LeftColumn>

        </main>
    )
}

export default Search;