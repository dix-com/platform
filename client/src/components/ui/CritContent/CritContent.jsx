import "./styles.css";
// import 'react-lazy-load-image-component/src/effects/blur.css';

import { useState } from "react";
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { CritText, LinkButton } from "../../index";
import { useAppDispatch } from "../../../app/store";
import { modalActions } from "../../../features/slices/modalSlice";

const CritContent = ({ content = "", media = null, measure }) => {
    const dispatch = useAppDispatch();
    const [isImageLoaded, setIsImageLoaded] = useState(false);

    return (
        <div className="crit-content">
            <CritText text={content} />

            {media && (
                <LinkButton
                    className={`media-container ${isImageLoaded && "loaded"}`}
                    style={{
                        paddingTop: `calc(${media.height} / ${media.width} * 100%)`
                    }}
                    onClick={() => dispatch(modalActions.openModal({
                        name: "MediaModal",
                        props: { url: media.url }
                    }))}
                >
                    <LazyLoadImage
                        className="crit_media"
                        style={{
                            position: 'absolute',
                            width: '100%',
                            height: '100%',
                            top: '0',
                            left: '0'
                        }}
                        src={media.url}
                        onLoad={measure}
                        alt="Post Media"
                    />
                </LinkButton>
            )}
        </div>
    );
}

export default CritContent;