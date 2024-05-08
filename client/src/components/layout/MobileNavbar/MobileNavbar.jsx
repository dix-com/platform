import "./styles.css";

import { NavLink, useLocation } from "react-router-dom";
import { IconContext } from "react-icons";
import {
    BiHomeCircle,
    BiSolidHomeCircle,
    BiSearch,
    BiBell,
    BiSolidBell,
    BiEnvelope,
    BiSolidEnvelope
} from "react-icons/bi";
import { FaFeatherAlt } from "react-icons/fa";
import { CritModal } from "../../index";
import useModal from "../../../hooks/useModal";

const MobileNavbar = () => {
    const { pathname } = useLocation();

    const {
        isOpen: critModal,
        open: openCritModal,
        close: closeCritModal
    } = useModal();


    return (
        <div className="mobile-navbar">
            {critModal && (
                <>
                    <div className="modal-wrapper" style={{ willChange: "opacity" }}>
                    </div>
                    <CritModal
                        isOpen={critModal}
                        onClose={closeCritModal}
                    />
                </>
            )}

            <NavLink
                to={`/home`}
                className="navbar-link"
                children={({ isActive }) => (
                    <>
                        {isActive ? (
                            <BiSolidHomeCircle size="23" />
                        ) : (
                            <BiHomeCircle size="23" />
                        )}
                    </>
                )}
                state={{ previousPath: pathname }}
            />

            <NavLink
                to={`/explore`}
                className="navbar-link"
                children={({ isActive }) => (
                    <>
                        <BiSearch size="23" />
                    </>
                )}
                state={{ previousPath: pathname }}
            />

            <NavLink
                to={`/notifications`}
                className="navbar-link"
                children={({ isActive }) => (
                    <>
                        {isActive ? (
                            <BiSolidBell size="23" />
                        ) : (
                            <BiBell size="23" />
                        )}
                    </>
                )}
                state={{ previousPath: pathname }}
                disabled
            />

            <NavLink
                to={`/messages`}
                className="navbar-link"
                children={({ isActive }) => (
                    <>
                        {isActive ? (
                            <BiSolidEnvelope size="23" />
                        ) : (
                            <BiEnvelope size="23" />
                        )}
                    </>
                )}
                state={{ previousPath: pathname }}
                disabled
            />

            <button
                type="button"
                className="accent-btn navbar-btn"
                onClick={openCritModal}
            >
                <IconContext.Provider
                    value={{ className: "navbar-btn_icon" }}
                >
                    <FaFeatherAlt size="15" />
                </IconContext.Provider>
            </button>
        </div>
    )
}

export default MobileNavbar;