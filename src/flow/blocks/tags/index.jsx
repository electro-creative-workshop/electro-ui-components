import React from 'react';

import './index.scss';

const Tags = props => {
    const baseClass = 'ui-flow-tags';

    const values = Array.isArray(props.value) ?
        props.value : [props.value];

    return (
        <div className={baseClass}>
            {Object.entries(props.options).map(([value, label]) =>
                <label className={`${baseClass}__option`}>
                    <input
                        type={props.multiple ? 'checkbox' : 'radio'}
                        name={props.name}
                        value={value}
                        checked={!! values.includes(value)}
                        className={`${baseClass}__input`}
                        {...props.attributes}
                    />

                    <span className={`ui-flow-element ${baseClass}__label`}>{label}</span>
                </label>
            )}
        </div>
    );
}

export default Tags;