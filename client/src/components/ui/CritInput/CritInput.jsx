import "./styles.css";

import { useEffect, useRef } from "react";
import { IoMdClose } from "react-icons/io";

import { CritText } from "../../index";

const CritInput = ({
    inputRef,
    maxLength,
    crit,
    setCrit,
    mediaPreview,
    clearMedia,
    setExpanded,
}) => {
    const textInputRef = useRef();
    const textRef = useRef();

    useEffect(() => {
        if (!textRef.current) return;

        // reset height for text clearing
        textInputRef.current.style.height = "auto";
        textRef.current.style.height = "auto";

        // set the new height based on scrollHeight
        textInputRef.current.style.height = `${textRef.current.scrollHeight || 24}px`;
        textRef.current.style.height = `${textRef.current.scrollHeight}px`;
    }, [crit]);

    return (
        <>
            <div
                className="crit-input-wrapper"
                ref={textInputRef}
            >
                <CritText
                    text={crit}
                    textRef={textRef}
                />

                <textarea
                    type="text"
                    id="crit"
                    placeholder="What's happening?!"
                    ref={inputRef}
                    maxLength={maxLength}
                    value={crit}
                    onChange={({ target }) => setCrit(target.value)}
                    onFocus={() => setExpanded && setExpanded(true)}
                />
            </div>

            {mediaPreview && (
                <div className="media-preview">
                    <button
                        className="media-preview_close light_round-btn"
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
        </>
    );
};

export default CritInput;
