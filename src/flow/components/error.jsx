import React from 'react';

import Alert from '../img/alert.svg';

const Error = props => {
    if (! props.message) {
        return null;
    }

    return (
        <div className="ui-flow__error">
            <Alert className="ui-flow__error-icon" />
            <span className="ui-flow__error-message">{props.message}</span>
        </div>
    );
}

export default Error;