import React from 'react'
import { Inertia } from '@inertiajs/inertia';
import moment from 'moment';
import { Editor } from '@tinymce/tinymce-react';

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import { ErrorDialog } from './ModalDialog';

class AppForm extends React.Component {
    constructor(props) {
        super(props);

        this.MOMENT_FORMAT = 'YYYY-MM-DD hh:mm:ss';

        this.changeValue = this.changeValue.bind(this);
        this.changeBodyValue = this.changeBodyValue.bind(this);
        this.changeImageFile = this.changeImageFile.bind(this);
        this.removeImage = this.removeImage.bind(this);
        this.invalidImage = this.invalidImage.bind(this);
        this.closeInvalidImageModal = this.closeInvalidImageModal.bind(this);
        this.changePublishDateValue = this.changePublishDateValue.bind(this);
        this.submitForm = this.submitForm.bind(this);

        this.imageUploader = React.createRef();

        if (this.props.content == undefined) {
            this.state = {
                title: '',
                body: '',
                invalid_image: false,
                publish: 'Y',
                publish_date: moment().format(this.MOMENT_FORMAT),
                submit: 1,
            };
        }
        else {
            this.state = {
                id: this.props.content.id,
                title: this.props.content.title,
                body: this.props.content.body,
                invalid_image: false,
                publish: this.props.content.publish,
                publish_date: this.props.content.publish_date,
                submit: 1,
            };
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.props.flash.success !== null && this.props.flash.success !== prevProps.flash.success && prevState.id === undefined) {
            this.setState({
                title: '',
                body: '',
                invalid_image: false,
                publish: 'Y',
                publish_date: moment().format(this.MOMENT_FORMAT),
            });

            this.imageUploader.current.clearValue();
        }
    }

    changeValue(e) {
        const key = e.target.id;
        const value = e.target.value;

        this.setState({[key]: value});
    }

    changeBodyValue(value, editor) {
        this.setState({body: value});
    }

    changeImageFile(e) {
        this.setState({image: e.target.files[0]});
    }

    removeImage(e) {
        this.setState({remove_image: true});
    }

    invalidImage(e) {
        this.setState({invalid_image: true});
    }

    closeInvalidImageModal(e) {
        this.setState({invalid_image: false});
    }

    changePublishDateValue(date) {
        this.setState({publish_date: moment(date).format(this.MOMENT_FORMAT)});
    }

    submitForm(e) {
        e.preventDefault();

        var postData = this.state;
        if (e.nativeEvent.submitter.id == 'save') {
            postData['save_mode'] = 'save';
        }
        else {
            postData['save_mode'] = 'save_continue';
        }

        Inertia.post(this.props.submitUrl, postData, {forceFormData: true});
    }

    render() {
        return (
            <div>
                <h1 className="title is-1">{this.props.title}</h1>
                {this.props.flash.error !== null && <div className='message is-danger'><div className="message-body">{this.props.flash.error}</div></div>}
                {this.props.flash.warning !== null && <div className='message is-warning'><div className="message-body">{this.props.flash.warning}</div></div>}
                {this.props.flash.success !== null && <div className='message is-success'><div className="message-body">{this.props.flash.success}</div></div>}
                <form method="post" onSubmit={this.submitForm}>
                    <div className="field">
                        <label className="label" htmlFor="title">Title:</label>
                        <div className="control">
                            <input className="input" type="text" id="title" value={this.state.title} onChange={this.changeValue} />
                            {this.props.errors.title && <p className="help is-danger">{this.props.errors.title}</p>}
                        </div>
                    </div>
                    <div className="field">
                        <label className="label" htmlFor="body">Body:</label>
                        <div className="control">
                            <Editor tinymceScriptSrc={this.props.assetUrl + '/tinymce/tinymce.min.js'} id="body" value={this.state.body} onEditorChange={this.changeBodyValue} />
                            {this.props.errors.body && <p className="help is-danger">{this.props.errors.body}</p>}
                        </div>
                    </div>
                    <div className="field">
                        <label className="label" htmlFor="image">Image:</label>
                        <div className="control">
                            <ImageUploader id="image"
                                className="input"
                                ref={this.imageUploader}
                                defaultImage={this.props.content !== undefined && this.props.content.image !=='' ? this.props.content.image : undefined}
                                onChange={this.changeImageFile}
                                onRemove={this.removeImage}
                                onInvalidImage={this.invalidImage} />
                            {this.props.errors.image && <p className="help is-danger">{this.props.errors.image}</p>}
                            <ErrorDialog
                                id="image-error-dialog"
                                title="Error"
                                message="Please upload a valid image file!"
                                show={this.state.invalid_image}
                                onClose={this.closeInvalidImageModal}
                            />
                        </div>
                    </div>
                    <div className="field">
                        <label className="label" htmlFor="publish">Publish:</label>
                        <div className="control">
                            <div className="select">
                                <select id="publish" value={this.state.publish} onChange={this.changeValue}>
                                    <option value="Y">Yes</option>
                                    <option value="N">No</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <div className="field">
                        <label className="label" htmlFor="publish_date">Publish date:</label>
                        <div className="control">
                            <DatePicker
                                id="publish_date"
                                className="input"
                                selected={moment(this.state.publish_date, this.MOMENT_FORMAT).toDate()}
                                onChange={this.changePublishDateValue}
                                showTimeSelect
                                timeFormat="HH:mm:ss"
                                timeIntervals={15}
                                timeCaption="Time"
                                dateFormat="yyyy-MM-dd HH:mm:ss"
                            />
                        </div>
                    </div>
                    <br/>
                    <div className="field is-grouped">
                        <div className="control">
                            <button id="save" type="submit" className="button is-primary">Save</button>
                        </div>
                        <div className="control">
                            <button id="save-continue" type="submit" className="button is-primary">{ `Save & ${this.props.content == undefined ? 'add next' : 'continue edit'}` }</button>
                        </div>
                    </div>
                </form>
            </div>
        );
    }
}

class ImageUploader extends React.Component {
    constructor(props) {
        super(props);

        this.imageInput = React.createRef();
        this.clearValue = this.clearValue.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleRemove = this.handleRemove.bind(this);

        if (this.props.defaultImage !== undefined && this.props.defaultImage !==null && this.props.defaultImage !=='') {
            this.state = {
                image_preview: this.props.defaultImage
            };
        }
        else {
            this.state = {
                image_preview: null
            };
        }
    }

    clearValue() {
        this.setState({
          image_preview: null,
        })

        this.imageInput.current.value = null;
    }

    handleChange(e) {
        var file = e.target.files[0];
        var type = file.type.split('/').pop().toLowerCase();
        if (type !== "jpeg" && type !== "jpg" && type !== "png" && type !== "bmp" && type !== "gif") {
            if (this.props.onInvalidImage !== undefined) {
                this.props.onInvalidImage(e);
            }
        }
        else {
            this.setState({
              image_preview: URL.createObjectURL(file),
            });
        }

        this.props.onChange(e);
    }

    handleRemove(e) {
        this.clearValue();
        this.props.onRemove(e);
    }

    render() {
        return (
            <>
                <input className={this.props.className} type="file" id={this.props.id} ref={this.imageInput} onChange={this.handleChange} />
                {this.state.image_preview !== null && <div id="imageuploader-preview"><img src={this.state.image_preview} /> <button type="button" onClick={this.handleRemove} className="button is-danger is-light">Remove Image</button></div>}
            </>
        );
    }
}

export default AppForm;
