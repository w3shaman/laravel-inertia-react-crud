import React, { useState, useEffect } from 'react'

function ConfirmDialog(props) {
    const [show, setShow] = useState(false);

    useEffect((e) => {
        setShow(props.show);
    }, [props.show]);

    const onConfirm = function(e) {
        if (props.onConfirm !== undefined) {
            props.onConfirm(e);
        }
    }

    const onCancel = function(e) {
        setShow(false);
        if (props.onCancel !== undefined) {
            props.onCancel(e);
        }
    }

    return (
        <div className={show === true ? "modal is-active" : "modal"}>
            <div className="modal-background"></div>
            <div className="modal-card">
                <header className="modal-card-head">
                    <p className="modal-card-title">{props.title}</p>
                </header>
                <section className="modal-card-body">
                    {props.message}
                </section>
                <footer className="modal-card-foot">
                    <a href="#" className="button is-danger" onClick={onConfirm}>Yes</a>
                    <a href="#" className="button is-primary" onClick={onCancel}>No</a>
                </footer>
            </div>
        </div>
    );
}

function ErrorDialog(props) {
    const [show, setShow] = useState(false);

    useEffect((e) => {
        setShow(props.show);
    }, [props.show]);

    const close = function(e) {
        setShow(false);
        if (props.onClose !== undefined) {
            props.onClose(e);
        }
    }

    return (
        <div className={show === true ? "modal is-active" : "modal"}>
            <div className="modal-background"></div>
            <div className="modal-card">
                <header className="modal-card-head">
                    <p className="modal-card-title">{props.title}</p>
                </header>
                <section className="modal-card-body">
                    {props.message}
                </section>
                <footer className="modal-card-foot">
                    <a href="#" className="button is-danger" onClick={close}>OK</a>
                </footer>
            </div>
        </div>
    );
}

export {ConfirmDialog, ErrorDialog};
