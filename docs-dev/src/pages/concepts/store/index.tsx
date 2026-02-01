import React from 'react';

import Anchor from '../../../partials/anchor';

const ConceptStorePage : React.FC<{className? : string}> = ({ className }) => (
    <article className={ `concept-store-page ${ className }` }>
        <h1>Store</h1>
        <h3>What is the store?</h3>
        <p>An Eagle Eye context <code>store</code> is the client's portal into the context's underlying state.</p>
        <p>It exposes <strong>3</strong> properties namely:</p>
        <p>
            <strong id="data" style={{ marginRight: '0.5rem' }}>1.</strong><strong style={{ marginRight: '0.25rem' }}>data: </strong> 
            which is an object holding resolved state slices as declared in the selector map. <Anchor to="/concepts/selector-map#selector-map-example">See selector map to store data example here</Anchor>
        </p>
        <p>
            <strong style={{ marginRight: '0.5rem' }}>2.</strong><strong style={{ marginRight: '0.25rem' }}><Anchor to="/concepts/store/resetstate">resetState</Anchor>: </strong>
            <code>(propertyPaths?: Array&lt;string&gt;) =&gt; void // resets slices of state referenced by the property paths to their initial values.</code>
        </p>
        <p>
            <strong style={{ marginRight: '0.5rem' }}>3.</strong><strong style={{ marginRight: '0.25rem' }}><Anchor to="/concepts/store/setstate">setState</Anchor>: </strong>
            <code>(changes: Changes&lt;State&gt;) =&gt; void // merges only new/changed state slices.</code>
        </p>
    </article>
);

export default ConceptStorePage;