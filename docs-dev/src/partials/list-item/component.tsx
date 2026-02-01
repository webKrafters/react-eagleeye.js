import React, { cloneElement, useMemo } from 'react';

import './style.scss';

const getClassName = ({ className } : {
    className? : string
}) => (
    `list-item${ className ? ` ${ className }` : '' }`
);

const ListItem : React.FC<{children : JSX.Element}> = ({ children }) => {
    const props = useMemo(() => ({
        className: getClassName( children.props ),
        role: children.props.role ?? 'listitem'
    }), [
        children.props.className,
        children.props.role
    ]);
    return cloneElement( children, props );
};

ListItem.displayName = 'ListItem';

export default ListItem;