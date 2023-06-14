import "./styles.css";

import { useState } from "react";
import { IconContext } from "react-icons";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import { PiPencilSimpleLine } from "react-icons/pi";
import { LuRepeat2 } from "react-icons/lu";
import { TbMessageCircle2, TbShare2 } from "react-icons/tb";
import { IoMdStats } from "react-icons/io";
import { BiBookmark, BiSolidBookmark } from "react-icons/bi";

import { LinkButton, FloatOptions } from "../../index"

import {
    useLikeCritMutation,
    useUnlikeCritMutation,
    useCreateRepostMutation,
    useDeleteRepostMutation,
    useCreateBookmarkMutation,
    useDeleteBookmarkMutation,
} from "../../../features/api/userApi";

const CritActions = ({ crit, currentUser, openReplyModal, openQuoteModal }) => {
    const [recritFloat, setRecritFloat] = useState(false);

    const [createRepost] = useCreateRepostMutation();
    const [deleteRepost] = useDeleteRepostMutation();
    const [likeCrit] = useLikeCritMutation();
    const [unlikeCrit] = useUnlikeCritMutation();
    const [createBookmark] = useCreateBookmarkMutation();
    const [deleteBookmark] = useDeleteBookmarkMutation();

    const isBookmarked = currentUser.bookmarks.includes(crit._id);
    const isReposted = crit.recrits.includes(currentUser._id);
    const isLiked = crit.likes.includes(currentUser._id);

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
        isLiked
            ? await unlikeCrit({ id: crit._id })
            : await likeCrit({ id: crit._id });
    };

    const handleBookmark = async () => {
        const bookmarkData = {
            critId: crit._id,
            userId: currentUser.id,
        };

        isBookmarked
            ? await deleteBookmark(bookmarkData)
            : await createBookmark(bookmarkData);
    };


    const openRecritFloat = () => setRecritFloat(true);
    const closeRecritFloat = () => setRecritFloat(false);

    return (
        <div className="crit-actions">
            <LinkButton
                className={`action-btn reply blue_round-btn`}
                onClick={openReplyModal}
            >
                <div className="icon-container">
                    <TbMessageCircle2 className="icon" />
                </div>

                <div className="count-container">
                    <span>{crit.repliesCount}</span>
                </div>
            </LinkButton>

            <LinkButton
                className={`action-btn recrit green_round-btn ${isReposted && "applied"}`}
                onClick={openRecritFloat}
            >
                <div className="icon-container">
                    <LuRepeat2 className="icon" />
                </div>

                <div className="count-container">
                    <span>{crit.recrits.length}</span>
                </div>

                {recritFloat && (
                    <IconContext.Provider
                        value={{ className: "float-icon" }}
                    >
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
                className={`action-btn like red_round-btn ${isLiked && "applied"}`}
                data-type="inner-button"
                onClick={handleLike}
            >
                <div className="icon-container">
                    {isLiked ? <AiFillHeart className="icon" /> : <AiOutlineHeart className="icon" />}
                </div>

                <div className="count-container">
                    <span>{crit.likes.length}</span>
                </div>
            </LinkButton>

            <LinkButton
                className="action-btn view blue_round-btn"
                disabled
            >
                <div className="icon-container">
                    <IoMdStats className="icon" />
                </div>

                <div className="count-container">
                    <span>0</span>
                </div>
            </LinkButton>

            <div className="crit-actions-container">
                <LinkButton
                    type="button"
                    className="action-btn bookmark blue_round-btn"
                    onClick={handleBookmark}
                >
                    <div className="icon-container">
                        {isBookmarked ? (
                            <BiSolidBookmark className="icon" />
                        ) : (
                            <BiBookmark className="icon" />
                        )}
                    </div>
                </LinkButton>

                <LinkButton
                    className="action-btn crit-btn blue_round-btn"
                    disabled
                >
                    <div className="icon-container">
                        <TbShare2 className="icon" />
                    </div>
                </LinkButton>
            </div>
        </div>
    )
}

export default CritActions;