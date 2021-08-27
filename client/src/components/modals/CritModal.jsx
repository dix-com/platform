import "../../styles/CritModal.css";

import { ColumnHeader, CritInput, BaseModal } from "../index";

const CritModal = ({ isOpen, onClose }) => {
    return (
        <BaseModal
            isOpen={isOpen}
            onClose={onClose}
            className="crit-modal"
        >
            <ColumnHeader close={onClose} />
            <CritInput forceExpand={true} />
        </BaseModal>
    );
};

export default CritModal;
