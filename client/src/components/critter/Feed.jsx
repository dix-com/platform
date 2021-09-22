import "../../styles/Feed.css";

import { Crit, Spinner } from "../index";

const Feed = ({ crits = [], isCritsLoading, EmptyFeedComponent }) => {
    return (
        <section id="feed">
            {isCritsLoading ? (
                <div
                    className="spinner-wrapper"
                    style={{
                        width: "100%",
                        height: "200px",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    <Spinner />
                </div>
            ) : crits.length > 0 ? (
                crits.map((crit, idx) => (
                    <Crit
                        key={idx}
                        crit={crit}
                    />
                ))
            ) : (
                EmptyFeedComponent
            )}
        </section>
    );
};

export default Feed;
