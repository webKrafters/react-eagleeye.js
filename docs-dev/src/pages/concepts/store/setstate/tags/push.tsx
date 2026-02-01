import type { HeadFC } from 'gatsby';

import type { PageProps } from '../../../../../page-context';

import React from 'react';

import metadata from '../../../../../../gatsby-config/metadata';

import CodeBlock from '../../../../../partials/code-block';

const SAMPLE =
`import { PUSH_TAG } from '@webkrafters/react-observable-context'; // PUSH_TAG = "@@PUSH"

const state = {
    a: { b: [{ x: 7, y: 8, z: 9 }, { x: 17, y: 18, z: 19 }] },
    j: 10
};

store.setState({ a: { [ PUSH_TAG ]: [{ n: 5 }] } }); // assigning a '@@PUSH' command to a non-array property has no effect.

/* appends 2 new items into state.a.b; leaving state.a.b = [...state.a.b, { x: 27, y: 28, z: 29 }, { x: 37, y: 38, z: 39 }] */
store.setState({ a: { b: { [ PUSH_TAG ]: [{ x: 27, y: 28, z: 29 }, { x: 37, y: 38, z: 39 }] } } });`

const SAMPLE_CALL =
`store.setState({
    stateKey0: { // where \`state.stateKey0\` is an array
        '@@PUSH': [ // performs array push on \`state.stateKey0\`.
            1,
            2,
            3,
        ]
    }
});`;

const ConceptStoreSetStatePushTagPage : React.FC<PageProps> = ({ className }) => (
    <article className={ `concept-store-setstate-puwh-tag-usage-page ${ className }` }>
        <h1><code>store.setState</code> @@PUSH Tag Usage</h1>
        <strong>Sample:</strong>
        <pre>{ SAMPLE_CALL }</pre>
        <h4>Example:</h4>
        <CodeBlock>{ SAMPLE }</CodeBlock>
    </article>
);

export default ConceptStoreSetStatePushTagPage;

export const Head : HeadFC = () => (
    <title>{ metadata.title }: @@PUSH</title>
);