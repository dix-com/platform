import "../../styles/Crit.css";

import userImage from "../../assets/elon.jpg";

import { IconContext } from "react-icons";
import { BiRepost } from "react-icons/bi";
import { AiOutlineHeart } from "react-icons/ai";
import { IoMdStats } from "react-icons/io";
import { TbShare2 } from "react-icons/tb";
import { FaRegComment } from "react-icons/fa";
import { IoEllipsisHorizontal } from "react-icons/io5";

const Crit = () => {
    return (
        <div className="crit">
            <div className="img-container">
                <a href="#">
                    <img src={userImage} alt="User Image" />
                </a>
            </div>
            <div className="crit-container">
                <div className="crit-info">
                    <a href="#" className="display_name">
                        Elon Musk
                    </a>
                    <p className="username">@elonmusk </p>
                    <span className="separator">·</span>
                    <p className="date">Jun 28</p>
                    <button className="crit-btn more">
                        <div className="icon-container">
                            <IconContext.Provider value={{ className: "crit_icon" }}>
                                <IoEllipsisHorizontal size="16" />
                            </IconContext.Provider>
                        </div>
                    </button>
                </div>
                <div className="crit-content">
                    <p className="crit_text">42+10</p>
                </div>
                <div className="crit-actions">
                    <button className="crit-btn comment">
                        <div className="icon-container">
                            <IconContext.Provider value={{ className: "crit_icon" }}>
                                <FaRegComment size="15" />
                            </IconContext.Provider>
                        </div>
                        <p>10.7K</p>
                    </button>
                    <button className="crit-btn recrit">
                        <div className="icon-container">
                            <IconContext.Provider value={{ className: "crit_icon" }}>
                                <BiRepost size="18" />
                            </IconContext.Provider>
                        </div>
                        5,643
                    </button>
                    <button className="crit-btn like">
                        <div className="icon-container">
                            <IconContext.Provider value={{ className: "crit_icon" }}>
                                <AiOutlineHeart size="17" />
                            </IconContext.Provider>
                        </div>
                        94.4K
                    </button>
                    <button className="crit-btn view">
                        <div className="icon-container">
                            <IconContext.Provider value={{ className: "crit_icon" }}>
                                <IoMdStats size="17" />
                            </IconContext.Provider>
                        </div>
                        2.5M
                    </button>
                    <button className="crit-btn share">
                        <div className="icon-container">
                            <IconContext.Provider value={{ className: "crit_icon" }}>
                                <TbShare2 size="18" />
                            </IconContext.Provider>
                        </div>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Crit;
