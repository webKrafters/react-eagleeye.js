import type { HeadFC } from 'gatsby';

import type { PageProps } from '../../../../../page-context';

import React from 'react';

import metadata from '../../../../../../gatsby-config/metadata';

import CodeBlock from '../../../../../partials/code-block';

const SAMPLE =
`import { CLEAR_TAG } from '@webkrafters/react-observable-context'; // CLEAR_TAG = "@@CLEAR"

const state = {
    a: { b: [{ x: 7, y: 8, z: 9 }, { x: 17, y: 18, z: 19 }] },
    j: 10
};

/* empties the state; sets state = {} */
store.setState( CLEAR_TAG ) // or store.setState({ [ CLEAR_TAG ]: <anything> })

/* empties the value at state.a.b; sets state.a.b = [] */
store.setState({ a: { b: CLEAR_TAG } }) // or store.setState({ a: { b: { [ CLEAR_TAG ]: <anything> } } })

/* empties the value at state.a.j; sets state.a.j = null */
store.setState({ a: { j: CLEAR_TAG } }) // or store.setState({ a: { j: { [ CLEAR_TAG ]: <anything> } } })

/* empties the value at state.a.b[ 0 ]; sets state.a.b = [{}] */
store.setState({ a: { b: [ CLEAR_TAG ] } }) // or store.setState({ a: { b: [ { [ CLEAR_TAG ]: <anything> } ] } })

/* empties the value at state.a.b[0]; sets state.a.b = [{}, state.a.b[1]] */
store.setState({ a: { b: [ CLEAR_TAG, state.a.b[1] ] } }) // or store.setState({ a: { b: [ { [ CLEAR_TAG ]: <anything> }, state.a.b[1] ] } })

/* empties the value at state.a.b[0]; sets state.a.b = [{}, a.b[1]] using indexing (RECOMMENDED) */
store.setState({ a: { b: { 0: CLEAR_TAG } } }) // or store.setState({ a: { b: { 0: { [ CLEAR_TAG ]: <anything> } } } })`;

const SAMPLE2 =
`store.setState({
    stateKey0: {
        '@@CLEAR': <any> // the value has no effect - removes \`state.stateKey0\` all the same.
    }
});`;

const ConceptStoreSetStateClearTagPage : React.FC<PageProps> = ({ className }) => (
    
    <article className={ `concept-store-setstate-clear-tag-usage-page ${ className }` }>
        <h1><code>store.setState</code> @@CLEAR Tag Usage</h1>
        <strong>Sample:</strong>
        { ' ' }
        <code>{ `store.setState({ stateKey0: '@@CLEAR' });` }</code>
        <p>{ ' ' } </p>
        <strong>Sample 2:</strong>
        <pre>{ SAMPLE2 }</pre>
        <h4>Example:</h4>
        <CodeBlock>{ SAMPLE }</CodeBlock>
    </article>
);

export default ConceptStoreSetStateClearTagPage;

export const Head : HeadFC = () => (
    <title>{ metadata.title }: @@CLEAR</title>
);