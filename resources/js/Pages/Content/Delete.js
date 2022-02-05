import React from 'react';
import { Link } from '@inertiajs/inertia-react';
import { Inertia } from '@inertiajs/inertia';
import AppHead from '../../Components/AppHead';
import AppBreadcrumb from '../../Components/AppBreadcrumb';

class Delete extends React.Component {
    constructor(props) {
        super(props);

        this.submitForm = this.submitForm.bind(this);
    }

    submitForm(e) {
        e.preventDefault();
        Inertia.post(route('content.delete', this.props.content.id), {submit: 1});
    }

    render() {
        const title = "Delete \"" + this.props.content.title + "\"";

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
                <h1 className="title is-1">{title}</h1>
                <form onSubmit={this.submitForm}>
                    <p className="sub-title">Are you sure want to delete this content?</p>
                    <div className="field is-grouped">
                        <div className="control">
                            <button type="submit" className="button is-danger">Yes</button>
                        </div>
                        <div className="control">
                            <Link href={route('content.index')} className="button is-link is-light">No</Link>
                        </div>
                    </div>
                </form>
            </div>
        );
    }
}

export default Delete;
