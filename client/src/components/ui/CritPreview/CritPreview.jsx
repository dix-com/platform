import "./styles.css";

import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { IconContext } from "react-icons";
import { LuRepeat2 } from "react-icons/lu";
import { TbMessageCircle2, TbTrash, TbPinned } from "react-icons/tb";
import { IoMdStats } from "react-icons/io";
import { IoEllipsisHorizontal } from "react-icons/io5";
import { RiUserFollowLine, RiUserUnfollowLine } from "react-icons/ri";

import {
    CritText,
    FloatOptions,
    CritModal,
    ReplyModal,
    CritDetails,
    CritActions,
    QuotePreview,
    LinkButton,
    MediaModal,
    ConditionalLink,
} from "../../index";

import { useAppSelector } from "../../../app/store";

import { useDeleteCritMutation } from "../../../features/api/critApi";
import {
    useGetUserInfoQuery,
    useFollowUserMutation,
    useUnfollowUserMutation,
} from "../../../features/api/userApi";

import { isObjEmpty } from "../../../utils/object";

const CritPreview = ({ crit, displayReply = true }) => {
    const [mediaModal, setMediaModal] = useState(false);
    const [replyModal, setReplyModal] = useState(false);
    const [quoteModal, setQuoteModal] = useState(false);
    const [recritFloat, setRecritFloat] = useState(false);
    const [moreFloat, setMoreFloat] = useState(false);

    const { pathname } = useLocation();
    const navigate = useNavigate();

    const { isAuth, user: currentUser } = useAppSelector((state) => state.auth);

    const { data: currentUserInfo } = useGetUserInfoQuery(currentUser?.username, {
        skip: !currentUser?.username,
    });

    const [deleteCrit] = useDeleteCritMutation();
    const [followUser, followResult] = useFollowUserMutation();
    const [unfollowUser, unfollowResult] = useUnfollowUserMutation();

    const isFollowingAuthor = crit.author.followers.includes(currentUser.id);
    const isReply = crit.replyTo && !isObjEmpty(crit.replyTo);
    const isQuote = crit.quoteTo && !isObjEmpty(crit.quoteTo);
    const isRecrit = crit.recrits.includes(currentUser.id);
    // const isFollowerRecrit =

    // viewing_user, author_user
    // if viewing_user is current user // viewing own crits
    //      if viewing_user is crit author
    //          show recrit - "You reposted..."
    //      else
    //          show recrit - "[username] respoted"
    //          
    // else // not viewing own crits
    //      


    const media = crit.media?.[0];

    const handlePostClick = (e) => {
        return isAuth && navigate(`/${crit.author.username}/status/${crit._id}`);
    };

    const handleCritDelete = async () => {
        const result = await deleteCrit(crit._id).unwrap();

        if (!result?.error) {
            closeMoreFloat();
        }
    };


    const handleFollow = async () => {
        const followData = {
            id: currentUser.id,
            targetUserId: crit.author._id,
        };

        isFollowingAuthor
            ? await unfollowUser(followData)
            : await followUser(followData);
    };

    const openMediaModal = () => setMediaModal(true);
    const closeMediaModal = () => setMediaModal(false);

    const openReplyModal = () => setReplyModal(true);
    const closeReplyModal = () => setReplyModal(false);

    const openQuoteModal = () => {
        setQuoteModal(true);
        setRecritFloat(false);
    };
    const closeQuoteModal = () => setQuoteModal(false);

    const openMoreFloat = () => setMoreFloat(true);
    const closeMoreFloat = () => setMoreFloat(false);


    return (
        <IconContext.Provider value={{ className: "crit_icon" }}>
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

            {mediaModal && (
                <MediaModal
                    isOpen={mediaModal}
                    closeMediaModal={closeMediaModal}
                    mediaUrl={media.url}
                />
            )}

            <ConditionalLink
                className="crit"
                condition={isAuth}
                to={`/${crit.author.username}/status/${crit._id}`}
                state={{ previousPath: pathname }}
            >
                <IconContext.Provider value={{ className: "float-icon" }}>
                    {moreFloat && (
                        <>
                            {crit.author._id === currentUser.id && (
                                <FloatOptions
                                    isOpen={moreFloat}
                                    onClose={closeMoreFloat}
                                    className="more-options"
                                >
                                    <LinkButton
                                        type="button"
                                        className="float-btn delete"
                                        onClick={handleCritDelete}
                                    >
                                        <div className="float-icon-container">
                                            <TbTrash />
                                        </div>
                                        Delete
                                    </LinkButton>

                                    <LinkButton
                                        type="button"
                                        className="float-btn"
                                        disabled
                                    >
                                        <div className="float-icon-container">
                                            <TbPinned />
                                        </div>
                                        Pin to your profile
                                    </LinkButton>

                                    <LinkButton
                                        className="float-btn"
                                        to={`/${crit.author.username}/status/${crit._id}/quotes`}
                                        state={{ previousPath: pathname }}
                                    >
                                        <div className="float-icon-container">
                                            <IoMdStats />
                                        </div>
                                        View post engagements
                                    </LinkButton>
                                </FloatOptions>
                            )}

                            {crit.author._id !== currentUser.id && (
                                <FloatOptions
                                    isOpen={moreFloat}
                                    onClose={closeMoreFloat}
                                    className="more-options"
                                >
                                    <LinkButton
                                        type="button"
                                        className="float-btn"
                                        onClick={handleFollow}
                                    >
                                        <div className="float-icon-container">
                                            {isFollowingAuthor ? (
                                                <RiUserUnfollowLine style={{ strokeWidth: 0 }} />
                                            ) : (
                                                <RiUserFollowLine style={{ strokeWidth: 0 }} />
                                            )}
                                        </div>

                                        {isFollowingAuthor ? "Unfollow" : "Follow"} @{crit.author.username}
                                    </LinkButton>

                                    <Link
                                        to={`/${crit.author.username}/status/${crit._id}/quotes`}
                                        state={{ previousPath: pathname }}
                                        className="float-btn"
                                    >
                                        <div className="float-icon-container">
                                            <IoMdStats />
                                        </div>
                                        View post engagements
                                    </Link>
                                </FloatOptions>
                            )}
                        </>
                    )}
                </IconContext.Provider>

                <div
                    className="pfp-container"
                    onClick={handlePostClick}
                >
                    <img
                        src={crit.author.profileImageURL}
                        className="pfp"
                        alt="User Pfp"
                    />
                </div>

                <div className="crit-container">
                    {isRecrit && (
                        <span className="replyingTo">
                            <LuRepeat2 className="replyingTo-icon" />
                            You recrited
                        </span>
                    )}

                    <CritDetails crit={crit}>
                        <LinkButton
                            className="blue_round-btn more"
                            onClick={openMoreFloat}
                        >
                            <div className="icon-container">
                                <IoEllipsisHorizontal size="16" className="icon" />
                            </div>
                        </LinkButton>
                    </CritDetails>

                    {(isReply && !displayReply) && (
                        <span className="replyingTo">
                            Replying to{" "}
                            <Link
                                to={`/${crit.replyTo.author.username}`}
                                state={{ previousPath: pathname }}
                                className="link-blue"
                            >
                                @{crit.replyTo.author.username}
                            </Link>
                        </span>
                    )}

                    <div className="crit-content">
                        <CritText text={crit.content} />

                        {media && (
                            <LinkButton
                                className="media-container"
                                onClick={openMediaModal}
                            >
                                <img
                                    src={media.url}
                                    className="crit_media"
                                    alt="Crit Media"
                                />
                            </LinkButton>
                        )}
                    </div>

                    {isQuote && <QuotePreview crit={crit.quoteTo} />}

                    <CritActions
                        crit={crit}
                        currentUser={currentUserInfo}
                        openQuoteModal={openQuoteModal}
                        openReplyModal={openReplyModal}
                    />
                </div>
            </ConditionalLink>
        </IconContext.Provider>
    );
};

export default CritPreview;
