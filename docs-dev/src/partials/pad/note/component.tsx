import React, { Children } from 'react';

import './style.scss';

const NotePad : React.FC<{children: React.ReactNode}> = ({ children }) => (
    <p className="note-pad">
        <strong className="title">Note:</strong>
        { ' ' }
        { Children.map( children, c => c ) }
    </p>      
);

NotePad.displayName = 'NotePad';

export default NotePad;

