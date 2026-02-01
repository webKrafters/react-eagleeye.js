import React from 'react';

import Anchor from '../partials/anchor';
import ListItem from '../partials/list-item';

const ApiPage : React.FC<{className? : string}> = ({ className }) => (
    <article className={ `api-page ${ className }` }>
        <h1>API</h1>
        <div id="connect">
            <h3>connect</h3>
            <ListItem><div>is a function taking an Eagle Eye context object and an optional <Anchor to="/concepts/selector-map">selector map</Anchor> parameters; and returning a reusable connector function.</div></ListItem>
            <ListItem><div>The connector function takes a client as a parameter and returns an HOC.</div></ListItem>
            <ListItem><div>Any client using similar context object and selector map may be passed to this connector.</div></ListItem>
            <ListItem><div>The HOC injects the context <Anchor to="/concepts/store">store</Anchor> to the client and handles all of the context usage requirements.</div></ListItem>
            <ListItem><div>The injected <Anchor to="/concepts/store">store</Anchor> monitors changes in the underlying state slices referenced by the selector map.</div></ListItem>
            <ListItem><div>A change in any of the referenced state slices automatically triggers an update of the related <code>store.data</code> property and a subsequent render of the client.</div></ListItem>
            <ListItem><div>Any prop name conflicts between the injected <Anchor to="/concepts/store">store properties</Anchor> and the client's own props are resolved in favor of the client's own props. Such a scenario may be remedied by renaming the conflicting key within the <Anchor to="/concepts/selector-map">selector map</Anchor>.</div></ListItem>
        </div>
        <div id="create-context">
            <h3>createContext</h3>
            <ListItem><div>is a zero-parameter function returning an Eagle Eye context object.</div></ListItem>
            <ListItem><div>The returned object is the store-bearing context.</div></ListItem>
            <ListItem><div>To access the context's <Anchor to="/concepts/store">store</Anchor>, pass the context as a <code>context</code> parameter to either the <Anchor to="/api#connect">connect</Anchor> function or the <Anchor to="/api#usecontext">useContext</Anchor> hook.</div></ListItem>
        </div>
        <div id="usage-error">
            <h3>UsageError</h3>
            <ListItem><div>is the Error type reported for attempts to access this context's store outside of its Provider component tree.</div></ListItem>
        </div>
        <div id="usecontext">
            <h3>useContext</h3>
            <ListItem><div>is a hook taking an Eagle Eye context object and an optional <Anchor to="/concepts/selector-map">selector map</Anchor> parameters; and returning the context <Anchor to="/concepts/store">store</Anchor>.</div></ListItem>
            <ListItem><div>The injected <Anchor to="/concepts/store">store</Anchor> monitors changes in the underlying state slices referenced by the selector map.</div></ListItem>
            <ListItem><div>A change in any of the referenced state slices automatically triggers an update of the related <code>store.data</code> property and a subsequent render of the client.</div></ListItem>
            <ListItem><div>The <Anchor to="/api#connect">connect</Anchor> function is axiomatically the more conducive method for consuming this conetxt.</div></ListItem>
            <ListItem><div>In certain user-specific cases, direct access to this hook may be preferrable.</div></ListItem>
            <ListItem><div>In such cases, it is advisable to wrap the client in a <code>React.memo()</code>.</div></ListItem>
        </div>
    </article>
);

export default ApiPage;