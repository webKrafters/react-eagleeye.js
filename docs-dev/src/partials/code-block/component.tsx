import React from 'react';

import { CodeBlock, CopyBlock, railscast } from 'react-code-blocks';
import { CodeBlockProps } from 'react-code-blocks/dist/components/CodeBlock';
import { CopyBlockProps } from 'react-code-blocks/dist/components/CopyBlock';

import './style.scss';

export type Props<COPYABLE extends boolean = true> = Omit<
    COPYABLE extends false ? CodeBlockProps : CopyBlockProps,
    "codeBlock" | "language" | "text"
> & {
    children: string,
    isCopyable?: COPYABLE,
    isInline?: boolean,
    language?: (COPYABLE extends false ? CodeBlockProps : CopyBlockProps)["language"]
}

const Component : React.FC<Props<boolean>> = ({
    children,
    isCopyable = true,
    isInline = false,
    language = 'js',
    ...props
}) => {
    const Block = isCopyable ? CopyBlock : CodeBlock;
    return (
        <section className="code-block">
            <Block
                { ...props }
                codeBlock={ !isInline }
                language={ language }
                text={ children }
                theme={ railscast }
            />
        </section>
    );
};

Component.displayName = 'CodeBlock';

export default Component;