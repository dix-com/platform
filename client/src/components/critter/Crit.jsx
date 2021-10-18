import "../../styles/Crit.css";

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { IconContext } from "react-icons";
import { FaRegComment, FaComment } from "react-icons/fa";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import { BiRepost } from "react-icons/bi";
import { IoMdStats } from "react-icons/io";
import { TbShare2 } from "react-icons/tb";
import { IoEllipsisHorizontal } from "react-icons/io5";

import { CritText } from "../index";
import { useCheckAuthQuery } from "../../store/api/authApi";
import { useLikeCritMutation, useUnlikeCritMutation } from "../../store/api/userApi";
import { getTimeDifference } from "../../helpers/date";

const Crit = ({ crit, lastElementRef }) => {
    const {
        data: {
            isAuthenticated,
            info: { id },
        },
    } = useCheckAuthQuery();

    const [likeCrit] = useLikeCritMutation();
    const [unlikeCrit] = useUnlikeCritMutation();

    const handleLinkClick = (e) => {
        if (!isAuthenticated) {
            e.preventDefault();
        }
    };

    const handleLike = async (e) => {
        e.preventDefault();

        const isLiked = crit.likes.includes(id);

        isLiked ? await unlikeCrit({ id: crit._id }) : await likeCrit({ id: crit._id });
    };

    const handleReply = (e) => {
        e.preventDefault();
    };

    const handleRecrit = (e) => {
        e.preventDefault();
    };

    const handleShare = (e) => {
        e.preventDefault();
    };

    const handleMore = (e) => {
        e.preventDefault();
    };

    return (
        <IconContext.Provider value={{ className: "crit_icon" }}>
            <Link
                className="crit"
                to={`/${crit.author.username}/status/${crit._id}`}
                onClick={handleLinkClick}
                ref={lastElementRef}
            >
                <div className="img-container">
                    <Link
                        to={`/${crit.author.username}`}
                        className="pfp-container"
                        onClick={handleLinkClick}
                    >
                        <img
                            src={crit.author.profileImageURL}
                            className="pfp"
                            alt="User PFP"
                        />
                    </Link>
                </div>

                <div className="crit-container">
                    <div className="crit-info">
                        <Link
                            to={`/${crit.author.username}`}
                            className="display_name"
                            onClick={handleLinkClick}
                        >
                            {crit.author.displayName}
                        </Link>

                        <p className="username">@{crit.author.username}</p>
                        <span className="separator">·</span>
                        <p className="date">{getTimeDifference(crit.createdAt)}</p>

                        <button
                            className="crit-btn more"
                            onClick={handleMore}
                            disabled={!isAuthenticated}
                        >
                            <div className="icon-container">
                                <IoEllipsisHorizontal size="16" />
                            </div>
                        </button>
                    </div>

                    <div className="crit-content">
                        <CritText
                            text={crit.content}
                            highlight=" "
                        />

                        {crit.media?.[0] && (
                            <div className="media-container">
                                <img
                                    src={crit.media[0].url}
                                    className="crit_media"
                                    alt="Crit Media"
                                />
                            </div>
                        )}
                    </div>

                    <div className="crit-actions">
                        <button
                            className={`crit-btn comment ${
                                crit.replies.includes(id) && "applied"
                            }`}
                            onClick={handleReply}
                            disabled={!isAuthenticated}
                        >
                            <div className="icon-container">
                                {crit.replies.includes(id) ? (
                                    <FaComment size="15.5" />
                                ) : (
                                    <FaRegComment size="15.5" />
                                )}
                            </div>
                            <p>{crit.replies.length}</p>
                        </button>

                        <button
                            className={`crit-btn recrit ${
                                crit.recrits.includes(id) && "applied"
                            }`}
                            disabled={!isAuthenticated}
                            onClick={handleRecrit}
                        >
                            <div className="icon-container">
                                <BiRepost size="21" />
                            </div>
                            <p>{crit.recrits.length}</p>
                        </button>

                        <button
                            type="button"
                            className={`crit-btn like ${crit.likes.includes(id) && "applied"}`}
                            onClick={(e) => handleLike(e, crit._id)}
                            disabled={!isAuthenticated}
                        >
                            <div className="icon-container like-animation">
                                {crit.likes.includes(id) ? (
                                    <AiFillHeart size="17" />
                                ) : (
                                    <AiOutlineHeart size="17" />
                                )}
                            </div>
                            <p>{crit.likes.length}</p>
                        </button>

                        <button
                            className="crit-btn view"
                            onClick={handleShare}
                            disabled={!isAuthenticated}
                        >
                            <div className="icon-container">
                                <IoMdStats size="18" />
                            </div>
                            <p>0</p>
                        </button>

                        <button
                            className="crit-btn share"
                            onClick={handleShare}
                            disabled={!isAuthenticated}
                        >
                            <div className="icon-container">
                                <TbShare2 size="19" />
                            </div>
                        </button>
                    </div>
                </div>
            </Link>
        </IconContext.Provider>
    );
};

export default Crit;
