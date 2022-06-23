import React from 'react';

const Hidden = props => {
    return (
        <input
            type="hidden"
            name={props.name}
            value={props.value}
        />
    );
}

export default Hidden;