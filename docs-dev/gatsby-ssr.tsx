import type { GatsbySSR, PageProps } from 'gatsby';

import React from 'react';

import metadata, { NO_SIDER_URI_PATTERN } from './gatsby-config/metadata';

import PageProvider from './src/page-context';

import DarkmodeProvider from './src/partials/dark-mode-settings/context';

import Layout from './src/partials/layouts/index/index';

export const onPreRenderHTML : GatsbySSR[ "onPreRenderHTML" ] = ({ getHeadComponents, replaceHeadComponents }) => {
    const headElements = getHeadComponents() as Array<React.ReactElement<any, string | React.JSXElementConstructor<any>>>;
    if( headElements.some( h => h.type === 'title' ) ) { return }
    headElements.push(
        <title
            data-gatsby-head="true"
            key="page-title"
        >
            { metadata.title }
        </title>
    );
    replaceHeadComponents( headElements );
};

export const onRenderBody : GatsbySSR["onRenderBody"] = ({
    setBodyAttributes, setHeadComponents
}) => {
    const { device: { themeColor } } = metadata;
    metadata.darkmode.defaultValue && 
    setBodyAttributes({ className: 'dark' });
    setHeadComponents([
        <link key="mask-icon" rel="mask-icon" href="/safari-pinned-tab.svg" color={ themeColor } />,
        <meta key="msapp-tile" name="msapplication-TileColor" content={ themeColor } />,
    ]);
};

export const wrapPageElement : GatsbySSR[ 'wrapPageElement' ] = ({ element, props }) => (
    <Layout { ...props }>{ element }</Layout>
);

export const wrapRootElement : GatsbySSR[ 'wrapRootElement' ] = ({ element, pathname }) => (
    <PageProvider initState={{
        location: { href: pathname } as PageProps[ 'location' ],
        isNoSiderPage: NO_SIDER_URI_PATTERN.test( pathname ?? '' )
    }}>
        <DarkmodeProvider>
            { element }
        </DarkmodeProvider>
    </PageProvider>
);
