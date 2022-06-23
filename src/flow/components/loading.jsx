import React from 'react';

const Loading = props => {
    if (! props.active) {
        return null;
    }

    return (
        <div className="ui-flow__loading" />
    )
}

export default Loading;