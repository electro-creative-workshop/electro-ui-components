import React, { createRef, useEffect, useState } from 'react';
import * as Track from '@electro/electro-ui-components/track';

import Alert from './components/alert';
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

    /**
     * Initialize flow with either object or remote JSON
     */
    useEffect(() => {
        const source = props.source;

        if (! source) {
            return;
        }

        if (typeof source === 'string') {
            setLoading(true);

            fetch(source)
                .then(response => response.json())
                .then(data => {
                    configure(data);
                    setLoading(false);
                });

            return;
        }

        configure(source);
    }, []);

    /**
     * Listen and apply error state
     */
    useEffect(() => {
        setError(props.error);
    }, [props.error]);

    /**
     * Apply flow configuration
     *
     * @param {Object} data
     */
    const configure = data => {
        setHeader(data.header);
        setSteps(data.steps);
    };

    /**
     * Navigate to step number
     *
     * @param {Number} step
     */
    const navigate = step => {
        if (props.onStep) {
            props.onStep(step);
        }

        setStep(step);

        Track.send('flowNavigate', {
            label: steps[step - 1].id || '',
            value: step,
            context: {
                flow: props.id || ''
            }
        });

        if (flow.current && flow.current.scrollIntoViewIfNeeded) {
            flow.current.scrollIntoViewIfNeeded();
        }
    };

    /**
     * Return to previous step
     */
    const back = () => {
        navigate(step - 1);
    };

    /**
     * Proceed to next step
     */
    const next = () => {
        navigate(step + 1);
    };

    /**
     * Check form validity and merge values into store
     *
     * @returns {(false|Object)}
     */
    const validate = () => {
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

        const post = {
            ...values,
            ...data
        };

        setValues(post);

        requestAnimationFrame(() => {
            el.reportValidity();
        });

        return valid ?
            post : false;
    };

    /**
     * Actions available to buttons
     */
    const actions = {
        back: () => {
            back();
        },
        cancel: () => {
            if (props.onCancel) {
                props.onCancel();
            }
        },
        next: () => {
            if (! validate()) {
                return;
            }

            next();
        },
        redirect: (e, config) => {
            if (config.url) {
                window.location.href = config.url;
            }
        },
        submit: (e, config) => {
            if (e) {
                e.preventDefault();
            }

            const post = validate();

            if (! post || ! config.target) {
                return;
            }

            setError(null);
            setLoading(true);

            let formData = new FormData();

            Object.entries(post).forEach(([name, value]) => {
                if (value && Array.isArray(value)) {
                    Object.entries(value).forEach(([key, selection]) => {
                        formData.append(`${name}[${key}]`, selection);
                    });
                } else {
                    formData.append(name, value === null ? '' : value);
                }
            });

            fetch(config.target, {
                method: 'POST',
                body: formData
            })
                .then(response => {
                    if (! response.ok) {
                        throw new Error('Error submitting form');
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

                    setLoading(false);

                    if (props.onSuccess) {
                        props.onSuccess(data);
                    }

                    if (step < steps.length) {
                        next();
                    }
                })
                .catch(error => {
                    setError(error.message);
                    setLoading(false);

                    if (props.onFailure) {
                        props.onFailure(error);
                    }
                });
        }
    };

    return (
        <div className={'ui-flow ' + (props.modifierClass || '')} ref={flow}>
            <Header
                blocks={header}
                types={types}
            />

            <Alert message={error} />
            <Loading active={loading} />

            <form className="ui-flow__steps" ref={form}>
                {steps.map((config, index) =>
                    <Step
                        actions={actions}
                        blocks={config.blocks}
                        current={step}
                        position={index + 1}
                        setError={setError}
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