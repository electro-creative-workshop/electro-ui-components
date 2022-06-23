import React from 'react';
import Block from './block';

const Header = props => {
    if (! props.blocks) {
        return;
    }

    return (
        <div className="ui-flow__header">
            {props.blocks.map(config =>
                <Block
                    types={props.types}
                    {...config}
                />
            )}
        </div>
    );
}

export default Header;