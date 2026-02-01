import React from 'react';

import Anchor from '../anchor';

import './style.scss';

const Component : React.FC = () => (
    <nav className="site-faqs">
        <Anchor to="/getting-started#install">Installation</Anchor>
        <Anchor to="/external-access">Can I observe this state externally?</Anchor>
        <Anchor to="/concepts/store/setstate">Is true that the state can never be mutated?</Anchor>
		<Anchor to="/getting-started#provider-usage">Making reactive component trees.</Anchor>
        <Anchor to="/external-access#external-apis">How to observe state externally.</Anchor>
        <Anchor to="/concepts/property-path#fullstate-selectorkey">About the <strong><code>@@STATE</code></strong> keyword.</Anchor>
        <Anchor to="/concepts/store/setstate#indexing">Can I use negative array indexing?</Anchor>
		<Anchor to="/getting-started#connect-usage">How to read state with <strong>hoc</strong>.</Anchor>
        <Anchor to="/getting-started#usecontext-usage">How to read state with <strong>hook</strong>.</Anchor>
        <Anchor to="/concepts/store/setstate">How to set state.</Anchor>
		<Anchor to="/concepts/store/setstate">Why not use the spread operator for incoming state?</Anchor>
		<Anchor to="/concepts/store/setstate#indexing">How do I update my array exactly at a specific index?</Anchor>
        <Anchor to="/concepts/store/setstate/tags">What is the use of <strong>setstate @@ tags</strong>?</Anchor>
        <Anchor to="/concepts/store/setstate#batched-update">How to set multiple states sequentially.</Anchor>
    </nav>
);

export default Component;