import React, { createRef, useEffect, useState } from 'react';

import './index.scss';

const Verify = props => {
    const baseClass = 'ui-flow-verify';

    const [code, setCode] = useState();
    const [consumerId, setConsumerId] = useState(props.values.consumerId);
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

    const focus = e => {
        e.target.select();
    };

    const advance = e => {
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
    };

    const send = () => {
        fetch(props.target, {
            method: 'POST',
            body: JSON.stringify({
                email: props.values.email
            })
        })
            .then(response => response.json())
            .then(data => {
                setConsumerId(data.data.encrypted_consumer_id);
            });
    };

    const resend = () => {
        setSent(true);

        send();
    };

    const translation = {
        instructions: 'Check your email for a 4-digit confirmation code to',
        receipt: 'Didn\'t receive a code?',
        resend: 'Click to resend',
        sent: 'We\'ve emailed you a new code.',
        ...props.translation
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
                        type="number"
                        min={0}
                        max={9}
                        maxLength={1}
                        data-index={index}
                        className={`ui-flow-element ui-flow-text -number ${baseClass}__digit`}
                        onFocus={focus}
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

            <input type="hidden" name="verification_code" value={code} />
            <input type="hidden" name="encrypted_consumer_id" value={consumerId} />
        </div>
    );
}

export default Verify;