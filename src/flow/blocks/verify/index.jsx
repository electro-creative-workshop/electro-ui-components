import React, { createRef, useEffect, useState } from 'react';

import './index.scss';

const Verify = props => {
    const baseClass = 'ui-flow-verify';

    const translation = {
        error: 'Error requesting code',
        instructions: 'Check your email for a 4-digit confirmation code to',
        label: 'Confirmation digit',
        receipt: 'Didn\'t receive a code?',
        resend: 'Click to resend',
        sent: 'We\'ve emailed you a new code.',
        ...props.translation
    };

    const [code, setCode] = useState();
    const [sent, setSent] = useState(false);

    const inputs = [...Array(4)].map(() => createRef());

    useEffect(() => {
        send();
    }, []);

    const change = () => {
        let value = '';

        inputs.forEach(input => {
            value += input.current.value;
        });

        setCode(value);
    };

    const format = e => {
        e.target.value = e.target.value.replace(/^\D/g, '');
    };

    const focus = e => {
        e.target.select();
    };

    const advance = e => {
        if (isNaN(e.key)) {
            return;
        }

        const index = Number(e.target.dataset.index);

        if (index < 3) {
            inputs[index + 1].current.select();
        }

        change();
    };

    const paste = e => {
        e.preventDefault();

        const value = (e.clipboardData || window.clipboardData).getData('text');

        if (! /\d{1,4}/.test(value)) {
            return;
        }

        const digits = value.split('');

        inputs.forEach((input, index) => {
            input.current.value = digits[index];
        });

        change();

        inputs[digits.length - 1].current.focus();
    };

    const send = fn => {
        let formData = new FormData();

        formData.append('email', props.values.emailAddress);

        fetch(props.target, {
            method: 'POST',
            body: formData
        })
            .then(response => {
                if (! response.ok) {
                    throw new Error(translation.error);
                }

                return response;
            })
            .then(response => response.json())
            .then(response => {
                const data = response.data;

                // Extract error message
                if (response.status || data.status) {
                    let error = response.message;

                    if (data.errors && data.errors.length) {
                        error = data.errors[0].message;
                    }

                    throw new Error(error);
                }

                if (fn) {
                    fn();
                }
            })
            .catch(error => {
                props.setError(error.message);
            });
    };

    const resend = () => {
        send(() => {
            setSent(true);
        });
    };

    const Resend = () => {
        if (! sent) {
            return (
                <p className="ui-flow-copy">
                    {translation.receipt} <span className={`${baseClass}__resend`} role="button" onClick={resend}>{translation.resend}</span>
                </p>
            );
        }

        return (
            <p className="ui-flow-copy">{translation.sent}</p>
        );
    };

    return (
        <div>
            <p className="ui-flow-copy">
                {translation.instructions} {props.values.email}.
            </p>

            <div className={baseClass}>
                {[...Array(4)].map((digit, index) => {
                    return <input
                        type="text"
                        data-index={index}
                        className={`ui-flow-element ui-flow-text -number ${baseClass}__digit`}
                        maxLength={1}
                        aria-label={`${translation.label} ${index + 1}`}
                        onFocus={focus}
                        onInput={format}
                        onKeyUp={advance}
                        onPaste={paste}
                        ref={inputs[index]}
                    />
                })}
            </div>

            <p
                className="ui-flow-copy"
                dangerouslySetInnerHTML={{__html: props.value}}
            />

            <Resend />

            <input type="hidden" name="pc_verify" value={code} />
        </div>
    );
}

export default Verify;