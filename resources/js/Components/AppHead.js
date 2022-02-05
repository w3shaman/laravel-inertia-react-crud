import React from 'react'
import { Head, usePage } from '@inertiajs/inertia-react'

const AppHead = ({ title, children }) => {
    const { appName } = usePage().props;

    return (
        <Head>
            <title>{title ? `${title} - ` + appName : appName }</title>
            {children}
        </Head>
    );
}

export default AppHead;
