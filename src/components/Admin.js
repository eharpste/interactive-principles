import React, { Component } from 'react';
import { verifyToken, getJsonFile, putJsonFile, CONTENT_BRANCH } from '../utils/github';
import CategoryEditRow from './admin/CategoryEditRow';
import PrincipleEditRow from './admin/PrincipleEditRow';

const TOKEN_STORAGE_KEY = 'ip-admin-github-token';

export default class Admin extends Component {

    constructor(props) {
        super(props);
        this.state = {
            token: '',
            rememberToken: true,
            authenticated: false,
            authenticating: false,
            authError: null,

            loading: false,
            loadError: null,

            categories: null,
            categoriesSha: null,
            principles: null,
            principlesSha: null,
            expandedPrincipleId: null,

            saving: false,
            saveError: null,
            saveSuccess: false
        };

        this.handleTokenChange = this.handleTokenChange.bind(this);
        this.handleTokenSubmit = this.handleTokenSubmit.bind(this);
        this.handleLogout = this.handleLogout.bind(this);
        this.handleSave = this.handleSave.bind(this);
        this.addCategory = this.addCategory.bind(this);
        this.updateCategory = this.updateCategory.bind(this);
        this.deleteCategory = this.deleteCategory.bind(this);
        this.addPrinciple = this.addPrinciple.bind(this);
        this.updatePrinciple = this.updatePrinciple.bind(this);
        this.deletePrinciple = this.deletePrinciple.bind(this);
        this.toggleExpanded = this.toggleExpanded.bind(this);
    }

    componentDidMount() {
        const stored = window.localStorage.getItem(TOKEN_STORAGE_KEY);
        if (stored) {
            this.setState({ token: stored }, () => this.handleTokenSubmit());
        }
    }

    handleTokenChange(event) {
        this.setState({ token: event.target.value });
    }

    async handleTokenSubmit(event) {
        if (event) event.preventDefault();
        const token = this.state.token.trim();
        if (!token) return;

        this.setState({ authenticating: true, authError: null });
        try {
            await verifyToken(token);
            if (this.state.rememberToken) {
                window.localStorage.setItem(TOKEN_STORAGE_KEY, token);
            }
            this.setState({ authenticated: true, authenticating: false });
            this.loadContent();
        } catch (err) {
            this.setState({ authenticating: false, authError: err.message, authenticated: false });
        }
    }

    handleLogout() {
        window.localStorage.removeItem(TOKEN_STORAGE_KEY);
        this.setState({
            token: '',
            authenticated: false,
            categories: null,
            principles: null,
            categoriesSha: null,
            principlesSha: null
        });
    }

    async loadContent() {
        this.setState({ loading: true, loadError: null });
        try {
            const [categoriesResult, principlesResult] = await Promise.all([
                getJsonFile(this.state.token, 'src/categories.json'),
                getJsonFile(this.state.token, 'src/principles.json')
            ]);
            this.setState({
                categories: categoriesResult.value,
                categoriesSha: categoriesResult.sha,
                principles: principlesResult.value,
                principlesSha: principlesResult.sha,
                loading: false
            });
        } catch (err) {
            this.setState({ loading: false, loadError: err.message });
        }
    }

    // ---- category CRUD ----

    nextCategoryId() {
        return this.state.categories.reduce((max, cat) => Math.max(max, cat.id), 0) + 1;
    }

    addCategory() {
        const id = this.nextCategoryId();
        this.setState({
            categories: [...this.state.categories, { id, name: 'New Category', color: '#888888' }],
            saveSuccess: false
        });
    }

    updateCategory(id, field, value) {
        this.setState({
            categories: this.state.categories.map(cat => cat.id === id ? { ...cat, [field]: value } : cat),
            saveSuccess: false
        });
    }

    deleteCategory(id) {
        const inUse = this.state.principles.filter(p => p.categoryId === id).length;
        if (inUse > 0) {
            window.alert(`Can't delete this category: ${inUse} principle card(s) still use it. Reassign those cards to a different category first.`);
            return;
        }
        this.setState({
            categories: this.state.categories.filter(cat => cat.id !== id),
            saveSuccess: false
        });
    }

    // ---- principle CRUD ----

    nextPrincipleId() {
        return this.state.principles.reduce((max, p) => Math.max(max, p.id), 0) + 1;
    }

    addPrinciple() {
        const id = this.nextPrincipleId();
        const defaultCategoryId = this.state.categories.length ? this.state.categories[0].id : null;
        const newPrinciple = {
            id,
            principle: 'New Principle',
            subtitle: '',
            categoryId: defaultCategoryId,
            related: '',
            questions: '',
            description: '',
            examples: '',
            exampleGame: '',
            exampleGameUrl: '',
            exampleGameDesc: '',
            cited: ''
        };
        this.setState({
            principles: [...this.state.principles, newPrinciple],
            expandedPrincipleId: id,
            saveSuccess: false
        });
    }

    updatePrinciple(id, field, value) {
        this.setState({
            principles: this.state.principles.map(p => p.id === id ? { ...p, [field]: value } : p),
            saveSuccess: false
        });
    }

    deletePrinciple(id) {
        if (!window.confirm('Delete this principle card? This cannot be undone once saved.')) return;
        this.setState({
            principles: this.state.principles.filter(p => p.id !== id),
            saveSuccess: false
        });
    }

    toggleExpanded(id) {
        this.setState({ expandedPrincipleId: this.state.expandedPrincipleId === id ? null : id });
    }

    // ---- save ----

