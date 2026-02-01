import type { HeadFC } from 'gatsby';

import type { PageProps } from '../../../../../page-context';

import React from 'react';

import metadata from '../../../../../../gatsby-config/metadata';

import CodeBlock from '../../../../../partials/code-block';

const SAMPLE =
`import { DELETE_TAG } from '@webkrafters/react-observable-context'; // DELETE_TAG = "@@DELETE"

const state = {
    a: { b: [{ x: 7, y: 8, z: 9 }, { x: 17, y: 18, z: 19 }] },
    j: 10
};

store.setState({ [ DELETE_TAG ]: [ 'a' ] }) // removes state.a; sets state = {j: 10}

store.setState({ a: { [ DELETE_TAG ]: [ 'b' ] } }) // removes state.a.b; sets state.a = {}

/* removes state.a.b[0]; leaving state.a.b = [{ x: 17, y: 18, z: 19 }] */
store.setState({ a: { b: { [ DELETE_TAG ]: [ 0 ] } } }) // or store.setState({ a: { b: { [ DELETE_TAG ]: [ -2 ] } } })

/* removes \`x\` and \`z\` properties from state.a.b[1]; sets state.a.b = [{ x: 7, y: 8, z: 9 }, {y: 18}] */
store.setState({ a: { b: [ state.a.b[ 0 ], { [ DELETE_TAG ]: [ 'x', 'z' ] } ] } })

/* removes \`x\` and \`z\` properties from state.a.b[1]; sets state.a.b = [{ x: 7, y: 8, z: 9 }, {y: 18}] using indexing (RECOMMENDED) */
store.setState({ a: { b: { 1: { [ DELETE_TAG ]: [ 'x', 'z' ] } } } })`;

const SAMPLE_CALL =
`store.setState({
    stateKey0: {
        // removes \`stateKey0.a\` and \`stateKey0.x\` from state
        '@@DELETE': [ 
            'a',
            'x'
        ]
    }
});`;

const ConceptStoreSetStateDeleteTagPage : React.FC<PageProps> = ({ className }) => (
    <article className={ `concept-store-setstate-delete-tag-usage-page ${ className }` }>
        <h1><code>store.setState</code> @@DELETE Tag Usage</h1>
        <strong>Sample:</strong>
        <pre>{ SAMPLE_CALL }</pre>
        <h4>Example:</h4>
        <CodeBlock>{ SAMPLE }</CodeBlock>
    </article>
);

export default ConceptStoreSetStateDeleteTagPage;

export const Head : HeadFC = () => (
    <title>{ metadata.title }: @@DELETE</title>
);
