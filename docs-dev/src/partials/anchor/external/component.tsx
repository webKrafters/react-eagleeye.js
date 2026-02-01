import type { Props } from '../types';

import React, { Children, isValidElement, useMemo } from 'react';

import ExportOutlinedIcon from '@ant-design/icons/ExportOutlined';

import './style.scss';

const Component : React.FC<Props> = ({ children, className, hideIcon = false, ...props }) => {
    const [ noIcon, nodes ] = useMemo(() => {
        if( !hideIcon && Children.count( children ) === 1 ) {
            let isImage;
            const nodes = Children.map( children, c => {
                isImage = isValidElement( c ) && c.type === 'img';
                return c;
            } );
            return [ isImage, nodes ];
        }
        return [ hideIcon, Children.map( children, c => c ) ];
    }, [ children ]);
    return (
        <a
            className={ `anchor-external${ className ? ` ${ className }` : '' }` }
            { ...props }
            href={ props.to }
            rel="noopener noreferrer"
            target="_blank"
        >
            { nodes as React.ReactNode }
            { !noIcon && ( <ExportOutlinedIcon size={ 4 } /> ) }
        </a>
    );
};

Component.displayName = 'Anchor.External';

export default Component;
