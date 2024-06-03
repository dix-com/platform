import "./styles.css";
import "../../ui/CritForm/styles.css";

import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import { IconContext } from "react-icons";
import { IoEarth } from "react-icons/io5";

import { useAppSelector } from "../../../app/store";

import {
    ColumnHeader,
    BaseModal,
    CritFormActions,
    CritInput,
    QuotePreview,
} from "../../index";

import { useCreateCritMutation } from "../../../features/api/critApi";

const CritModal = ({ maxLength = 280, quote = null, isOpen, onClose }) => {
    const [crit, setCrit] = useState("");
    const [media, setMedia] = useState();
    const [mediaPreview, setMediaPreview] = useState();

    const inputRef = useRef();

    const {
        user: { id, profileImageURL, username },
    } = useAppSelector((state) => state.auth);

    const [createCrit] = useCreateCritMutation();

    const handleCrit = async () => {
        const formData = new FormData();

        formData.append("content", crit);
        formData.append("author", id);
        formData.append("media", media);
        !!quote?._id && formData.append("quoteTo", quote._id);

        const result = await createCrit(formData).unwrap();

        if (!result.error) {
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

            closeInput();
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
            className="crit-modal"
        >
            <ColumnHeader close={onClose} />

            <section className="crit-input">
                <div className="crit-input_container">
                    <div className="pfp-container">
                        <img
                            src={profileImageURL}
                            className="pfp"
                            alt="User PFP"
                        />
                    </div>

                    <div className="input-wrap">
                        <button
                            type="button"
                            className="audience"
                            disabled
                        >
                            Everyone
                        </button>

                        <CritInput
                            crit={crit}
                            setCrit={setCrit}
                            maxLength={maxLength}
                            inputRef={inputRef}
                            mediaPreview={mediaPreview}
                            clearMedia={clearMedia}
                        />

                        {quote && <QuotePreview crit={quote} />}
                    </div>
                </div>

                <button
                    type="button"
                    className="reply_label"
                    disabled
                >
                    <IconContext.Provider value={{ className: "reply_icon" }}>
                        <IoEarth size="16" />
                    </IconContext.Provider>

                    <span className="reply-option">Everyone can reply</span>
                </button>

                <CritFormActions
                    crit={crit}
                    setMedia={setMedia}
                    setMediaPreview={setMediaPreview}
                    handleCrit={handleCrit}
                    maxLength={maxLength}
                />
            </section>
        </BaseModal>
    );
};

export default CritModal;
