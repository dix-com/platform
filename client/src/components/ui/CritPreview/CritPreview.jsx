import "./styles.css";

import React from "react";
import { Link, useLocation } from "react-router-dom";
import { IconContext } from "react-icons";
import { LuRepeat2 } from "react-icons/lu";
import { TbPinned } from "react-icons/tb";

import { useAppSelector } from "../../../app/store";
import { useGetUserInfoQuery } from "../../../features/api/userApi";

import {
    CritDetails,
    CritActions,
    QuotePreview,
    CritContent,
    ConditionalLink,
    PfpContainer
} from "../../index";

import { isObjEmpty } from "../../../utils/object";


const CritPreview = ({
    crit,
    displayReply = true,
    critDate = true,
    viewingId = null,
    viewingUsername = null,
    pin = false,
    onDelete = () => { },
    measure = () => { }
}) => {
    const { pathname } = useLocation();

    const { isAuth, user: currentUser } = useAppSelector((state) => state.auth);
    const { data: currentUserInfo } = useGetUserInfoQuery(currentUser?.username, {
        skip: !currentUser?.username,
    });

    const isReply = crit.replyTo && !isObjEmpty(crit.replyTo);
    const isQuote = crit.quoteTo && !isObjEmpty(crit.quoteTo);
    // const isRecrit = crit.recrits.includes(currentUser.id);

    const viewAs = viewingId || currentUserInfo?.username;
    const media = crit.media?.[0];


    return (
        <IconContext.Provider value={{ className: "crit_icon" }}>
            <ConditionalLink
                className="crit"
                condition={isAuth}
                to={`/${crit.author.username}/status/${crit._id}`}
                state={{ previousPath: pathname }}
            >
                {pin && (
                    <div className="special-info pin">
                        <TbPinned className="special-info-icon" />
                        <p>Pinned</p>
                    </div>
                )}

                {(viewingId && crit.recrits && crit.recrits.includes(viewingId)) && (
                    <span className="special-info">
                        <LuRepeat2 className="special-info-icon" />
                        {
                            viewingId === currentUser.id
                                ? "You recrited"
                                : `${viewingUsername} recrited`
                            // crit.recrits && crit.recrits.includes(viewing)
                            //     ? "You recrited"
                            //     : `${viewing} recrited`
                        }
                    </span>
                )}

                <div className="crit-wrapper">
                    <PfpContainer src={crit.author.profileImageURL} />

                    <div className="crit-container">
                        <CritDetails crit={crit} date={critDate} onDelete={onDelete} />

                        {(isReply && displayReply) && (
                            <span className="replyingTo">
                                <p>Replying to </p>

                                <Link
                                    to={`/${crit.replyTo.author.username}`}
                                    state={{ previousPath: pathname }}
                                    className="link-blue"
                                >
                                    @{crit.replyTo.author.username}
                                </Link>
                            </span>
                        )}

                        <CritContent
                            content={crit.content}
                            media={media}
                            measure={measure}
                        />

                        {isQuote && <QuotePreview crit={crit.quoteTo} />}

                        <CritActions
                            crit={crit}
                            currentUser={currentUserInfo}
                        />
                    </div>
                </div>
            </ConditionalLink>
        </IconContext.Provider>
    );
}

export default CritPreview;
