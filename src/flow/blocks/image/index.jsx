import React from 'react';

const Image = props => {
    return (
        <img
            src={props.src}
            alt={props.alt}
            className="ui-flow-image"
            {...props.attributes}
        />
    );
}

export default Image;