import React from 'react'
import { Link } from '@inertiajs/inertia-react';

function Pagination(props) {
    return (
        <div>
            <nav className="pagination" role="navigation" aria-label="pagination">
                <ul className="pagination-list">
                    {props.links.length > 0 && props.links.map(({label, url, active}, index) =>
                        <li key={index}>
                            {active === true
                                ? <Link className="pagination-link is-current" href="#" dangerouslySetInnerHTML={{ __html: label }} />
                                : <Link className="pagination-link" href={url} dangerouslySetInnerHTML={{ __html: label }} />
                            }
                        </li>
                    )}
                </ul>
            </nav>
        </div>
    );
}

export default Pagination;
