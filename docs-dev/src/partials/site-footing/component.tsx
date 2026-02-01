import React, { useCallback, useContext, useRef } from 'react';

import { graphql, useStaticQuery } from 'gatsby';

import useCurrentYear from '../../hooks/current-year';

import Anchor from '../anchor';

import { ValueCtx } from '../dark-mode-settings/context';

import DarkModeSettings from '../dark-mode-settings';

import './style.scss';

const DarkModeLink : React.FC = () => {
    const isDarkMode = useContext( ValueCtx );
    const dkmRef = useRef<HTMLElement>( null );
    const tripDkmSwitch = useCallback<
        React.MouseEventHandler<HTMLAnchorElement>
    >( e => {
        e.preventDefault();
        dkmRef.current?.click();
    }, [] );
    return (
        <>
            <DarkModeSettings ref={ dkmRef } reverseIcon />
            { ' ' }
            <a onClick={ tripDkmSwitch }>
                <strong>{ isDarkMode ? 'Light' : 'Dark' }</strong>
                { ' ' }
                mode?
            </a>
        </>
    );              
};

const Component : React.FC = props => {
    const year = useCurrentYear();
    const { site: { siteMetadata: { url: {
        demo: demoUrl,
        npm: npmUrl,
        repo: repoUrl
    } } } } = useStaticQuery(
        graphql`
            query FooterVm {
                site {
                    siteMetadata {
                        url {
                            demo,
                            npm,
                            repo
                        }
                    }
                }
            }
        `
    );
    return (
        <footer className='site-footing'>
            <div className="affiliate-columns">
                <div>
                    <div>
                        <Anchor to="/getting-started">Getting Started</Anchor>
                    </div>
                    <div className="dkm-link">
                        <DarkModeLink />
                    </div>
                </div>
                <div>
                    <div><Anchor to={ demoUrl }>Demo</Anchor></div>
                </div>
                <div>
                    <div><Anchor to={ npmUrl }>NPM</Anchor></div>
                    <div><Anchor to={ repoUrl }>GitHub</Anchor></div>
                </div>
            </div>
            <div className="ip">
                <div>
                    &copy;2024{ year !== 2024 && `-${ year }` }
                    { ' ' }
                    <img
                        alt="wk Logo"
                        className="wk-logo"
                        src="/images/wk-logo.png"
                    />
                    { ' ' }
                    webKrafters, Incorporated.
                </div>
                <div>All rights reserved.</div>
            </div>
        </footer> 
    );
}

Component.displayName = 'Site.Footing';

export default Component;