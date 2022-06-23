import React from 'react';

import './index.scss';

const Copy = props => {
    return (
        <p
            className="ui-flow-copy"
            dangerouslySetInnerHTML={{__html: props.value}}
        />
    );
}

export default Copy;