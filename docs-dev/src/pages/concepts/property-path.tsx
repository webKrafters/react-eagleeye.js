import React from 'react';

import Alert from '../../partials/alert';
import Anchor from '../../partials/anchor';
import CodeBlock from '../../partials/code-block';
import Paragraph from '../../partials/paragraph';

const ConceptPropertyPathPage : React.FC<{className? : string}> = ({ className }) => (
    <article className={ `concept-property-path-page ${ className }` }>
        <h1>Property Path</h1>
        <div>
            <h3>What is a Property Path?</h3>
            <div>
                <Paragraph>A property path is a dot-notation string leading to a specific property within an object.</Paragraph>
                <Paragraph>The Eagle Eye context recognizes any property path abiding by the <strong><i><u>Lodash</u></i></strong> property path specifications. Such property paths may also contain negative integers.</Paragraph>
                <Paragraph><strong>Negative</strong> integer { '(' }<i>-N</i>{ ')' } in a property path indicates an array index derived at runtime by counting <code>abs(-N)</code> steps backward from array length.</Paragraph>
                <h3 id="property-path-example">Ex. Given the following object:</h3>
                <CodeBlock>{ '{ a: { c: { e: 5, f: [ 0, 2, 4 ] } } }' }</CodeBlock>
                <Paragraph>The property path <code>a.c.e</code> accesses the <code>e=5</code> property.</Paragraph>
                <Paragraph>Either of the property paths <code>a.c.f.1</code>, <code>a.c.f.-2</code>, <code>a.c.f[1]</code> and <code>a.c.f[-2]</code> is a valid property path to access the <code>[1]=2</code> property.</Paragraph>
                <Paragraph>A special property path <Anchor to="/concepts/property-path#fullstate-selectorkey">@@STATE</Anchor> may be used to access the full given object.</Paragraph>
            </div>
            <h3 id="fullstate-selectorkey">What is the @@STATE keyword?</h3>
            <div>
                <strong>@@STATE</strong> is a special property path to access the full state object as a single slice.<br />
                <Alert title={ <i><strong>Caution:</strong></i> }>
                    When this property path exists in a <Anchor to="/concepts/selector-map">selector map</Anchor>, any change in the state object results in an update of its <Anchor to="/concepts/store"><code>store.data</code></Anchor> and a subsequent render of its client{ '(' }s{ ')' }.
                </Alert>
            </div>
        </div>
    </article>
);

export default ConceptPropertyPathPage;