    async handleSave() {
        this.setState({ saving: true, saveError: null, saveSuccess: false });
        try {
            const categoriesResult = await putJsonFile(
                this.state.token,
                'src/categories.json',
                this.state.categories,
                this.state.categoriesSha,
                'Update categories via admin page'
            );
            const principlesResult = await putJsonFile(
                this.state.token,
                'src/principles.json',
                this.state.principles,
                this.state.principlesSha,
                'Update principles via admin page'
            );
            this.setState({
                saving: false,
                saveSuccess: true,
                categoriesSha: categoriesResult.content.sha,
                principlesSha: principlesResult.content.sha
            });
        } catch (err) {
            this.setState({ saving: false, saveError: err.message });
        }
    }

    renderLogin() {
        return (
            <form className={'admin-login'} onSubmit={this.handleTokenSubmit}>
                <p>
                    Paste a GitHub personal access token to edit cards and categories from here.
                    The token is only stored in this browser and only sent to api.github.com.
                </p>
                <ol className={'admin-login__steps'}>
                    <li>
                        Go to <a href={'https://github.com/settings/personal-access-tokens/new'} target={'_blank'} rel={'noreferrer'}>
                            github.com/settings/personal-access-tokens/new <i className={'fas fa-external-link-square-alt'}/>
                        </a>
                    </li>
                    <li>Under <strong>Repository access</strong>, choose &quot;Only select repositories&quot; and pick <code>eharpste/interactive-principles</code>.</li>
                    <li>Click <strong>Repository permissions</strong> to expand it (it's collapsed by default).</li>
                    <li>Find <strong>Contents</strong> in the list and change it from &quot;No access&quot; to <strong>&quot;Read and write&quot;</strong>.</li>
                    <li>Scroll down and click <strong>Generate token</strong>, then paste it below.</li>
                </ol>
                <p>
                    (If that page is confusing, a <a href={'https://github.com/settings/tokens/new'} target={'_blank'} rel={'noreferrer'}>classic token</a> with
                    the <code>repo</code> scope checked also works, though it grants broader access than this one repo.)
                </p>
                <label className={'admin-field'}>
                    <span>GitHub token</span>
                    <input
                        type={'password'}
                        value={this.state.token}
                        onChange={this.handleTokenChange}
                        placeholder={'github_pat_...'}
                        autoComplete={'off'}
                    />
                </label>
                <label className={'admin-checkbox-field'}>
                    <input
                        type={'checkbox'}
                        checked={this.state.rememberToken}
                        onChange={(e) => this.setState({ rememberToken: e.target.checked })}
                    />
                    <span>Remember this token in this browser</span>
                </label>
                {this.state.authError &&
                    <p className={'admin-error'}>{this.state.authError}</p>
                }
                <button type={'submit'} className={'btn btn-link admin-btn-primary'} disabled={this.state.authenticating}>
                    {this.state.authenticating ? 'Checking…' : 'Connect'}
                </button>
            </form>
        );
    }

    renderEditor() {
        if (this.state.loading) {
            return <p>Loading content from {CONTENT_BRANCH}…</p>;
        }
        if (this.state.loadError) {
            return <p className={'admin-error'}>{this.state.loadError}</p>;
        }
        if (!this.state.categories || !this.state.principles) {
            return null;
        }

        return (
            <div>
                <div className={'admin-toolbar'}>
                    <span>Editing branch <code>{CONTENT_BRANCH}</code> — saving here triggers a live redeploy.</span>
                    <button type={'button'} className={'btn btn-link'} onClick={this.handleLogout}>Log out</button>
                </div>

                <section className={'admin-section'}>
                    <h2>Categories</h2>
                    {this.state.categories.map(cat => (
                        <CategoryEditRow
                            key={cat.id}
                            category={cat}
                            onChange={this.updateCategory}
                            onDelete={this.deleteCategory}
                        />
                    ))}
                    <button type={'button'} className={'btn btn-link'} onClick={this.addCategory}>
                        <i className={'fas fa-plus pull-left'}/> Add category
                    </button>
                </section>

                <section className={'admin-section'}>
                    <h2>Principle Cards ({this.state.principles.length})</h2>
                    {this.state.principles.map(p => (
                        <PrincipleEditRow
                            key={p.id}
                            principle={p}
                            categories={this.state.categories}
                            expanded={this.state.expandedPrincipleId === p.id}
                            onToggle={this.toggleExpanded}
                            onChange={this.updatePrinciple}
                            onDelete={this.deletePrinciple}
                        />
                    ))}
                    <button type={'button'} className={'btn btn-link'} onClick={this.addPrinciple}>
                        <i className={'fas fa-plus pull-left'}/> Add principle card
                    </button>
                </section>

                <div className={'admin-save-bar'}>
                    <button type={'button'} className={'btn btn-link admin-btn-primary'} onClick={this.handleSave} disabled={this.state.saving}>
                        {this.state.saving ? 'Saving…' : 'Save Changes'}
                    </button>
                    {this.state.saveError &&
                        <span className={'admin-error'}>{this.state.saveError}</span>
                    }
                    {this.state.saveSuccess &&
                        <span className={'admin-success'}>
                            Saved. The site will redeploy automatically in a minute or two.
                        </span>
                    }
                </div>
            </div>
        );
    }

    render() {
        return (
            <div className={'admin'}>
                <h1>Content Admin</h1>
                {this.state.authenticated ? this.renderEditor() : this.renderLogin()}
            </div>
        );
    }
}
