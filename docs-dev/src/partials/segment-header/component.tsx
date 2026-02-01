import React from 'react';

import './style.scss';

export interface Props {
    children : React.ReactNode,
    id? : string
};

const Header : React.FC<Props> = ({ children, ...props }) => (
    <header { ...props } className="segment-header">
        { children }
    </header>
);

Header.displayName = 'SegmentHeader';

export default Header;