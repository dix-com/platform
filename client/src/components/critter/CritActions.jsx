import "react-circular-progressbar/dist/styles.css";
import "../../styles/CritActions.css";

import { CircularProgressbar, buildStyles } from "react-circular-progressbar";

import { IconContext } from "react-icons";
import { HiOutlineLocationMarker } from "react-icons/hi";
import { TbCalendarTime, TbMoodSmile } from "react-icons/tb";
import { MdOutlinePoll, MdOutlineGifBox } from "react-icons/md";
import { PiImageSquareBold } from "react-icons/pi";

const CritActions = ({ maxLength, crit, handleCrit, setMedia, setMediaPreview }) => {
    const handleFileChange = ({ target }) => {
        const types = ["image/png", "image/jpeg", "image/jpg"];
        const files = target.files;
        const image = files?.[0];

        if (image && types.includes(image.type)) {
            const blob = URL.createObjectURL(image);

            setMedia(image);
            setMediaPreview(blob);
        }
    };

    return (
        <div className="crit-actions">
            <div className="attachments">
                <IconContext.Provider value={{ className: "crit-attachments_icon" }}>
                    <label
                        type="button"
                        className="crit-attachments_button"
                    >
                        <input
                            type="file"
                            id="image"
                            accept=".jpg, .jpeg, .png"
                            style={{
                                display: "none",
                            }}
                            onChange={handleFileChange}
                        />
                        <PiImageSquareBold size="16" />
                    </label>

                    <button
                        type="button"
                        className="crit-attachments_button"
                        disabled
                    >
                        <MdOutlineGifBox size="16" />
                    </button>

                    <button
                        type="button"
                        className="crit-attachments_button"
                        disabled
                    >
                        <MdOutlinePoll size="16" />
                    </button>

                    <button
                        type="button"
                        className="crit-attachments_button"
                        disabled
                    >
                        <TbMoodSmile size="16" />
                    </button>

                    <button
                        type="button"
                        className="crit-attachments_button"
                        disabled
                    >
                        <TbCalendarTime size="16" />
                    </button>

                    <button
                        type="button"
                        className="crit-attachments_button"
                        disabled
                    >
                        <HiOutlineLocationMarker size="16" />
                    </button>
                </IconContext.Provider>
            </div>

            <div className="crit-submit">
                {crit.length > 0 && (
                    <div
                        className="progressbar-container"
                        style={{
                            width: 25,
                            height: 25,
                        }}
                    >
                        <CircularProgressbar
                            value={(crit.length / 280) * 100}
                            styles={buildStyles({
                                pathColor: crit.length === maxLength ? "red" : "#1D9BF0",
                                trailColor: "#2F3336",
                                backgroundColor: "#3e98c7",
                            })}
                        />
                    </div>
                )}

                {crit.length > 0 && <div className="separator"></div>}

                <button
                    type="button"
                    className="blue-btn post-btn"
                    disabled={crit.length <= 0}
                    onClick={handleCrit}
                >
                    Crit
                </button>
            </div>
        </div>
    );
};

export default CritActions;
