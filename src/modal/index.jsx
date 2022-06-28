import React, { createRef, useEffect, useState } from 'react';
import * as Track from '@electro/electro-ui-components/track';

import Confirm from './components/confirm';

import './index.scss';
import CloseIcon from './img/close.svg';

const body = document.getElementsByTagName('body')[0];

let scrollPosition = 0;
let activeElement;

const Modal = props => {
    const [opened, setOpened] = useState(props.isOpen);
    const [confirm, setConfirm] = useState(false);

    const bodyCropped = '-ui-modal-is-cropped';
    const ref = createRef();

    let translation = {
        cancel: 'No',
        close: 'Close modal',
        confirm: 'Yes',
        prompt: 'Are you sure you want to close this?'
    };

    if (props.translation) {
        translation = {
            ...translation,
            ...props.translation
        };
    }

    useEffect(() => {
        props.isOpen ?
            open() : check();
    }, [props.isOpen]);

    useEffect(() => {
        if (opened) {
            activeElement = document.activeElement;
        } else if (activeElement) {
            activeElement.focus();
            ref.current.remove();
        }

        Track.send('modal' + (opened ? 'Open' : 'Close'), {
            label: props.id || ''
        });
    }, [opened]);

    useEffect(() => {
        const escape = e => {
            if (e.keyCode === 27) {
                close();
            }
        };

        document.addEventListener('keydown', escape, false);

        return () => {
            document.removeEventListener('keydown', escape, false);
        }
    }, []);

    const open = () => {
        setOpened(true);

        // Lock the body position
        scrollPosition = window.scrollY;

        body.classList
            .add(bodyCropped);

        body.style.top = (scrollPosition * -1) + 'px';

        if (props.onOpen) {
            props.onOpen();
        }
    };

    const close = () => {
        if (props.onClose) {
            props.onClose();
        }

        setOpened(false);

        // Restore the body position
        body.classList
            .remove(bodyCropped);

        body.style.top = 'auto';

        window.scroll(0, scrollPosition);
    };

    const check = () => {
        if (props.confirmClose) {
            setConfirm(true);

            return;
        }

        close();
    };

    const Content = () => {
        if (props.component) {
            return props.component;
        }

        if (props.iframe) {
            return (
                <div className="ui-modal-embed">
                    <iframe src={props.iframe.url} className="ui-modal-embed__frame" />
                </div>
            );
        }

        if (props.video) {
            const src = `https://www.youtube-nocookie.com/embed/${props.video.id}?enablejsapi=1&autoplay=1&rel=0&cc_load_policy=1`;

            return (
                <div className="ui-modal-embed">
                    <iframe src={src} className="ui-modal-embed__frame" />
                </div>
            );
        }

        return null;
    };

    return (
        <div className={'ui-modal ' + (props.modifierClass || '')} {...props.attributes} hidden={! opened} ref={ref}>
            <div className="ui-modal__container">
                <div className="ui-modal__inner">
                    <div className="ui-modal__close">
                        <CloseIcon
                            className="ui-modal__close-icon"
                            aria-label={translation.close}
                            onClick={check}
                        />
                    </div>

                    <div className="ui-modal__content">
                        <Content />
                    </div>
                </div>

                 <Confirm
                     hidden={! confirm}
                     cancel={() => {
                         setConfirm(false);
                     }}
                     confirm={close}
                     translation={translation}
                 />
            </div>

            <div className="ui-modal__mask" onClick={check}></div>
        </div>
    );
}

Modal.defaultProps = {
    confirmClose: false,
    isOpen: true,
    translation: {},
    style: {}
};

export default Modal;