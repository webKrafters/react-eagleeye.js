import React from 'react';

import Anchor from '../../../partials/anchor';

import ListItem from '../../../partials/list-item';

const ConceptStoreResetStatePage : React.FC<{className? : string}> = ({ className }) => (
    <article className={ `concept-store-resetstate-page ${ className }` }>
        <h1><code>store.resetState</code> Usage</h1>
        <p>
            <strong>Signature:</strong>
            <pre>{ `(propertyPaths?: Array<string>) => void;` }</pre>
        </p>
        <h3>What does the store resetState method do?</h3>
        <ListItem><p>Resets slices of state to their initial state values as desired.</p></ListItem>
        <ListItem><p>Accepts an array of property paths referencing the desired slices of state to reset.</p></ListItem>
        <ListItem><p>Performs a total state reset when <Anchor to="/concepts/property-path#fullstate-selectorkey"><code>@@STATE</code></Anchor> is present in the property paths array.</p></ListItem>
        <ListItem><p>Resets state slices referenced by the calling client's <Anchor to="/concepts/selector-map">selector map</Anchor> when invoked with 0 arguments.</p></ListItem>
        <ListItem><p>Performs a total state reset when invoked with 0 arguments and <Anchor to="/concepts/property-path#fullstate-selectorkey"><code>@@STATE</code></Anchor> is present in the calling client's <Anchor to="/concepts/selector-map">selector map</Anchor>.</p></ListItem>
        <ListItem><p>Performs no state reset when a client with no <Anchor to="/concepts/selector-map">selector map</Anchor> invokes this method with 0 arguments.</p></ListItem>
    </article>
);

export default ConceptStoreResetStatePage;