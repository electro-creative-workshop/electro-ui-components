import React, { createRef, useEffect, useState } from 'react';
import * as Track from '@electro/electro-ui-components/track';

import Error from './components/error';
import Header from './components/header';
import Loading from './components/loading';
import Step from './components/step';

import './index.scss';

import Button from './blocks/button';
import Checkbox from './blocks/checkbox';
import Copy from './blocks/copy';
import Heading from './blocks/heading';
import Hidden from './blocks/hidden';
import Image from './blocks/image';
import Select from './blocks/select';
import Tags from './blocks/tags';
import Text from './blocks/text';
import Textarea from './blocks/textarea';
import Verify from './blocks/verify';

const Flow = props => {
    const [error, setError] = useState(null);
    const [header, setHeader] = useState([]);
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState(props.step);
    const [steps, setSteps] = useState([]);
    const [values, setValues] = useState(props.values);

    const flow = createRef();
    const form = createRef();

    let types = {
        button: Button,
        checkbox: Checkbox,
        copy: Copy,
        email: Text,
        heading: Heading,
        hidden: Hidden,
        image: Image,
        number: Text,
        select: Select,
        submit: Button,
        tags: Tags,
        textarea: Textarea,
        text: Text,
        verify: Verify
    };

    types = {
        ...types,
        ...props.blocks
    };

    useEffect(() => {
        if (props.source) {
            setLoading(true);

            fetch(props.source)
                .then(response => response.json())
                .then(data => {
                    setHeader(data.header);
                    setSteps(data.steps);
                    setLoading(false);
                });
        }
    }, []);

    useEffect(() => {
        setError(props.error);
    }, [props.error]);

    const navigate = step => {
        setStep(step);

        Track.send('flowNavigate', {
            label: steps[step - 1].ref || '',
            value: step,
            context: {
                flow: props.id || ''
            }
        });

        if (flow.current.scrollIntoViewIfNeeded) {
            flow.current.scrollIntoViewIfNeeded();
        }
    };

    const back = () => {
        navigate(step - 1);
    };

    const next = () => {
        navigate(step + 1);
    };

    const validate = e => {
        e.preventDefault();

        const el = form.current;
        const valid = el.checkValidity();
        const formData = new FormData(el);

        const data = Array.from(formData.keys()).reduce((el, key) => {
            if (el[key]) {
                el[key] = formData.getAll(key)

                return el;
            }

            el[key] = formData.get(key);

            return el;
        }, {});

        setValues(prev => ({
            ...prev,
            ...data
        }));

        requestAnimationFrame(() => {
            el.reportValidity();
        });

        console.log(values);

        return valid;
    };

    const actions = {
        back: () => {
            if (props.onStep) {
                props.onStep(step);
            }

            back();
        },
        cancel: () => {
            if (props.onCancel) {
                props.onCancel();
            }
        },
        next: e => {
            if (! validate(e)) {
                return;
            }

            if (props.onStep) {
                props.onStep(step);
            }

            next();
        },
        redirect: (e, config) => {
            if (config.url) {
                window.location.href = config.url;
            }
        },
        submit: (e, config) => {
            if (! validate(e)) {
                return;
            }

            if (config.target) {
                setLoading(true);

                fetch(config.target, {
                    method: 'POST',
                    body: JSON.stringify(values)
                })
                    .then(response => response.json())
                    .then(response => {
                        const data = response.data;

                        setLoading(false);

                        if (response.status) {
                            setError(data.errors[0].message);

                            if (props.onFailure) {
                                props.onFailure(data);
                            }

                            return;
                        }

                        setError(null);

                        if (props.onSuccess) {
                            props.onSuccess(data);
                        }
                    });
            }

            if (step < steps.length) {
                actions.next();
            }
        }
    };

    return (
        <div className={'ui-flow ' + (props.modifierClass || '')} ref={flow}>
            <Header
                blocks={header}
                types={types}
            />

            <Error message={error} />
            <Loading active={loading} />

            <form className="ui-flow__steps" ref={form}>
                {steps.map((config, index) =>
                    <Step
                        actions={actions}
                        blocks={config.blocks}
                        current={step}
                        position={index + 1}
                        step={step}
                        types={types}
                        values={values}
                    />
                )}
            </form>
        </div>
    );
}

Flow.defaultProps = {
    blocks: {},
    step: 1,
    steps: [],
    values: {}
};

export default Flow;