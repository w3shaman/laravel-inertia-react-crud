import React, { useState, useEffect } from 'react';
import { Inertia } from '@inertiajs/inertia';
import { Link } from '@inertiajs/inertia-react';
import AppHead from '../../Components/AppHead';
import { ConfirmDialog } from '../../Components/ModalDialog';
import Pagination from '../../Components/Pagination';

function Index(props) {
    const [keyword, setKeyword] = useState(props.keyword === null ? '' : props.keyword);
    const [data, setData] = useState(props.contents.data);
    const [data_count, setDataCount] = useState(props.contents.total);
    const [data_per_page, setDataPerPage] = useState(props.contents.per_page);
    const [pager, setPager] = useState(props.contents.links);
    const [show_delete_confirmation, setShowDeleteConfirmation] = useState(false);
    const [del_content_id, setDelContentId] = useState(0);
    const [del_content_title, setDelContentTitle] = useState('');

    useEffect((e) => {
        setData(props.contents.data);
        setDataCount(props.contents.total);
        setDataPerPage(props.contents.per_page);
        setPager(props.contents.links);
    }, [props.keyword]);

    const submitSearch = function(e) {
        e.preventDefault();
        Inertia.post("/", {search: 1, keyword: keyword});
    }

    const clearSearch = function(e) {
        setKeyword('');
        Inertia.post("/", {search: 1, keyword: ''});
    }

    const changeKeyword = function(e) {
        setKeyword(e.target.value);
    }

    const showDeleteConfirmation = function(id, title, e) {
        e.preventDefault();

        setShowDeleteConfirmation(true);
        setDelContentId(id);
        setDelContentTitle(title);
    }

    const confirmDelete = function(e) {
        window.location.href = route('content.delete', del_content_id);
    }

    const cancelDelete = function(e) {
        e.preventDefault();

        setShowDeleteConfirmation(false);
    }

    return (
        <div>
            <AppHead title={"Content List"}/>
            <h1 className="title is-1">Content List</h1>
            {props.flash.error !== null && <div className='message is-danger'><div className="message-body">{props.flash.error}</div></div>}
            {props.flash.warning !== null && <div className='message is-warning'><div className="message-body">{props.flash.warning}</div></div>}
            {props.flash.success !== null && <div className='message is-success'><div className="message-body">{props.flash.success}</div></div>}
            <div className="content-list-button"><Link href={route('content.add')} className="button is-link">Add new</Link></div>
            <div className="content-list-search">
                <form method="post" onSubmit={submitSearch}>
                    <div className="field is-grouped">
                        <div className="control">
                            <input className="input" type="text" id="keyword" placeholder="Type keyword here..." value={keyword} onChange={changeKeyword} />
                        </div>
                        <div className="control">
                            <button type="submit" id="search" className="button is-primary">Search</button>
                        </div>
                        <div className="control">
                            <button type="button" id="clear" className="button is-light" onClick={clearSearch} disabled={keyword === null || keyword === undefined || keyword === ''}>Clear search</button>
                        </div>
                    </div>
                </form>
            </div>
            <div className="table-container">
                <table className="table is-striped is-hoverable">
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>Published</th>
                            <th>Published date</th>
                            <th colSpan='2'>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.length > 0 && data.map(({id, title, publish, publish_date}) => <tr key={id}>
                                <td>{title}</td>
                                <td>{publish}</td>
                                <td>{publish_date}</td>
                                <td>
                                    <Link href={route('content.edit', id)} className="button is-info">Edit</Link>
                                </td>
                                <td>
                                    <Link href="#" className="button is-danger" onClick={(e) => showDeleteConfirmation(id, title, e)}>Delete</Link>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            <ConfirmDialog
                id="delete-content-dialog"
                title="Delete Content"
                message={`Are you sure want to delete "${del_content_title}"?`}
                show={show_delete_confirmation}
                onConfirm={confirmDelete}
                onCancel={cancelDelete}
            />
            {data_count > data_per_page && <Pagination links={pager} />}
        </div>
    );
}

export default Index;
