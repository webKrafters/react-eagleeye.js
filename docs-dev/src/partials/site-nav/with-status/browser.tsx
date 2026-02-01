import type { Props } from '../../anchor';

import React, { useContext, useEffect, useMemo, useState } from 'react';

import { ValueCtx as PageCtxValue } from '../../../page-context';

const WithStatus : React.FC<Props> = typeof window === 'undefined'
    ? () => ( <div className="error-link">Invalid browser nav link.</div> )
    : ({ children, to: toProp }) => {
        const { location } = useContext( PageCtxValue );
        const [ active, setActive ] = useState( false );
        const to = useMemo(() => {
            const { hash, pathname } = new URL( window.location.origin + toProp );
            return `${ pathname }${ toProp === '/' ? '' : '/' }${ hash.length ? hash : '' }`; 
        }, [ toProp ]);
        useEffect(() => setActive(
            location?.href.slice( location.origin.length ) === to
        ), [ location ]);
        return (
            <div { ...active ? { className: 'active' } : {} }>
                { children }
            </div>
        );
    };

WithStatus.displayName = 'Site.Nav.WithStatus.Browser';

export default WithStatus;