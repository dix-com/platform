import "../../styles/QuotePreview.css";

import { Link } from "react-router-dom";

import { CritDetails } from "../index";
import { isObjEmpty } from "../../utils/object";

const QuotePreview = ({ crit }) => {
    const isReply = crit.replyTo && !isObjEmpty(crit.replyTo);
    const media = crit.media?.[0];

    return (
        <Link
            to={`/${crit.author.username}/status/${crit._id}`}
            className="quote-preview"
        >
            <div className="details-wrapper">
                <div className="pfp-container">
                    <img
                        src={crit.author.profileImageURL}
                        className="pfp"
                        alt="User Pfp"
                    />
                </div>

                <CritDetails crit={crit} />
            </div>

            <div className="crit-content">
                <div className="content-wrap">
                    {isReply && (
                        <span className="replyingTo">
                            Replying to @{crit.replyTo.author.username}
                        </span>
                    )}

                    <span>{crit.content}</span>
                </div>

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
        </Link>
    );
};

export default QuotePreview;
