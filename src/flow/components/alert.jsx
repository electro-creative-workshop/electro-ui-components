import React from 'react';

import Icon from '../img/alert.svg';

const Alert = props => {
    if (! props.message) {
        return null;
    }

    return (
        <div className="ui-flow__error">
            <Icon className="ui-flow__error-icon" />
            <span className="ui-flow__error-message">{props.message}</span>
        </div>
    );
}

export default Alert;