import type { Props as LinkProps } from './types';

import React, { Children, useMemo, } from 'react';

import { Link as GatsbyLink } from 'gatsby';

import ExternalAnchor from './external';

export type Props = LinkProps;

const isExternalLink = ( path : string ) => /^(?:https?:)?\/\//.test( path );

const Component : React.FC<LinkProps> = ({ children, hideIcon, ...props }) => {
    const isExternal = useMemo(() => (
        props.target === '_blank' || isExternalLink( props.to )
    ), [ props.target, props.to ]);
    if( isExternal ) {
        return (
            <ExternalAnchor
                { ...props }
                hideIcon={ hideIcon }
            >
                { children }
            </ExternalAnchor> );
    }
    return (
        <GatsbyLink { ...props }>
            { Children.map( children, c => c ) }
        </GatsbyLink>
    );
}

Component.displayName = 'Anchor';

export default Component;

