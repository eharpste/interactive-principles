import React, { Component, useEffect } from 'react';
import Principles from './Principles';
import logo from '../images/ixp_logo.svg';
import menuicon from '../images/menuicon.svg';
import { HashRouter as Router, Route, Link, useLocation } from 'react-router-dom';
import About from './About';
import Admin from './Admin';
import Sidebar from 'react-sidebar';
import principles from '../principles.json';
import { initAnalytics, trackPageview, trackEvent, cardLabel } from '../utils/analytics';

function pageTitle(path) {
    const cardMatch = path.match(/^\/card\/([^/]+)$/);
    if (cardMatch) {
        return cardLabel(principles.find(p => String(p.id) === cardMatch[1]));
    }
    if (path === '/') {
        return 'All Principles';
    }
    if (path === '/about') {
        return 'About';
    }
    return '';
}

// Counts a pageview for every route change (the admin editor is not counted).
function RouteTracker() {
    const { pathname } = useLocation();
    useEffect(() => {
        if (pathname !== '/admin') {
            trackPageview(pathname, pageTitle(pathname));
        }
    }, [pathname]);
    return null;
}

export default class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            sidebarOpen: false
        };
        this.onSetSidebarOpen = this.onSetSidebarOpen.bind(this);
    }

    componentDidMount() {
        initAnalytics();
    }

    onSetSidebarOpen(open) {
        this.setState({ sidebarOpen: open });
    }

    render() {
        return(
            <div>
                <Router>
                    <div className={'title-box'}>
                        <Link className={'main-logo'} to={'/'}>
                            <h1 className={'main-title'}>
                                <img src={logo} className={'img img-responsive'}/>
                            </h1>
                        </Link>
                        <h2 className={'main-subtitle'}>
                            a deck of learning science principles for designing educational games
                        </h2>
                    </div>

                    <Sidebar
                        sidebar={
                            <div>
                                <Link to={'/'} className={'link sidebar__link'} onClick={() => this.onSetSidebarOpen(false)}>All Principles</Link>
                                <Link to={'/about'} className={'link sidebar__link'} onClick={() => this.onSetSidebarOpen(false)}>About This Project</Link>
                                <a href={'https://ohlabcmu.wordpress.com/'}
                                    className={'link sidebar__link'}
                                    target={'_blank'}
                                    rel={'noopener noreferrer'}
                                    onClick={() => {
                                        trackEvent('outbound/ohlab');
                                        this.onSetSidebarOpen(false);
                                    }}>
                                    The OHLab at Carnegie Mellon
                                    <i className='fas fa-external-link-alt'/>
                                </a>
                                <a href={'https://learnlab.org/'}
                                    className={'link sidebar__link'}
                                    target={'_blank'}
                                    rel={'noopener noreferrer'}
                                    onClick={() => {
                                        trackEvent('outbound/learnlab');
                                        this.onSetSidebarOpen(false);
                                    }}>
                                    The LearnLab at Carnegie Mellon
                                    <i className='fas fa-external-link-alt'/>
                                </a>
                            </div>
                        }
                        rootClassName={'navigation'}
                        open={this.state.sidebarOpen}
                        onSetOpen={this.onSetSidebarOpen}
                        sidebarClassName={'sidebar'}
                        overlayClassName={'sidebar-overlay'}
                        pullRight={true}
                    >
                        <button id={'sidebar-button'} className={'btn btn-link'} onClick={() => this.onSetSidebarOpen(!this.state.sidebarOpen)}>
                            <img src={menuicon}/>
                            Menu
                        </button>
                    </Sidebar>

                    <RouteTracker/>

                    {/* One Route for both paths so Principles stays mounted (and keeps
                        its shuffle/filter state) while cards open and close. */}
                    <Route exact path={['/', '/card/:id']} component={Principles}/>
                    <Route exact path={'/about'} component={About}/>
                    <Route exact path={'/admin'} component={Admin}/>
                </Router>
            </div>
        );
    }
}