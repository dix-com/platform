import "./styles.css";

import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { IconContext } from "react-icons";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import { PiPencilSimpleLine } from "react-icons/pi";
import { LuRepeat2 } from "react-icons/lu";
import { TbMessageCircle2, TbShare2, TbTrash, TbPinned } from "react-icons/tb";
import { IoMdStats } from "react-icons/io";
import { IoEllipsisHorizontal } from "react-icons/io5";
import { RiUserFollowLine, RiUserUnfollowLine } from "react-icons/ri";
import { MdBlock } from "react-icons/md";
import { BiBookmark, BiSolidBookmark } from "react-icons/bi";

import {
    CritText,
    FloatOptions,
    CritModal,
    ReplyModal,
    CritDetails,
    QuotePreview,
    LinkButton,
    ConditionalLink,
} from "../../index";

import { useCheckAuthQuery } from "../../../features/api/authApi";
import { useDeleteCritMutation } from "../../../features/api/critApi";
import {
    useGetUserInfoQuery,
    useLikeCritMutation,
    useUnlikeCritMutation,
    useCreateRepostMutation,
    useDeleteRepostMutation,
    useFollowUserMutation,
    useUnfollowUserMutation,
    useCreateBookmarkMutation,
    useDeleteBookmarkMutation,
} from "../../../features/api/userApi";

import { isObjEmpty } from "../../../utils/object";

