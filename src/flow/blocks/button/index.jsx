import React from 'react';

import './index.scss';

const Button = props => {
    if (! props.action && props.type === 'submit') {
        props.action = 'submit';
    }

    return (
        <button
            type={props.type}
            className={'ui-flow-button' + (props.bordered ? ' -bordered' : '')}
            onClick={e => props.actions[props.action](e, props)}
        >
            {props.label}
        </button>
    );
}

export default Button;