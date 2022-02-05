import React from 'react'
import { Inertia } from '@inertiajs/inertia';
import { Link } from '@inertiajs/inertia-react';

class AppBreadcrumb extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <nav className="breadcrumb" aria-label="breadcrumbs">
                    <ul>
                        {this.props.backLinks.map(({title, url}, index) =>
                            <li key={index} className={url !== '' ? undefined : "is-active"}>
                                <Link href={url} aria-current={url !== '' ? undefined : "page"}>{title}</Link>
                            </li>
                        )}
                    </ul>
                </nav>
            </div>
        );
    }
}

export default AppBreadcrumb;
