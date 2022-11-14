import React from 'react';

import './index.scss';

const Textarea = props => {
    return (
        <textarea
            name={props.name}
            value={props.value}
            placeholder={props.placeholder}
            className="ui-flow-element ui-flow-textarea"
            aria-label={props.placeholder}
            {...props.attributes}
        />
    );
}

export default Textarea;