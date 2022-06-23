import React from 'react';

import './index.scss';

const Text = props => {
    return (
        <input
            type={props.type}
            name={props.name}
            value={props.value}
            placeholder={props.placeholder}
            className={`ui-flow-element ui-flow-text -${props.type}`}
            {...props.rules}
        />
    );
}

export default Text;