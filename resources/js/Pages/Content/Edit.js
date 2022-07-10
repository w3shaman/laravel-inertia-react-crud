import React from 'react';
import AppHead from '../../Components/AppHead';
import AppForm from '../../Components/AppForm';
import AppBreadcrumb from '../../Components/AppBreadcrumb';

function Edit(props) {
    var title = 'Add New Content';
    var submitUrl = route('content.add');
    var content = undefined;

    if (props.content !== undefined) {
        title = 'Edit "' + props.content.title + '"';
        submitUrl = route('content.edit', props.content.id);
        content = props.content;
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
                errors={props.errors}
                flash={props.flash}
                submitUrl={submitUrl}
                assetUrl={props.assetUrl}
                content={content} />
        </div>
    );
}

export default Edit;
