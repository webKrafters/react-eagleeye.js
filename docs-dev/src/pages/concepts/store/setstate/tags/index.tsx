import { Props as AnchorProps } from '../../../../../partials/anchor';

import React from 'react';

import Anchor from '../../../../../partials/anchor';

import '../../../../../partials/contents/concepts.store.setstate.tags.page/style.scss';

const TagLink : React.FC<AnchorProps> = ({ className, ...props }) => (
    <Anchor{ ...props } className={ `tag-link${ className ? ` ${ className }` : '' }` } />
);
TagLink.displayName = 'ConceptStoreSetStateTagsPage.TagLink';

const ConceptStoreSetStateTagsPage : React.FC<{className? : string}> = ({ className }) => (
    <article className={ `concept-store-setstate-tags-page ${ className }` }>
        <h1><code>store.setState</code> Tags Commands</h1>
        <h3>About the set-state tag commands</h3>
        <p>By default, <code>store.setState</code> recursively merges new changes into current state.</p>
        <p>To overwrite current state slices with new values, <strong>7</strong> tag commands have been provided:</p>
        <ol>
            <li><TagLink to="/concepts/store/setstate/tags/clear">@@CLEAR:</TagLink> sets state slice to its corresponding empty value</li>
            <li><TagLink to="/concepts/store/setstate/tags/delete">@@DELETE:</TagLink> removes plain object properties and array items</li>
            <li><TagLink to="/concepts/store/setstate/tags/move">@@MOVE:</TagLink> moves array elements</li>
            <li><TagLink to="/concepts/store/setstate/tags/push">@@PUSH:</TagLink> pushes new items into an array</li>
            <li><TagLink to="/concepts/store/setstate/tags/replace">@@REPLACE:</TagLink> replaces property values</li>
            <li><TagLink to="/concepts/store/setstate/tags/set">@@SET:</TagLink> sets property values</li>
            <li><TagLink to="/concepts/store/setstate/tags/splice">@@SPLICE:</TagLink> splices array items</li>
        </ol>
    </article>
);

export default ConceptStoreSetStateTagsPage;