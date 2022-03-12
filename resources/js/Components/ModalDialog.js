import React from 'react'

class ConfirmDialog extends React.Component {
    constructor(props) {
        super(props);

        this.onConfirm = this.onConfirm.bind(this);
        this.onCancel = this.onCancel.bind(this);

        this.state = {
            show: this.props.show
        };
    }

    onConfirm(e) {
        if (this.props.onConfirm !== undefined) {
            this.props.onConfirm(e);
        }
    }

    onCancel(e) {
        this.setState({show: false});
        if (this.props.onCancel !== undefined) {
            this.props.onCancel(e);
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.props.show !== null && this.props.show !== prevProps.show) {
            this.setState(function (state, props) {
                return {show: props.show};
            });
        }
    }

    render() {
        return (
            <div className={this.state.show === true ? "modal is-active" : "modal"}>
                <div className="modal-background"></div>
                <div className="modal-card">
                    <header className="modal-card-head">
                        <p className="modal-card-title">{this.props.title}</p>
                    </header>
                    <section className="modal-card-body">
                        {this.props.message}
                    </section>
                    <footer className="modal-card-foot">
                        <a href="#" className="button is-danger" onClick={this.onConfirm}>Yes</a>
                        <a href="#" className="button is-primary" onClick={this.onCancel}>No</a>
                    </footer>
                </div>
            </div>
        );
    }
}

class ErrorDialog extends React.Component {
    constructor(props) {
        super(props);

        this.close = this.close.bind(this);

        this.state = {
            show: this.props.show
        };
    }

    close(e) {
        this.setState({show: false});
        if (this.props.onClose !== undefined) {
            this.props.onClose(e);
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.props.show !== null && this.props.show !== prevProps.show) {
            this.setState(function (state, props) {
                return {show: props.show};
            });
        }
    }

    render() {
        return (
            <div className={this.state.show === true ? "modal is-active" : "modal"}>
                <div className="modal-background"></div>
                <div className="modal-card">
                    <header className="modal-card-head">
                        <p className="modal-card-title">{this.props.title}</p>
                    </header>
                    <section className="modal-card-body">
                        {this.props.message}
                    </section>
                    <footer className="modal-card-foot">
                        <a href="#" className="button is-danger" onClick={this.close}>OK</a>
                    </footer>
                </div>
            </div>
        );
    }
}

export {ConfirmDialog, ErrorDialog};
