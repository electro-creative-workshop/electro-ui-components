import React from 'react';

import './index.scss';

const Heading = props => {
    return (
        <h2 className="ui-flow-heading">{props.value}</h2>
    );
}

export default Heading;