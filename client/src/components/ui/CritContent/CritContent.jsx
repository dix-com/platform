import "./styles.css";

import { CritText, LinkButton } from "../../index";

const CritContent = ({ content = "", media = null, openMediaModal }) => {

    return (
        <div className="crit-content">
            <CritText text={content} />

            {media && (
                <LinkButton
                    className="media-container"
                    onClick={openMediaModal}
                >

                    <img
                        className="crit_media"
                        src={media?.url}
                        alt="Crit Media"
                    />
                </LinkButton>
            )}
        </div>
    );
}

export default CritContent;