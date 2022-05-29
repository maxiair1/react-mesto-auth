import React from "react";

function InfoTooltip(props) {
    return(
        <div className= {`popup ${props.isOpen && 'popup_opened'}`}>
            <div className="popup__container popup__infoTooltip">
                <div className={`popup__infoTooltip-icon popup__infoTooltip-icon_type_${props.infoIcon}`}></div>
                <p className="popup__infoTooltip-message">{props.infoMessage}</p>
                <button type="button"
                        aria-label="Закрыть"
                        onClick={props.onClose}
                        className={`popup__button-close`}/>
            </div>
        </div>
    )
}

export default InfoTooltip;