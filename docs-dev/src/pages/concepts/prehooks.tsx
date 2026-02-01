import React from 'react';

import Anchor from '../../partials/anchor';
import Paragraph from '../../partials/paragraph';
import ListItem from '../../partials/list-item';

const RESET_STATE_SAMPLE =
`prehooks.resetState = (
    resetData: PartialState<State>, // resetData holds nextUpdate data.
    state: {
        current: State,
        original: State
    }
) => boolean;`;

const SET_STATE_SAMPLE =
`prehooks.setState = (
    newChanges: PartialState<State> // newChanges holds nextUpdate data.
) => boolean;`;

const ConceptPrehooksPage : React.FC<{className? : string}> = ({ className }) => (
    <article className={ `concept-prehooks-page ${ className }` }>
        <h1>Prehooks</h1>
        <div>
            <h3>What are Prehooks?</h3>
            <div>Prehooks are user functions which are invoked by the Eagle Eye context prior to executing context state operations.</div>
            <h3>Why Prehooks?</h3>
            <ListItem><div>Prehooks provide a central place for sanitizing, modifying, transforming, validating etc. all related incoming state updates. The context store obtains its prehooks via its context <Anchor to="/concepts/provider">Provider's</Anchor> <code>prehooks</code> optional prop.</div></ListItem>
            <ListItem><div>The context store <strong>2</strong> update operations each adhere to its own user-defined prehook when present. Otherwise, the update operation proceeds normally to completion. Thus, there are <strong>2</strong> prehooks named <strong>resetState</strong> and <strong>setState</strong> - after the store update methods they support.</div></ListItem>
            <ListItem><div>Each prehook returns a <strong>boolean</strong> value { '(' } <code>true</code> to continue AND <code>false</code> to abort the update operation{ ')' }. The prehook may modify { '(' }i.e. sanitize, transform, transpose{ ')' } the argument to accurately reflect the intended update value. This is done by mutating part of the argument which holds the next <code>nextUpdate</code> values.</div></ListItem>
            <h3>What do Prehooks look like?</h3>
            <ol>
                <li>
                    <Paragraph style={{ margin: '0 0 5px 10px' }}>
                        <b>resetState:</b> 
                        <pre style={{ margin: '10px 5px' }}>{ RESET_STATE_SAMPLE }</pre>
                    </Paragraph>
                </li>
                <li>
                    <Paragraph style={{ margin: '0 0 5px 10px' }}>
                        <b>setState:</b> 
                        <pre style={{ margin: '10px 5px' }}>{ SET_STATE_SAMPLE }</pre>
                    </Paragraph>
                </li>
            </ol>
            <h3>How are Prehooks wired up to the context store?</h3>
            <div>Please visit the <Anchor to="/concepts/provider">Provider</Anchor> concept page.</div>
        </div>
    </article>
);

export default ConceptPrehooksPage;