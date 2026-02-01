import type { HeadFC } from 'gatsby';

import type { PageProps } from '../../../../../page-context';

import React from 'react';

import metadata from '../../../../../../gatsby-config/metadata';

import Anchor from '../../../../../partials/anchor';
import CodeBlock from '../../../../../partials/code-block';
import Paragraph from '../../../../../partials/paragraph';

const SAMPLE =
`import { SET_TAG } from '@webkrafters/react-observable-context'; // SET_TAG = "@@SET"

const state = {
    a: { b: [{ x: 7, y: 8, z: 9 }, { x: 17, y: 18, z: 19 }] },
    j: 10
};

store.setState({ [ SET_TAG ]: currentValue => ({ ...currentValue, a: 'Demo', j: 17 }) }) // rewrites state to { ...state, a: 'Demo', j: 17 };

store.setState({ a: { [ SET_TAG ]: currentValue => ({ ...currentValue, message: 'Testing...' }) } }) // rewrites state.a to { ...state, message: 'Testing...' }

/* rewrites state.a.b[1] to { x: 97, y: 98, z: 99 }; leaving state.a.b = [{ x: 7, y: 8, z: 9 }, { x: 97, y: 98, z: 99 }] */
store.setState({ a: { b: [ state.a.b[ 0 ], { [ SET_TAG ]: currentValue => ({ ...currentValue, x: 97, y: 98, z: 99 }) } ] } })

/* rewrites state.a.b[1] to { x: 97, y: 98, z: 99 }; leaving state.a.b = [{ x: 7, y: 8, z: 9 }, { x: 97, y: 98, z: 99 }] using indexing (RECOMMENDED) */
store.setState({ a: { b: { 1: { [ SET_TAG ]: currentValue => ({ ...currentValue, x: 97, y: 98, z: 99 }) } } } });`

const SAMPLE_CALL1 =
`store.setState({
    stateKey0: {
        '@@SET': <any> // replaces \`state.stateKey0\` with value
    }
});`;

const SAMPLE_CALL2 =
`store.setState({
    stateKey0: {
        // replaces \`state.stateKey0\` with return value
        '@@SET': ( currentStateKey0: <any> ) => <any>
    }
});`;

const ConceptStoreSetStateSetTagPage : React.FC<PageProps> = ({ className }) => (
    <article className={ `concept-store-setstate-set-tag-usage-page ${ className }` }>
        <h1><code>{ `store.setState` }</code> @@SET Tag Usage</h1>
        <strong>Sample 1:</strong>
        <pre>{ SAMPLE_CALL1 }</pre>
        <strong>Sample 2:</strong>
        <br />
        <strong style={{ color: 'green' }}>
            Using Computed value
        </strong>
        <pre>{ SAMPLE_CALL2 }</pre>
        <Paragraph>This tag is for handling edge cases only.</Paragraph>
        <Paragraph>Please use sparingly. In most cases, store.setState with or without any of the other tags is sufficient and most efficient.</Paragraph>
        <Paragraph>This and the '<strong><Anchor to="/concepts/store/setstate/tags/replace">@@REPLACE</Anchor></strong>' tags are functionally equivalent when used with a replacement value argument.</Paragraph>
        <Paragraph>Be aware that the compute function argument may be <code>undefined</code> for properties which do not yet exist in the state.</Paragraph>
        <h4>Example:</h4>
        <CodeBlock>{ SAMPLE }</CodeBlock>
    </article>
);

export default ConceptStoreSetStateSetTagPage;

export const Head : HeadFC = () => (
    <title>{ metadata.title }: @@SET</title>
);
