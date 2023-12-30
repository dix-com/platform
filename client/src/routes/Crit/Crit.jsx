import "./styles.css";

import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { IoEllipsisHorizontal } from "react-icons/io5";

import useInfiniteScroll from "../../hooks/useInfiniteScroll";
import { useAppSelector } from "../../app/store";
import { useGetUserInfoQuery } from "../../features/api/userApi";
import { useGetCritQuery, useGetRepliesQuery } from "../../features/api/critApi";

import {
    LeftColumn,
    MiddleColumn,
    ColumnHeader,
    CritForm,
    CritText,
    Spinner,
    Links,
    MediaModal,
    PaginatedList,
    ErrorPlaceholder,
    CritPreview,
    QuotePreview,
    CritActions,
    CritContent,
    ReplyModal,
    CritModal,
    Trending,
    Connect
} from "../../components";

import { formatDate, formatTime } from "../../helpers/date";
import { isObjEmpty } from "../../utils/object";

const Crit = () => {
    const { critId } = useParams();

    const [replyModal, setReplyModal] = useState(false);
    const [quoteModal, setQuoteModal] = useState(false);
    const [mediaModal, setMediaModal] = useState(false);

    const { isAuth, user: currentUser } = useAppSelector((state) => state.auth);

    const { data: currentUserInfo } = useGetUserInfoQuery(currentUser?.username, {
        skip: !currentUser?.username,
    });
    const { data: crit, isLoading, isFetching, isError } = useGetCritQuery(critId);

    const queryResult = useInfiniteScroll(useGetRepliesQuery, { id: critId })

    const isQuote = crit?.quoteTo && !isObjEmpty(crit.quoteTo);
    const media = crit?.media?.[0];

    const timeCreatedAt = formatTime(crit?.createdAt, {
        hour: "numeric",
        minute: "numeric"
    });
    const dateCreatedAt = formatDate(crit?.createdAt, {
        month: "short",
        day: "numeric",
        year: "numeric"
    });

    const openReplyModal = () => setReplyModal(true);
    const closeReplyModal = () => setReplyModal(false);

    const openQuoteModal = () => setQuoteModal(true);
    const closeQuoteModal = () => setQuoteModal(false);

    const openMediaModal = () => setMediaModal(true);
    const closeMediaModal = () => setMediaModal(false);


    console.log(crit, isLoading, isFetching, isError);

    return (
        <main className="crit-route">
            {replyModal && (
                <ReplyModal
                    isOpen={replyModal}
                    onClose={closeReplyModal}
                    replyingTo={crit}
                />
            )}

            {quoteModal && (
                <CritModal
                    isOpen={quoteModal}
                    onClose={closeQuoteModal}
                    quote={crit}
                />
            )}

            {media && (
                <MediaModal
                    isOpen={mediaModal}
                    closeMediaModal={closeMediaModal}
                    mediaUrl={media.url}
                />
            )}

            <MiddleColumn className="crit-route_general">
                <ColumnHeader
                    className="crit-route-header"
                    routerBack={true}
                >
                    <h1>Post</h1>
                </ColumnHeader>

                {isLoading && <Spinner />}
                {isError && <ErrorPlaceholder />}

                {(!isLoading && !isError) && (
                    <>
                        <section className="relevant-crits">
                            {crit.replyTo && (
                                <div className="original-crit">
                                    <CritPreview crit={crit.replyTo} />
                                </div>
                            )}

                            <div className="current-crit">
                                <div className="crit-details">
                                    <div className="user-info">
                                        <div className="pfp-container">
                                            <div className="icon-container">
                                                <img
                                                    src={crit?.author.profileImageURL}
                                                    className="pfp"
                                                    alt="Profile Pfp"
                                                />
                                            </div>
                                        </div>
                                        <div className="wrapper">
                                            <h2 className="displayName">{crit.author.displayName}</h2>
                                            <p className="username">@{crit.author.username}</p>
                                        </div>
                                    </div>

                                    <button className="blue_round-btn">
                                        <div className="icon-container">
                                            <IoEllipsisHorizontal className="icon" />
                                        </div>
                                    </button>
                                </div>

                                {/* <div className="crit-content">
                                    <CritText text={crit.content} />

                                    {media && (
                                        <div className="media-container">
                                            <img
                                                className="crit_media"
                                                src={media.url}
                                                alt="Crit Media"
                                            />
                                        </div>
                                    )}
                                </div> */}

                                <CritContent
                                    openMediaModal={openMediaModal}
                                    content={crit.content}
                                    media={media}
                                />

                                {isQuote && <QuotePreview crit={crit.quoteTo} />}


                                <div className="crit-stats">
                                    <Link className="link">
                                        <span className="stat date">
                                            {timeCreatedAt}
                                        </span>
                                        <span className="separator">·</span>
                                        <span className="stat date">
                                            {dateCreatedAt}
                                        </span>
                                    </Link>

                                    <span className="separator">·</span>

                                    <span className="views">
                                        {1} <span className="stat">Views</span>
                                    </span>
                                </div>
                            </div>
                        </section>

                        <CritActions
                            crit={crit}
                            currentUser={currentUserInfo}
                            openReplyModal={openReplyModal}
                            openQuoteModal={openQuoteModal}
                        />

                        <CritForm
                            replyTo={crit._id}
                            forceExpand={true}
                            maxLength={280}
                            button="Reply"
                            placeholder="Post your reply"
                        />

                        <PaginatedList
                            queryResult={queryResult}
                            component={CritPreview}
                        />
                    </>
                )}
            </MiddleColumn>

            <LeftColumn>
                <Trending />
                <Connect />
                <Links />
            </LeftColumn>
        </main >
    );
};

export default Crit;
