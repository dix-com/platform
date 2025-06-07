import "./styles.css";

import { Link, useLocation } from "react-router-dom";
import { PfpContainer } from "../../index";
import { isObjEmpty } from "../../../utils/object";
import { getTimeDifference } from "../../../helpers/date";

const QuotePreview = ({ crit }) => {
    const { pathname } = useLocation();

    const isReply = crit.replyTo && !isObjEmpty(crit.replyTo);
    const formattedDate = getTimeDifference(crit.createdAt);
    const media = crit.media?.[0];

    return (
        <Link
            to={`/${crit.author.username}/status/${crit._id}`}
            state={{ previousPath: pathname }}
            className="quote-preview flex-truncate_parent"
        >
            <div className="details-wrapper flex-truncate_parent">
                <PfpContainer src={crit.author.profileImageURL} />

                <Link
                    className="display_name flex-truncate_child"
                    to={`/${crit.author.username}`}
                >
                    {crit.author.displayName}
                </Link>

                <p className="username">@{crit.author.username}</p>

                <p className="date">
                    <span className="separator">·</span>
                    {formattedDate}
                </p>
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
                    <div className="media-container quote-media">
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