const Crit = ({ crit }) => {
    const [replyModal, setReplyModal] = useState(false);
    const [quoteModal, setQuoteModal] = useState(false);
    const [recritFloat, setRecritFloat] = useState(false);
    const [moreFloat, setMoreFloat] = useState(false);

    const navigate = useNavigate();
    const { pathname } = useLocation();

    const {
        data: { isAuthenticated, data: currentUser },
    } = useCheckAuthQuery();

    const { data: currentUserInfo } = useGetUserInfoQuery(currentUser?.username, {
        skip: !currentUser?.username,
    });

    const [deleteCrit] = useDeleteCritMutation();
    const [createRepost] = useCreateRepostMutation();
    const [deleteRepost] = useDeleteRepostMutation();
    const [likeCrit] = useLikeCritMutation();
    const [unlikeCrit] = useUnlikeCritMutation();

    const [followUser, followResult] = useFollowUserMutation();
    const [unfollowUser, unfollowResult] = useUnfollowUserMutation();
    const [createBookmark, createBookmarkResult] = useCreateBookmarkMutation();
    const [deleteBookmark, deleteBookmarkResult] = useDeleteBookmarkMutation();

    const isBookmarked = currentUserInfo.bookmarks.includes(crit._id);
    const isReposted = crit.recrits.includes(currentUser.id);
    const isLiked = crit.likes.includes(currentUser.id);
    const isFollowingAuthor = crit.author.followers.includes(currentUser.id);

    const isReply = crit.replyTo && !isObjEmpty(crit.replyTo);
    const isQuote = crit.quoteTo && !isObjEmpty(crit.quoteTo);

    const media = crit.media?.[0];

    const handlePostClick = (e) => {
        return isAuthenticated && navigate(`/${crit.author.username}/status/${crit._id}`);
    };

    const handleCritDelete = async () => {
        const result = await deleteCrit(crit._id).unwrap();

        if (!result?.error) {
            closeMoreFloat();
        }
    };

    const handleRecrit = async (e) => {
        const recritResult = isReposted
            ? await deleteRepost({ critId: crit._id })
            : await createRepost({ critId: crit._id });

        if (recritResult?.error) return;

        if (
            (isReposted && !recritResult.data?.isReposted) ||
            (!isReposted && recritResult.data?.isReposted)
        )
            closeRecritFloat();
    };

    const handleLike = async (e) => {
        isLiked ? await unlikeCrit({ id: crit._id }) : await likeCrit({ id: crit._id });
    };

    const handleBookmark = async () => {
        const bookmarkData = {
            critId: crit._id,
            userId: currentUser.id,
        };

        isBookmarked ? await deleteBookmark(bookmarkData) : await createBookmark(bookmarkData);
    };

    const handleFollow = async () => {
        const followData = {
            id: currentUser.id,
            targetUserId: crit.author._id,
        };

        isFollowingAuthor ? await unfollowUser(followData) : await followUser(followData);
    };

    const openReplyModal = () => setReplyModal(true);
    const closeReplyModal = () => setReplyModal(false);

    const openQuoteModal = () => {
        setQuoteModal(true);
        setRecritFloat(false);
    };
    const closeQuoteModal = () => setQuoteModal(false);

    const openRecritFloat = () => setRecritFloat(true);
    const closeRecritFloat = () => setRecritFloat(false);

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

            <ConditionalLink
                className="crit"
                to={`/${crit.author.username}/status/${crit._id}`}
                state={{ previousPath: pathname }}
                condition={isAuthenticated}
            >
                {moreFloat && (
                    <IconContext.Provider value={{ className: "float-icon" }}>
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
                                    type="button"
                                    className="float-btn"
                                    disabled
                                >
                                    <div className="float-icon-container">
                                        <TbMessageCircle2 />
                                    </div>
                                    Change who can reply
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
                                    {isFollowingAuthor ? "Unfollow" : "Follow"} @
                                    {crit.author.username}
                                </LinkButton>

                                <LinkButton
                                    type="button"
                                    className="float-btn"
                                    disabled
                                >
                                    <div className="float-icon-container">
                                        <MdBlock style={{ strokeWidth: 0 }} />
                                    </div>
                                    Block @{crit.author.username}
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
                    </IconContext.Provider>
                )}

                <div className="img-container">
                    <Link
                        to={`/${crit.author.username}`}
                        state={{ previousPath: pathname }}
                        onClick={handlePostClick}
                        className="pfp-container"
                    >
                        <img
                            src={crit.author.profileImageURL}
                            className="pfp"
                            alt="User Pfp"
                        />
                    </Link>
                </div>

                <div className="crit-container">
                    {/* {username} recrited */}
                    {crit.author._id !== currentUser.id && <p>{}</p>}

                    <CritDetails crit={crit}>
                        <LinkButton
                            className="crit-btn more"
                            onClick={openMoreFloat}
                        >
                            <div className="icon-container">
                                <IoEllipsisHorizontal size="16" />
                            </div>
                        </LinkButton>
                    </CritDetails>

                    {isReply && (
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
                            <div className="media-container">
                                <img
                                    src={media.url}
                                    className="crit_media"
                                    alt="Crit Media"
                                />
                            </div>
                        )}
                    </div>

                    {isQuote && <QuotePreview crit={crit.quoteTo} />}

                    <div className="crit-actions">
                        <LinkButton
                            className={`crit-btn comment`}
                            onClick={openReplyModal}
                        >
                            <div className="icon-container">
                                <TbMessageCircle2 />
                            </div>

                            <div className="count-container">
                                <span>{crit.repliesCount}</span>
                            </div>
                        </LinkButton>

                        <LinkButton
                            className={`crit-btn recrit ${isReposted && "applied"}`}
                            onClick={openRecritFloat}
                        >
                            <div className="icon-container">
                                <LuRepeat2 />
                            </div>

                            <div className="count-container">
                                <span>{crit.recrits.length}</span>
                            </div>

                            {recritFloat && (
                                <IconContext.Provider value={{ className: "float-icon" }}>
                                    <FloatOptions
                                        isOpen={recritFloat}
                                        onClose={closeRecritFloat}
                                        className="recrit-options"
                                    >
                                        <LinkButton
                                            type="button"
                                            className="float-btn"
                                            onClick={handleRecrit}
                                        >
                                            <div className="float-icon-container">
                                                <LuRepeat2 />
                                            </div>

                                            {isReposted ? "Undo Repost" : "Repost"}
                                        </LinkButton>

                                        <LinkButton
                                            type="button"
                                            className="float-btn"
                                            onClick={openQuoteModal}
                                        >
                                            <div className="float-icon-container">
                                                <PiPencilSimpleLine size="21" />
                                            </div>
                                            Quote
                                        </LinkButton>
                                    </FloatOptions>
                                </IconContext.Provider>
                            )}
                        </LinkButton>

                        <LinkButton
                            type="button"
                            className={`crit-btn like ${isLiked && "applied"}`}
                            data-type="inner-button"
                            onClick={handleLike}
                        >
                            <div className="icon-container">
                                {isLiked ? <AiFillHeart /> : <AiOutlineHeart />}
                            </div>

                            <div className="count-container">
                                <span>{crit.likes.length}</span>
                            </div>
                        </LinkButton>

                        <LinkButton
                            className="crit-btn view"
                            disabled
                        >
                            <div className="icon-container">
                                <IoMdStats />
                            </div>

                            <div className="count-container">
                                <span>0</span>
                            </div>
                        </LinkButton>

                        <div className="crit-actions-container">
                            <LinkButton
                                type="button"
                                className="crit-btn bookmark"
                                onClick={handleBookmark}
                            >
                                <div className="icon-container">
                                    {isBookmarked ? <BiSolidBookmark /> : <BiBookmark />}
                                </div>
                            </LinkButton>

                            <LinkButton
                                className="crit-btn share"
                                disabled
                            >
                                <div className="icon-container">
                                    <TbShare2 />
                                </div>
                            </LinkButton>
                        </div>
                    </div>
                </div>
            </ConditionalLink>
        </IconContext.Provider>
    );
};

export default Crit;
