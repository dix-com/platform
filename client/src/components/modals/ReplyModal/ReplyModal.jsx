import "../../ui/CritPreview/styles.css";
import "./styles.css";

import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";

import {
    BaseModal,
    ColumnHeader,
    CritText,
    CritInput,
    CritFormActions,
    CritDetails,
    QuotePreview,
} from "../../index";

import { useAppSelector } from "../../../app/store";
import { useCreateCritMutation } from "../../../features/api/critApi";

import { isObjEmpty } from "../../../utils/object";

const ReplyModal = ({ replyingTo, isOpen, onClose, maxLength = 280 }) => {
    const [crit, setCrit] = useState("");
    const [media, setMedia] = useState(null);
    const [mediaPreview, setMediaPreview] = useState(null);

    const inputRef = useRef();

    const {
        user: { id, username, profileImageURL },
    } = useAppSelector((state) => state.auth);

    const [createCrit] = useCreateCritMutation();

    const isQuote = replyingTo.quoteTo && !isObjEmpty(replyingTo.quoteTo);

    const handleReply = async () => {
        const formData = new FormData();

        formData.append("content", crit);
        formData.append("author", id);
        formData.append("media", media);
        formData.append("replyTo", replyingTo._id);

        const result = await createCrit(formData).unwrap();

        if (!result?.error) {
            closeInput();

            toast.success(
                () => (
                    <span>
                        <span>Your Crit was sent  </span>
                        <Link
                            to={`/${username}/status/${result.critId}`}
                            className="toast-view-link"
                        >
                            View
                        </Link>
                    </span >
                ),
                { duration: 6000 }
            );
        }
    };

    const closeInput = () => {
        clearMedia();
        setCrit("");
        inputRef.current.blur();
    };

    const clearMedia = () => {
        setMedia(null);
        setMediaPreview(null);
    };

    return (
        <BaseModal
            isOpen={isOpen}
            onClose={onClose}
            className="reply-modal"
        >
            <ColumnHeader close={onClose} />

            <section className="recipient-crit">
                <div className="pfp-container">
                    <img
                        src={replyingTo.author.profileImageURL}
                        className="pfp"
                        alt="User PFP"
                    />
                </div>

                <div className="crit-container">
                    <CritDetails crit={replyingTo} date={false} />

                    <div className="crit-content">
                        <CritText text={replyingTo.content} />
                    </div>

                    {isQuote && <QuotePreview crit={replyingTo.quoteTo} />}

                    <p className="replyingTo">
                        Replying to{" "}
                        <Link
                            to={`/${replyingTo.author.username}`}
                            className="link-blue"
                        >
                            @{replyingTo.author.username}
                        </Link>
                    </p>
                </div>
            </section>

            <section className="crit-input">
                <div className="pfp-container">
                    <img
                        src={profileImageURL}
                        className="pfp"
                        alt="User PFP"
                    />
                </div>
                <div className="input-container">
                    <CritInput
                        crit={crit}
                        setCrit={setCrit}
                        maxLength={maxLength}
                        inputRef={inputRef}
                        mediaPreview={mediaPreview}
                        clearMedia={clearMedia}
                        placeholder="Crit your reply"
                    />
                </div>
            </section>

            <CritFormActions
                crit={crit}
                setMedia={setMedia}
                setMediaPreview={setMediaPreview}
                handleCrit={handleReply}
                maxLength={maxLength}
                buttonValue="Reply"
            />
        </BaseModal>
    );
};

export default ReplyModal;
