import "./styles.css";

import { useEffect, useState, useRef } from "react";
import { createSelector } from "@reduxjs/toolkit";
import { useParams, useNavigate, Link } from "react-router-dom";

import { useAppSelector, useAppDispatch } from "../../app/store";

import { useGetUserInfoQuery } from "../../features/api/userApi";
import { useGetCritQuery, useGetRepliesQuery } from "../../features/api/critApi";

import {
    LeftColumn,
    MiddleColumn,
    ColumnHeader,
    CritForm,
    CritDetails,
    Spinner,
    Links,
    PaginatedList,
    ErrorPlaceholder,
    CritPreview,
    QuotePreview,
    CritActions,
    CritContent,
    SearchBar,
    Trending,
    Connect,
    PfpContainer
} from "../../components";

import { formatDate, formatTime } from "../../helpers/date";
import { isObjEmpty } from "../../utils/object";


const Crit = () => {
    const scrollRef = useRef(null);
    const { critId } = useParams();
    const navigate = useNavigate();

    const { user: currentUser } = useAppSelector((state) => state.auth);
    const { data: currentUserInfo } = useGetUserInfoQuery(currentUser?.username, {
        skip: !currentUser?.username,
    });

    const {
        data: crit,
        isLoading,
        isFetching,
        isError
    } = useGetCritQuery(critId);

    const {
        data: originalCrit,
        isLoading: isOriginalLoading,
        isFetching: isOriginalFetching,
        isError: isOriginalError
    } = useGetCritQuery(crit?.replyTo?._id);

    // useEffect(() => {
    //     scrollRef.current && scrollRef.current.scrollIntoView({
    //         behavior: 'smooth',
    //     });
    // }, [scrollRef]);

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


    return (
        <main className="crit-route">
            <MiddleColumn className="crit-route_general">
                <ColumnHeader
                    className="crit-route-header"
                    routerBack={true}
                >
                    <h1>Post</h1>
                </ColumnHeader>

                <div className="route_wrapper">
                    {(!isLoading && !isError) && (
                        <>
                            <section className="relevant-crits">
                                {crit?.replyTo && (
                                    <div className="relevant-crit original-crit">
                                        {isOriginalLoading && <Spinner />}
                                        {isOriginalError && <ErrorPlaceholder />}

                                        {(originalCrit && !isOriginalLoading && !isOriginalError) && (
                                            <CritPreview
                                                crit={originalCrit}
                                                onDelete={() => navigate("/home")}
                                            />
                                        )}
                                    </div>
                                )}


                                <div
                                    className="relevant-crit current-crit"
                                    ref={scrollRef}
                                >
                                    {isLoading && <Spinner />}
                                    {isError && <ErrorPlaceholder />}

                                    {(crit && !isLoading && !isError) && (
                                        <>
                                            <div className="crit-details_wrapper">
                                                <PfpContainer src={crit?.author.profileImageURL} />

                                                <CritDetails
                                                    crit={crit}
                                                    date={false}
                                                    onDelete={() => navigate("/home")}
                                                />
                                            </div>

                                            <CritContent
                                                content={crit.content}
                                                media={media}
                                            />

                                            {isQuote && <QuotePreview crit={crit.quoteTo} />}

                                            <div className="crit-stats">
                                                <Link className="link">
                                                    <span className="stat date">
                                                        {timeCreatedAt}
                                                    </span>

                                                    <span className="separator">
                                                        ·
                                                    </span>

                                                    <span className="stat date">
                                                        {dateCreatedAt}
                                                    </span>
                                                </Link>

                                                <span className="separator">·</span>

                                                <span className="views">
                                                    {0} <span className="stat">Views</span>
                                                </span>
                                            </div>
                                        </>
                                    )}


                                </div>
                            </section>

                            <CritActions
                                crit={crit}
                                currentUser={currentUserInfo}
                            />

                            <CritForm
                                replyTo={crit._id}
                                forceExpand={true}
                                maxLength={280}
                                placeholder="Post your reply"
                                buttonValue="Reply"
                            />

                            <PaginatedList
                                queryHook={useGetRepliesQuery}
                                args={{ id: critId }}
                                renderItem={(data) => <CritPreview crit={data} />}
                                renderPlaceholder={() => { }}
                            />
                        </>
                    )}
                </div>
            </MiddleColumn>

            <LeftColumn>
                <SearchBar />
                <Trending />
                <Connect />
                <Links />
            </LeftColumn>
        </main >
    );
};

export default Crit;