import type { HeadFC } from 'gatsby';

import type { PageProps } from '../../../../../page-context';

import React from 'react';

import metadata from '../../../../../../gatsby-config/metadata';

import CodeBlock from '../../../../../partials/code-block';

const SAMPLE =
`import { SPLICE_TAG } from '@webkrafters/react-observable-context'; // SPLICE_TAG = "@@SPLICE"

const state = {
    a: { b: [{ x: 7, y: 8, z: 9 }, { x: 17, y: 18, z: 19 }] },
    j: 10,
    q: [ 1, 2, 3, 4, 5, 6, 7, 8, 9 ]
};

store.setState({ a: { [ SPLICE_TAG ]: [ 0, 1 ] } }); // assigning a '@@SPLICE' command to a non-array property has no effect.

/* removes state.a.b[0]; leaving state.a.b = [{ x: 17, y: 18, z: 19 }] */
store.setState({ a: { b: { [ SPLICE_TAG ]: [ 0, 1 ] } } }) // or store.setState({ a: { b: { [ SPLICE_TAG ]: [ -2, -1 ] } } });

/* replaces state.q[4] - [7] with 2 items; leaving state.q = [ 1, 2, 3, 4, 33, 88, 9 ] */
store.setState({ a: { q: { [ SPLICE_TAG ]: [ 4, 4, 33, 88 ] } } }) // or store.setState({ a: { q: { [ SPLICE_TAG ]: [ -5, 4, 33, 88 ] } } });`

const SAMPLE_CALL =
`store.setState({
    stateKey0: { // where \`state.stateKey0\` is an array
        '@@SPLICE': [ // performs array splice on \`state.stateKey0\`.
            -/+fromIndex,
            deleteCount, // integer >= 0
            ...newInserts?
        ]
    }
});`;

const ConceptStoreSetStateSpliceTagPage : React.FC<PageProps> = ({ className }) => (
    <article className={ `concept-store-setstate-splice-tag-usage-page ${ className }` }>
        <h1><code>store.setState</code> @@SPLICE Tag Usage</h1>
        <strong>Sample:</strong>
        <pre>{ SAMPLE_CALL }</pre>
        <h4>Example:</h4>
        <CodeBlock>{ SAMPLE }</CodeBlock>
    </article>
);

export default ConceptStoreSetStateSpliceTagPage;

export const Head : HeadFC = () => (
    <title>{ metadata.title }: @@SPLICE</title>
);
