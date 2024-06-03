import "./styles.css";

import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import { IconContext } from "react-icons";
import { IoMdClose } from "react-icons/io";
import { IoEarth } from "react-icons/io5";

import useOutsideClick from "../../../hooks/useOutsideClick";

import { CritInput, CritFormActions } from "../../index";

import { useAppSelector } from "../../../app/store";
import { useCreateCritMutation } from "../../../features/api/critApi";

const CritForm = ({
    replyTo,
    forceExpand,
    buttonValue,
    placeholder,
    maxLength = 280,
    showPfp = true,
}) => {
    const [crit, setCrit] = useState("");
    const [media, setMedia] = useState(null);
    const [mediaPreview, setMediaPreview] = useState(null);
    const [expanded, setExpanded] = useState(forceExpand);

    const ref = useOutsideClick(() => closeInput());
    const inputRef = useRef();

    const {
        user: { id, username, profileImageURL },
    } = useAppSelector((state) => state.auth);

    const [createCrit] = useCreateCritMutation();

    const handleCrit = async () => {
        const formData = new FormData();

        formData.append("content", crit);
        formData.append("author", id);
        formData.append("media", media);

        if (replyTo) formData.append("replyTo", replyTo);


        const result = await createCrit(formData).unwrap();

        if (result.error) {
            toast.error("Error creating crit!")
        }

        if (!result.error && result?.critId) {
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
        !forceExpand && setExpanded(false);
    };

    const clearMedia = () => {
        setMedia(null);
        setMediaPreview(null);
    };

    return (
        <section
            className={`crit-form ${forceExpand && "force-expand"}`}
            ref={ref}
        >
            {showPfp && (
                <div className="pfp-container">
                    <img
                        src={profileImageURL}
                        className="pfp"
                        alt="User PFP"
                    />
                </div>
            )}

            <div className="crit-input">
                <div className={`crit-input_container ${expanded && "expanded"}`}>
                    {!replyTo && (
                        <button
                            type="button"
                            className="audience"
                            disabled
                        >
                            Everyone
                        </button>
                    )}

                    <CritInput
                        placeholder={placeholder}
                        inputRef={inputRef}
                        maxLength={maxLength}
                        crit={crit}
                        setCrit={setCrit}
                        onFocus={() => setExpanded(true)}
                    />

                    {mediaPreview && (
                        <div className="media-preview">
                            <button
                                className="media-preview_close dark_round-btn"
                                onClick={clearMedia}
                            >
                                <div className="icon-container">
                                    <IoMdClose
                                        size="20"
                                        className="icon"
                                    />
                                </div>
                            </button>
                            <img
                                src={mediaPreview}
                                alt="Media Preview"
                            />
                        </div>
                    )}

                    {!replyTo && (
                        <button
                            type="button"
                            className="reply_label"
                            disabled
                        >
                            <IconContext.Provider
                                value={{ className: "reply_icon" }}
                            >
                                <IoEarth size="16" />
                            </IconContext.Provider>

                            <span className="reply-option">Everyone can reply</span>
                        </button>
                    )}
                </div>

                <CritFormActions
                    crit={crit}
                    setMedia={setMedia}
                    setMediaPreview={setMediaPreview}
                    handleCrit={handleCrit}
                    buttonValue={buttonValue}
                />
            </div>
        </section>
    );
};

export default CritForm;
