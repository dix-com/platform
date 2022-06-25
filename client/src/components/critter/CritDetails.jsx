import "../../styles/CritDetails.css";

import { Link } from "react-router-dom";
import { getTimeDifference } from "../../helpers/date";

const CritDetails = ({ crit, children }) => {
    return (
        <div className="crit-details">
            <Link
                to={`/${crit.author.username}`}
                className="display_name"
            >
                {crit.author.displayName}
            </Link>

            <p className="username">@{crit.author.username}</p>
            <span className="separator">·</span>
            <p className="date">{getTimeDifference(crit.createdAt)}</p>

            {children}
        </div>
    );
};

export default CritDetails;
