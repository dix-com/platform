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
import { useLikeCritMutation } from "../../store/api/userApi";
import { getTimeDifference } from "../../helpers/date";

const Crit = ({ crit }) => {
    const {
        data: {
            isAuthenticated,
            info: { id },
        },
    } = useCheckAuthQuery();

    const [likeCrit] = useLikeCritMutation();

    const [liked, setLiked] = useState(crit.likes.includes(id));
    const [recrited, setRecrited] = useState(crit.recrits.includes(id));
    const [replied, setReplied] = useState(crit.replies.includes(id));

    const handleLinkClick = (e) => {
        if (!isAuthenticated) {
            e.preventDefault();
        }
    };

    const handleLike = async (e, id) => {
        e.preventDefault();
        await likeCrit({ id }).unwrap();
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
                            disabled={!isAuthenticated}
                            onClick={handleMore}
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
                            className={`crit-btn comment ${replied && "applied"}`}
                            disabled={!isAuthenticated}
                            onClick={handleReply}
                        >
                            <div className="icon-container">
                                {replied ? <FaComment size="15.5" /> : <FaRegComment size="15.5" />}
                            </div>
                            <p>{crit.replies.length}</p>
                        </button>

                        <button
                            className={`crit-btn recrit ${recrited && "applied"}`}
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
                            className={`crit-btn like ${liked && "applied"}`}
                            disabled={!isAuthenticated}
                            onClick={(e) => handleLike(e, crit._id)}
                        >
                            <div className="icon-container like-animation">
                                {liked ? <AiFillHeart size="17" /> : <AiOutlineHeart size="17" />}
                            </div>
                            <p>{crit.likes.length}</p>
                        </button>

                        <button
                            className="crit-btn view"
                            disabled={!isAuthenticated}
                            onClick={handleShare}
                        >
                            <div className="icon-container">
                                <IoMdStats size="18" />
                            </div>
                            <p>0</p>
                        </button>

                        <button
                            className="crit-btn share"
                            disabled={!isAuthenticated}
                            onClick={handleShare}
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
