import "./styles.css";

import { Link } from "react-router-dom";
import { getTimeDifference } from "../../../helpers/date";

const CritDetails = ({ crit, children }) => {
    const timeDifference = getTimeDifference(crit.createdAt);

    return (
        <div className="crit-details">
            <Link
                className="display_name"
                to={`/${crit.author.username}`}
            >
                {crit.author.displayName}
            </Link>

            <p className="username">@{crit.author.username}</p>
            <span className="separator">·</span>
            <p className="date">{timeDifference}</p>

            {children}
        </div>
    );
};

export default CritDetails;
