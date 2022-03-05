import React from 'react';
import { Inertia } from '@inertiajs/inertia';
import { Link } from '@inertiajs/inertia-react';
import AppHead from '../../Components/AppHead';
import ConfirmDialog from '../../Components/ModalDialog';

class Index extends React.Component {
    constructor(props) {
        super(props);

        this.submitSearch = this.submitSearch.bind(this);
        this.clearSearch = this.clearSearch.bind(this);
        this.changeKeyword = this.changeKeyword.bind(this);
        this.showDeleteConfirmation = this.showDeleteConfirmation.bind(this);
        this.confirmDelete = this.confirmDelete.bind(this);
        this.cancelDelete = this.cancelDelete.bind(this);

        this.state = {
            keyword: this.props.keyword === null ? '' : this.props.keyword,
            data: this.props.contents.data,
            data_count: this.props.contents.total,
            data_per_page: this.props.contents.per_page,
            pager: this.props.contents.links,
            show_delete_confirmation: false
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.props.keyword !== prevProps.keyword) {
            this.setState({
                data: this.props.contents.data,
                data_count: this.props.contents.total,
                data_per_page: this.props.contents.per_page,
                pager: this.props.contents.links
            });
        }
    }

    submitSearch(e) {
        e.preventDefault();
        Inertia.post("/", {search: 1, keyword: this.state.keyword});
    }

    clearSearch(e) {
        this.setState({keyword: ''});
        Inertia.post("/", {search: 1, keyword: ''});
    }

    changeKeyword(e) {
        this.setState({keyword: e.target.value});
    }

    showDeleteConfirmation(e, id, title) {
        e.preventDefault();

        this.setState({
            show_delete_confirmation: true,
            del_content_id: id,
            del_content_title: title
        });
    }

    confirmDelete(e) {
        window.location.href = route('content.delete', this.state.del_content_id);
    }

    cancelDelete(e) {
        e.preventDefault();

        this.setState({show_delete_confirmation: false});
    }

    render() {
        return (
            <div>
                <AppHead title={"Content List"}/>
                <h1 className="title is-1">Content List</h1>
                {this.props.flash.error !== null && <div className='message is-danger'><div className="message-body">{this.props.flash.error}</div></div>}
                {this.props.flash.warning !== null && <div className='message is-warning'><div className="message-body">{this.props.flash.warning}</div></div>}
                {this.props.flash.success !== null && <div className='message is-success'><div className="message-body">{this.props.flash.success}</div></div>}
                <div className="content-list-button"><Link href={route('content.add')} className="button is-link">Add new</Link></div>
                <div className="content-list-search">
                    <form method="post" onSubmit={this.submitSearch}>
                        <div className="field is-grouped">
                            <div className="control">
                                <input className="input" type="text" id="keyword" placeholder="Type keyword here..." value={this.state.keyword} onChange={this.changeKeyword} />
                            </div>
                            <div className="control">
                                <button type="submit" id="search" className="button is-primary">Search</button>
                            </div>
                            <div className="control">
                                <button type="button" id="clear" className="button is-light" onClick={this.clearSearch} disabled={this.state.keyword === null || this.state.keyword === undefined || this.state.keyword === ''}>Clear search</button>
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
                            {this.state.data.length > 0 && this.state.data.map(({id, title, publish, publish_date}) => <TableRow
                                key={id}
                                id={id}
                                title={title}
                                publish={publish}
                                publish_date={publish_date}
                                onDelete={this.showDeleteConfirmation} />
                            )}
                        </tbody>
                    </table>
                </div>
                <ConfirmDialog
                    id="delete-content-dialog"
                    title="Delete Content"
                    message={`Are you sure want to delete "${this.state.del_content_title}"?`}
                    show={this.state.show_delete_confirmation}
                    onConfirm={this.confirmDelete}
                    onCancel={this.cancelDelete}
                />
                {this.state.data_count > this.state.data_per_page && <Pagination links={this.state.pager} />}
            </div>
        );
    }
}

class TableRow extends React.Component {
    constructor(props) {
        super(props);

        this.showDeleteConfirmation = this.showDeleteConfirmation.bind(this);
    }

    showDeleteConfirmation(e) {
        if (this.props.onDelete !== undefined) {
            this.props.onDelete(e, this.props.id, this.props.title);
        }
    }

    render() {
        return (
            <tr>
                <td>{this.props.title}</td>
                <td>{this.props.publish}</td>
                <td>{this.props.publish_date}</td>
                <td>
                    <Link href={route('content.edit', this.props.id)} className="button is-info">Edit</Link>
                </td>
                <td>
                    <Link href="#" className="button is-danger" onClick={this.showDeleteConfirmation}>Delete</Link>
                </td>
            </tr>
        );
    }
}

class Pagination extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <nav className="pagination" role="navigation" aria-label="pagination">
                    <ul className="pagination-list">
                        {this.props.links.length > 0 && this.props.links.map(({label, url, active}, index) =>
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
}

export default Index;
