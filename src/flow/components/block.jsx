import React from 'react';

const Block = props => {
    const Tag = props.types[props.type] || null;

    if (! Tag) {
        return;
    }

    props = {
        modifierClass: '',
        rules: {},
        ...props
    };

    delete props.types;

    props.modifierClass += ` -${props.type}`;

    [
        'center',
        'split'
    ].forEach(modifier => {
        if (props[modifier]) {
            props.modifierClass += ` -${modifier}`;
        }
    });

    if (props.name) {
        const value = props.values[props.name];

        if (value) {
            props.value = value;
        }
    }

    return (
        <div className={`ui-flow__block ${props.modifierClass}`}>
            <Tag {...props} />
        </div>
    )
}

export default Block;