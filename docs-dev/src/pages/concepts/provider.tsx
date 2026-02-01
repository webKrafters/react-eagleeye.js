import React from 'react';

import Anchor from '../../partials/anchor';
import Paragraph from '../../partials/paragraph';

const ConceptProviderPage : React.FC<{className? : string}> = ({ className }) => (
    <article className={ `concept-provider-page ${ className }` }>
        <h1>Provider</h1>
        <div>
            <h3>What is the Provider?</h3>
            <div>
                <Paragraph>The Provider component is a property of the Eagle Eye context object. As a <code>React.Context</code> API based provider, it accepts the customary <code>children</code> and <code>value</code> props. It also accepts <strong>2</strong> optional props: <Anchor to="/concepts/prehooks"><code>prehooks</code></Anchor> and <Anchor to="/concepts/storage"><code>storage</code></Anchor>.</Paragraph>
                <Paragraph>External direct access to the context store may be obtained via the <code>ref</code> attribute. Please see a <Anchor to="/getting-started#provider-usage">Provider Usage</Anchor> sample.</Paragraph>
                <Paragraph>Routinely, the <code>value</code>  prop is initialized with the full initial state. It may only be updated with parts of the state which are changing. Please see a <Anchor to="/getting-started#provider-usage">Provider Usage</Anchor> sample.</Paragraph>
            </div>
        </div>
    </article>
);

export default ConceptProviderPage;