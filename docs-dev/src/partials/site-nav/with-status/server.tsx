import type { Props } from '../../anchor';

import React, { useContext, useMemo } from 'react';

import { ValueCtx as PageCtxValue } from '../../../page-context';

const WithStatus : React.FC<Props> = typeof window !== 'undefined'
    ? () => ( <div className="error-link">Invalid server nav link.</div> )
    : ({ children, to }) => {
        const { location: { href = '' } = {} } = useContext( PageCtxValue );
        const routePattern = useMemo(() => new RegExp( to + '\/?$' ), [ to ]);
        const active = useMemo(() => routePattern.test( href ), [ href, routePattern ]);
        return (
            <div { ...( active ? { className: 'active' } : {} ) }>
                { children }
            </div>
        );
    };

WithStatus.displayName = 'Site.Nav.WithStatus.Server';

export default WithStatus;