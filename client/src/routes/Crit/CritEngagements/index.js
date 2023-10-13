import { useOutletContext, useParams } from "react-router-dom";

import {
    MiddleColumn,
    LeftColumn,
    ColumnHeader,
    PaginatedList,
    PaginatedTabList,
    CritPreview,
    UserPreview,
    Placeholder
} from "../../../components";

import {
    useGetQuotesQuery,
    useGetRepostUsersQuery,
    useGetLikeUsersQuery
} from "../../../features/api/critApi";

import withQuery from "../../../hoc/withQuery";

const QuotesList = withQuery(useGetQuotesQuery)(PaginatedList);
const RepostsList = withQuery(useGetRepostUsersQuery)(PaginatedList);
const LikesList = withQuery(useGetLikeUsersQuery)(PaginatedList);

const CritEngagements = () => {
    const { critId } = useParams();

    const renderPanel = (currTab) => {
        switch (currTab) {
            case 'quotes':
                return (
                    <QuotesList
                        component={CritPreview}
                        renderPlaceholder={() => (
                            <Placeholder
                                title="No Quotes yet"
                                subtitle="You will find a list of everyone who quoted this post here."
                            />

                        )}
                        args={{ id: critId }}
                    />
                )
            case 'reposts':
                return (
                    <RepostsList
                        component={UserPreview}
                        renderPlaceholder={() => (
                            <Placeholder
                                title="No Reposts yet"
                                subtitle="Share someone else's post on your timeline by reposting it. When you do, it'll show up here."
                            />
                        )}
                        args={{ id: critId }}
                    />
                )
            case 'likes':
                return (
                    <LikesList
                        component={UserPreview}
                        renderPlaceholder={() => (
                            <Placeholder
                                title="No likes yet"
                                subtitle="When someone taps the heart to Like this post, it'll show up here."
                            />
                        )}
                        args={{ id: critId }}
                    />
                )
            default:
                break;
        }
    }

    return (
        <main>

            <MiddleColumn >
                <ColumnHeader routerBack={true}>


                </ColumnHeader>

                <PaginatedTabList
                    options={{
                        tabs: ["quotes", "reposts", "likes"],
                    }}
                    renderPanel={renderPanel}
                />

            </MiddleColumn >

            <LeftColumn>

            </LeftColumn>
        </main>
    )
}

export default CritEngagements;