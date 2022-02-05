import React from 'react';
import AppHead from '../../Components/AppHead';
import AppForm from '../../Components/AppForm';
import AppBreadcrumb from '../../Components/AppBreadcrumb';

class Edit extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        var title = 'Add New Content';
        var submitUrl = route('content.add');
        var content = undefined;

        if (this.props.content !== undefined) {
            title = 'Edit "' + this.props.content.title + '"';
            submitUrl = route('content.edit', this.props.content.id);
            content = this.props.content;
        }

        return (
            <div>
                <AppHead title={title}/>
                <AppBreadcrumb backLinks={[
                        {
                            title: 'Content List',
                            url: route('content.index'),
                        },
                        {
                            title: title,
                            url: '',
                        }
                    ]} />
                <AppForm
                    title={title}
                    errors={this.props.errors}
                    flash={this.props.flash}
                    submitUrl={submitUrl}
                    assetUrl={this.props.assetUrl}
                    content={content} />
            </div>
        );
    }
}

export default Edit;
