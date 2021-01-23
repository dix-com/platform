import userImage from "../../assets/elon.jpg";
import "../../styles/Crit.css";

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

import { IconContext } from "react-icons";
import { FaRegComment, FaComment } from "react-icons/fa";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import { BiRepost } from "react-icons/bi";
import { IoMdStats } from "react-icons/io";
import { TbShare2 } from "react-icons/tb";
import { IoEllipsisHorizontal } from "react-icons/io5";

const Crit = ({ crit }) => {
    const user = useSelector((state) => state.auth.user);

    const [replied, setReplied] = useState(false);
    const [recrited, setRecrited] = useState(false);
    const [liked, setLiked] = useState(false);

    useEffect(() => {
        if (user) {
            if (crit.likes.includes(user._id)) setLiked(true);
            if (crit.replies.includes(user._id)) setReplied(true);
            if (crit.recrits.includes(user._id)) setRecrited(true);
        }
    }, [crit, user]);

    const handleLinkClick = (e) => {
        if (!user) {
            e.preventDefault();
        }
    };

    const handleReply = (e) => {
        e.preventDefault();
    };

    const handleRecrit = (e) => {
        e.preventDefault();
    };

    const handleLike = (e) => {
        e.preventDefault();
    };

    const handleShare = (e) => {
        e.preventDefault();
    };

    const handleMore = (e) => {
        e.preventDefault();
    };

    return (
        <Link to={`/${crit.author.username}/${crit._id}`} className="crit" onClick={handleLinkClick}>
            <div className="img-container">
                <Link to={`/${crit.author.username}`} onClick={handleLinkClick}>
                    <img src={userImage} alt="User PFP" />
                </Link>
            </div>
            <div className="crit-container">
                <div className="crit-info">
                    <Link to={`/${crit.author.username}`} className="display_name" onClick={handleLinkClick}>
                        {crit.author.displayName}
                    </Link>

                    <p className="username">@{crit.author.username}</p>
                    <span className="separator">·</span>
                    <p className="date">{crit.createdAt}</p>

                    <button className="crit-btn more" disabled={!user} onClick={handleMore}>
                        <div className="icon-container">
                            <IconContext.Provider value={{ className: "crit_icon" }}>
                                <IoEllipsisHorizontal size="16" />
                            </IconContext.Provider>
                        </div>
                    </button>
                </div>

                <div className="crit-content">
                    <p className="crit_text">{crit.content}</p>
                </div>

                <div className="crit-actions">
                    <button className={`crit-btn comment ${replied && "applied"}`} disabled={!user} onClick={handleReply}>
                        <div className="icon-container">
                            <IconContext.Provider value={{ className: "crit_icon" }}>
                                {replied ? <FaComment size="15.5" /> : <FaRegComment size="15.5" />}
                            </IconContext.Provider>
                        </div>
                        <p>{crit.replies.length}</p>
                    </button>
                    <button className={`crit-btn recrit ${recrited && "applied"}`} disabled={!user} onClick={handleRecrit}>
                        <div className="icon-container">
                            <IconContext.Provider value={{ className: "crit_icon" }}>
                                <BiRepost size="21" />
                            </IconContext.Provider>
                        </div>
                        <p>{crit.recrits.length}</p>
                    </button>
                    <button className={`crit-btn like ${liked && "applied"}`} disabled={!user} onClick={handleLike}>
                        <div className="icon-container">
                            <IconContext.Provider value={{ className: "crit_icon" }}>
                                {liked ? <AiFillHeart size="18" /> : <AiOutlineHeart size="18" />}
                            </IconContext.Provider>
                        </div>
                        <p>{crit.likes.length}</p>
                    </button>
                    <button className="crit-btn view" disabled={!user} onClick={handleShare}>
                        <div className="icon-container">
                            <IconContext.Provider value={{ className: "crit_icon" }}>
                                <IoMdStats size="18" />
                            </IconContext.Provider>
                        </div>
                        <p>{crit.views.length}</p>
                    </button>
                    <button className="crit-btn share" disabled={!user} onClick={handleShare}>
                        <div className="icon-container">
                            <IconContext.Provider value={{ className: "crit_icon" }}>
                                <TbShare2 size="19" />
                            </IconContext.Provider>
                        </div>
                    </button>
                </div>
            </div>
        </Link>
    );
};

export default Crit;
