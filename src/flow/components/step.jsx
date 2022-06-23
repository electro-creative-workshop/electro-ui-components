import React from 'react';
import Block from './block';

const Step = props => {
    if (props.position !== props.step) {
        return null;
    }

    return (
        <div className="ui-flow__step">
            {props.blocks.map(config =>
                <Block
                    {...props}
                    {...config}
                />
            )}
        </div>
    )
}

export default Step;