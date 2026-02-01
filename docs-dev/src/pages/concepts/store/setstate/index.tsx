import React from 'react';

import Alert from '../../../../partials/alert';
import Anchor from '../../../../partials/anchor';
import CodeBlock from '../../../../partials/code-block';
import NotePad from '../../../../partials/pad/note';
import WarningIcon from '../../../../partials/icons/warning';

const PROPER_BATCH_CALL =
`setState([
    { stateKey0: changes0 },
    { stateKey1: changes1 },
    // et cetera ... et cetera
]);`;

const IMPROPER_BATCH_CALL =
`setState([
    { ...state, stateKey0: { ...state.stateKey0, ...changes0 } },
    { ...state, stateKey1: { ...state.stateKey1, ...changes1 } },
    // et cetera ... et cetera
]);`;

const INVOCATION =
`// Given the following array bearing state object:
const state = { a: { b: [ { x: 7, y: 8, z: 9 } ] }, j: 10 };

// The following will override the existing array.
store.setState({ a: { b: [ { y: 30 }, 22 ] } });
// updates the state to: { a: { b: [ { y: 30 }, 22 ] }, j: 10 };

// The followinng will update the existing array at indexes.
store.setState({ a: { b: { 0: { y: 30 }, 1: 22 } } });
// updates the state to: { a: { b: [ { x: 7, y: 30, z: 9 }, 22 ] }, j: 10 };

// The followinng will update the existing array at indexes.
store.setState({ a: { b: { '-1': { y: 30 }, 1: 22 } } });
// updates the state to: { a: { b: [ { x: 7, y: 30, z: 9 }, 22 ] }, j: 10 };

// The previous 2 statements are functionally equivalent to the following:
const [ first, second, ...rest ] = state.a.b;
store.setState({ ...state, a: { ...state.a, b: [ { ...first, y: 30 }, 22, ...rest ] } });
// Refrain from doing this, please!`;

const IMPROPER_CALL =
`setState({
    ...state,
    stateKey0: {
        ...state.stateKey0,
        ...changes0
    }
});`;

const ConceptStoreSetStatePage : React.FC<{className? : string}> = ({ className }) => (
    <article className={ `concept-store-setstate-page ${ className }` }>
        <h1><code>store.setState</code> Usage</h1>
        <p>
            <strong>Signature:</strong>
            <pre>{ `(changes: Changes<State>) => void;` }</pre>
        </p>
        <h3>About the store setState method</h3>
        <blockquote style={{ margin: '1em 40px' }}>
            [This store's] internal state is <strong><u>immutable</u></strong> and <strong><u>private</u></strong>.<br />
            Direct mutation attempts on its properties have no effect.
        </blockquote>
        <p>New updates are merged into state by default.</p>
        <p>So only supply the exact changes to be merged <strong><i>{ '(' }i.e. do not spread the new state changes into the current state as is commonly done in React development{ ')' }</i></strong>.</p> 
        <p>And to overwrite a slice of state, use the <Anchor to="/concepts/store/setstate/tags">tag</Anchor> command.</p>
        <WarningIcon /> <strong><i>Do this:</i></strong>
        <pre>{ `setState({ stateKey0: changes0 });` }</pre>
        <WarningIcon /> <strong><i>Not this:</i></strong>
        <pre>{ IMPROPER_CALL }</pre>
        <h3 id="batched-update">Batched Update</h3>
        <p>provides a way to update the state as a transaction of several state changes.</p>
        <p>This can be achieved by collecting a series of state changes in an array and passing that array as an argument to the <code>store.setState</code> method.</p>
        <p>The state changes are resolved sequentially from <code>index 0</code> to the <code>last index</code>.</p>
        <p><Anchor to="/concepts/client">Clients</Anchor> are only notified at batched update completion.</p>
        <WarningIcon /> <strong><i>Do this:</i></strong> 
        <pre>{ PROPER_BATCH_CALL }</pre>
        <WarningIcon /> <strong><i>Not this:</i></strong> 
        <pre>{ IMPROPER_BATCH_CALL }</pre>
        <h3 id="indexing">Indexing</h3>
        <p>Traditionally, array state properties are updated by a new array replacement. This overwrites the existing state property.</p>
        <p>Hence the need for <code>indexing</code>. Indexing provides a mechanism for updating array state properties at specific indexes using an indexed state change object.</p>
        <NotePad>The store also recognizes and resolves negative indexes when present in the indexed state change object. See additional <Anchor to="/concepts/store/setstate#neg-idx-tip">tip</Anchor> below.</NotePad>
        <strong>Example:</strong>
        <CodeBlock>{ INVOCATION }</CodeBlock>
        <Alert id="neg-idx-tip" title={ <i><strong>Tip:</strong></i> }>
            Negative indexing pointing at an out-of-bounds index is ignored.
        </Alert>
        <h3 id="setstate-tags">Overwriting state using the tag commands</h3>
        <div>Please see full info on tag commands <Anchor to="/concepts/store/setstate/tags">here</Anchor>.</div>
    </article>
);

export default ConceptStoreSetStatePage;