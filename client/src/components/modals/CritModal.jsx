import "../../styles/CritModal.css";
import "../../styles/CritForm.css";

import { useState, useRef } from "react";

import { IconContext } from "react-icons";
import { IoEarth } from "react-icons/io5";

import { ColumnHeader, BaseModal, CritActions, CritInput, QuotePreview } from "../index";
import { useCheckAuthQuery } from "../../store/api/authApi";
import { useGetUserInfoQuery } from "../../store/api/userApi";
import { useCreateCritMutation } from "../../store/api/critApi";

const CritModal = ({ maxLength = 280, quote = null, isOpen, onClose }) => {
    const [crit, setCrit] = useState("");
    const [media, setMedia] = useState();
    const [mediaPreview, setMediaPreview] = useState();

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
        !!quote?._id && formData.append("quoteTo", quote._id);

        const result = await createCrit(formData).unwrap();

        if (!result.error) {
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

    console.log(quote);

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
                    className="reply"
                    disabled
                >
                    <IconContext.Provider value={{ className: "reply_icon" }}>
                        <IoEarth size="16" />
                    </IconContext.Provider>

                    <span className="reply-option">Everyone can reply</span>
                </button>

                <CritActions
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
