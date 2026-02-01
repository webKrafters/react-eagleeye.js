import type { Props } from '../anchor';

import React from 'react';

import BrowserStatus from './with-status/browser';
import ServerStatus from './with-status/server';

import Anchor from '../anchor';

import './style.scss';

const WithStatus = typeof window === 'undefined' ? ServerStatus : BrowserStatus;

let NavLink : React.FC<Props> = props => (
	<WithStatus { ...props }>
		<Anchor { ...props } />
	</WithStatus>
);

const createIndentedNavLink = ( indentClassNum : 1|2|3|4 ) : React.FC<Props> => ({ className, ...props }) => (
	<WithStatus { ...props }>
		<Anchor className={ `indent${ indentClassNum }${ className ? ` ${ className }` : '' }` } { ...props } />
	</WithStatus>
);

const NavLinkIndent1 = createIndentedNavLink( 1 );
const NavLinkIndent2 = createIndentedNavLink( 2 );
const NavLinkIndent3 = createIndentedNavLink( 3 );
const NavLinkIndent4 = createIndentedNavLink( 4 );


const Component : React.FC = () => (
	<nav className="site-nav">
		<NavLink to="/">Introduction</NavLink>
		<NavLink className="group-link" to="/getting-started">Getting Started</NavLink>
		<NavLinkIndent1 to="/getting-started#create-context-usage">Creating context</NavLinkIndent1>
		<NavLinkIndent1 to="/getting-started#provider-usage">Setting up the Provider</NavLinkIndent1>
		<NavLinkIndent1 to="/getting-started#connect-usage">Consuming context { '(' }hoc method{ ')' }</NavLinkIndent1>
		<NavLinkIndent1 to="/getting-started#usecontext-usage">Consuming context { '(' }hook with memo method{ ')' }</NavLinkIndent1>
		<NavLink to="/external-access">External Access</NavLink>
		<NavLink className="group-link" to="/api">API</NavLink>
		<NavLinkIndent1 to="/api#connect">Connect HoC</NavLinkIndent1>
		<NavLinkIndent1 to="/api#create-context">CreateContext Function</NavLinkIndent1>
		<NavLinkIndent1 to="/api#usage-error">UsageError Exception</NavLinkIndent1>
		<NavLinkIndent1 to="/api#usecontext">UseContext Hook</NavLinkIndent1>
		<NavLink className="group-link" to="/concepts/client">Concepts</NavLink>
		<NavLinkIndent1 to="/concepts/client">Client</NavLinkIndent1>
		<NavLinkIndent1 to="/concepts/prehooks">Prehooks</NavLinkIndent1>
		<NavLinkIndent1 className="group-link" to="/concepts/property-path">Property Path</NavLinkIndent1>
		<NavLinkIndent2 to="/concepts/property-path#fullstate-selectorkey"><b>@@STATE</b></NavLinkIndent2>
		<NavLinkIndent1 to="/concepts/provider">Provider</NavLinkIndent1>
		<NavLinkIndent1 to="/concepts/selector-map">Selector Map</NavLinkIndent1>
		<NavLinkIndent1 to="/concepts/storage">Storage</NavLinkIndent1>
		<NavLinkIndent1 className="group-link" to="/concepts/store">Store</NavLinkIndent1>
		<NavLinkIndent2 to="/concepts/store/resetstate">Reset State</NavLinkIndent2>
		<NavLinkIndent2 className="group-link" to="/concepts/store/setstate">Set State</NavLinkIndent2>
		<NavLinkIndent3 to="/concepts/store/setstate#batched-update">Batched Update</NavLinkIndent3>
		<NavLinkIndent3 to="/concepts/store/setstate#indexing">Array Indexing</NavLinkIndent3>
		<NavLinkIndent3 className="group-link" to="/concepts/store/setstate/tags">Using Tag Commands</NavLinkIndent3>
		<NavLinkIndent4 to="/concepts/store/setstate/tags/clear"><b>@@CLEAR</b> Usage Example</NavLinkIndent4>
		<NavLinkIndent4 to="/concepts/store/setstate/tags/delete"><b>@@DELETE</b> Usage Example</NavLinkIndent4>
		<NavLinkIndent4 to="/concepts/store/setstate/tags/move"><b>@@MOVE</b> Usage Example</NavLinkIndent4>
		<NavLinkIndent4 to="/concepts/store/setstate/tags/push"><b>@@PUSH</b> Usage Example</NavLinkIndent4>
		<NavLinkIndent4 to="/concepts/store/setstate/tags/replace"><b>@@REPLACE</b> Usage Example</NavLinkIndent4>
		<NavLinkIndent4 to="/concepts/store/setstate/tags/set"><b>@@SET</b> Usage Example</NavLinkIndent4>
		<NavLinkIndent4 to="/concepts/store/setstate/tags/splice"><b>@@SPLICE</b> Usage Example</NavLinkIndent4>
		<NavLinkIndent4 to="/concepts/store/setstate/tags/order-of-operations">Combination Usage Example</NavLinkIndent4>
		<NavLink className="group-link" to="/history/features">What's Changed?</NavLink>
	</nav>
);

Component.displayName = 'Site.Nav';

export default Component;
