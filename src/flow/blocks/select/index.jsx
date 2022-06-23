import React from 'react';

import './index.scss';
import Caret from './img/caret.svg';

const Select = props => {
    const baseClass = 'ui-flow-select';

    const Placeholder = () => {
        if (! props.placeholder) {
            return;
        }

        return <option value="" disabled selected>{props.placeholder}</option>
    };

    return (
        <div className={baseClass}>
            <select
                name={props.name}
                className={`ui-flow-element ${baseClass}__input`}
                {...props.rules}
            >
                <Placeholder />

                {Object.entries(props.options).map(([value, label]) =>
                    <option value={value} selected={value === props.value}>{label}</option>
                )}
            </select>

            <Caret className={`${baseClass}__icon`} />
        </div>
    );
}

export default Select;