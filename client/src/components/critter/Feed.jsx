import "../../styles/Feed.css";
import Crit from "./Crit";

const dummyCrit = {
    _id: "123456789",
    content: "42+10",
    createdAt: "Jun 28",
    author: {
        displayName: "Elon Musk",
        username: "elonmusk",
    },
    replies: [""],
    recrits: [""],
    likes: ["64aadf20e66c076cab2c939d"],
    views: [""],
};

const Feed = ({ crits }) => {
    return (
        <section id="feed">
            {[...Array(10)].map((_, idx) => (
                <Crit key={idx} crit={dummyCrit} />
            ))}
        </section>
    );
};

export default Feed;
