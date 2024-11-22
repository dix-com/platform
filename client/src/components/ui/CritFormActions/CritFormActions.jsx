import "react-circular-progressbar/dist/styles.css";
import "./styles.css";

import { CircularProgressbar, buildStyles } from "react-circular-progressbar";

import { IconContext } from "react-icons";
import { TbMoodSmile } from "react-icons/tb";
import { MdOutlinePoll, MdOutlineGifBox } from "react-icons/md";
import { PiImageSquareBold } from "react-icons/pi";

const CritFormActions = ({
    crit,
    setMedia,
    setMediaPreview,
    buttonValue = "Post",
    handleCrit = () => { }
}) => {

    const handleFileChange = ({ target }) => {
        const types = ["image/png", "image/jpeg", "image/jpg", "image/gif"];

        const files = target.files;
        const image = files?.[0];

        if (image && types.includes(image.type)) {
            // media to transfer
            setMedia(image);

            // assign blob for preview
            setMediaPreview(URL.createObjectURL(image));
        }
    };

    return (
        <div className="crit-actions">
            <div className="attachments">
                <IconContext.Provider value={{ className: "icon crit-attachments_icon" }}>
                    <label
                        type="button"
                        className="crit-attachments_button blue_round-btn"
                    >
                        <input
                            id="image"
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            style={{ display: "none" }}
                        />

                        <div className="icon-container">
                            <PiImageSquareBold size="16" />
                        </div>
                    </label>

                    <button
                        type="button"
                        className="crit-attachments_button blue_round-btn"
                        disabled
                    >
                        <div className="icon-container">
                            <MdOutlineGifBox size="16" />
                        </div>
                    </button>

                    <button
                        type="button"
                        className="crit-attachments_button blue_round-btn"
                        disabled
                    >
                        <div className="icon-container">
                            <MdOutlinePoll size="16" />
                        </div>
                    </button>

                    <button
                        type="button"
                        className="crit-attachments_button blue_round-btn"
                        disabled
                    >
                        <div className="icon-container">
                            <TbMoodSmile size="16" />
                        </div>
                    </button>
                </IconContext.Provider>
            </div>

            <div className="crit-submit">
                {crit.length > 0 && (
                    <>
                        <div
                            className="progressbar-container"
                        >
                            <CircularProgressbar
                                value={(crit.length / 280) * 100}
                                styles={buildStyles({
                                    pathColor: crit.length === 280
                                        ? "red"
                                        : "var(--primary-colour)",
                                    trailColor: "var(--border)",
                                    backgroundColor: "var(--primary-colour)",
                                })}
                            />
                        </div>

                        <div className="separator"></div>
                    </>
                )}

                <button
                    type="button"
                    className="accent-btn post-btn"
                    onClick={handleCrit}
                    disabled={crit.length <= 0}
                >
                    {buttonValue}
                </button>
            </div>
        </div >
    );
};

export default CritFormActions;
