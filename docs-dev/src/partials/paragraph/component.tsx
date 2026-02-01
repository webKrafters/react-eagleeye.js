import type { NamedExoticComponent } from 'react';

import React, { Children, forwardRef } from 'react';

import './style.scss';

export type Props = JSX.IntrinsicElements[ "div" ];

const Paragraph : NamedExoticComponent<Props> = forwardRef<
    HTMLDivElement, Props
>(({ children, className, ...props }, ref ) => (
    <div
        role="paragraph"
        { ...props }
        className={ `paragraph${ className ? ` ${ className }` : '' }` }
        ref={ ref }
    >
        { Children.map( children, c => c ) }
    </div>
));

Paragraph.displayName = 'Paragraph';

export default Paragraph;