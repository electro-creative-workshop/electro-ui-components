import React from 'react';

import './index.scss';
import Icon from './img/check.svg';

const Checkbox = props => {
    const baseClass = 'ui-flow-checkbox';

    return (
        <label className={baseClass}>
            <div className={`${baseClass}__check`}>
                <input
                    type="checkbox"
                    name={props.name}
                    value={props.value || 'on'}
                    checked={props.checked}
                    className={`${baseClass}__input`}
                    {...props.attributes}
                />

                <div className={`ui-flow-element ${baseClass}__toggle`}>
                    <Icon className={`${baseClass}__toggle-icon`} />
                </div>
            </div>

            <span className={`${baseClass}__label`}>{props.label}</span>
        </label>
    );
}

export default Checkbox;