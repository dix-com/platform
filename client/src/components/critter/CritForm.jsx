import "../../styles/CritForm.css";

import { useState, useRef } from "react";

import { IconContext } from "react-icons";
import { IoMdClose } from "react-icons/io";
import { IoEarth } from "react-icons/io5";

import useOutsideClick from "../../hooks/useOutsideClick";

import { CritInput, CritActions } from "../index";
import { useCheckAuthQuery } from "../../store/api/authApi";
import { useGetUserInfoQuery } from "../../store/api/userApi";
import { useCreateCritMutation } from "../../store/api/critApi";

const CritForm = ({ isReply, button, placeholder, forceExpand, maxLength = 280 }) => {
    const [crit, setCrit] = useState("");
    const [media, setMedia] = useState(null);
    const [mediaPreview, setMediaPreview] = useState(null);
    const [expanded, setExpanded] = useState(forceExpand);

    const ref = useOutsideClick(() => closeInput());
    const inputRef = useRef();

    const {
        data: { data: currentUser },
    } = useCheckAuthQuery();

    const { id, profileImageURL } = useGetUserInfoQuery(currentUser?.username, {
        selectFromResult: ({ data }) => ({
            id: data?._id,
            profileImageURL: data?.profileImageURL,
        }),
    });

    const [createCrit] = useCreateCritMutation();

    const handleCrit = async () => {
        const formData = new FormData();

        formData.append("content", crit);
        formData.append("author", id);
        formData.append("media", media);

        const result = await createCrit(formData).unwrap();

        if (!result?.error) {
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
            <div className="pfp-container">
                <img
                    src={profileImageURL}
                    className="pfp"
                    alt="User PFP"
                />
            </div>

            <div className="crit-input">
                <div className={`crit-input_container ${expanded && "expanded"}`}>
                    {!isReply && (
                        <button
                            type="button"
                            className="audience"
                            disabled
                        >
                            Everyone
                        </button>
                    )}

                    <CritInput
                        inputRef={inputRef}
                        maxLength={maxLength}
                        crit={crit}
                        setCrit={setCrit}
                        setExpanded={setExpanded}
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

                    {!isReply && (
                        <button
                            type="button"
                            className="reply"
                            disabled
                        >
                            <IconContext.Provider value={{ className: "reply_icon" }}>
                                <IoEarth size="16" />
                            </IconContext.Provider>

                            <span className="reply-option">Everyone can reply</span>
                        </button>
                    )}
                </div>

                <CritActions
                    maxLength={maxLength}
                    crit={crit}
                    setMedia={setMedia}
                    setMediaPreview={setMediaPreview}
                    handleCrit={handleCrit}
                />
            </div>
        </section>
    );
};

export default CritForm;
