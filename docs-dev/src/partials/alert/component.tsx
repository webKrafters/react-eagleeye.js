import type { FC, NamedExoticComponent, ReactNode, HTMLProps } from 'react';

import React, { Children, memo } from 'react';

import WarningIcon from '../icons/warning';

import './style.scss';

export interface Props extends Omit<HTMLProps<HTMLDivElement>, "title"> { title? : ReactNode };

const Header : NamedExoticComponent<{children : Props["title"]}> = memo(({ children }) => !!Children.count( children ) && (
    <>
        <WarningIcon />
        { ' ' }
        { typeof children === 'string'
            ? ( <strong>{ children }</strong> )
            : children
        }
    </>
));
Header.displayName = 'Alert.Header';

const Alert : FC<Props> = ({ title, children, className = '', ...props }) => (
    <section
        { ...props }
        className={ `alert${ className.length ? ` ${ className }` : '' }` }
    >
        <Header>{ title }</Header>
        <div className="content">
            { Children.map( children, c => c ) }
        </div>
    </section>
);

export default Alert;
