import React from 'react';

const Confirm = props => {
    if (props.hidden) {
        return;
    }

    return (
        <div className="ui-modal-confirm">
            <p className="ui-modal-confirm__message">
                {props.translation.prompt}
            </p>

            <div className="ui-modal-confirm__actions">
                <button
                    className="ui-modal-confirm__button -bordered"
                    onClick={props.cancel}
                >
                    {props.translation.cancel}
                </button>

                <button
                    className="ui-modal-confirm__button"
                    onClick={props.confirm}
                >
                    {props.translation.confirm}
                </button>
            </div>
        </div>
    )
}

export default Confirm;