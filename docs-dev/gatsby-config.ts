import type { GatsbyConfig } from 'gatsby';

import siteMetadata from './gatsby-config/metadata';

const config: GatsbyConfig = {
  // More easily incorporate content into your pages through automatic
  // TypeScript type generation and better GraphQL IntelliSense.
  // If you use VSCode you can also use the GraphQL plugin.
  // Learn more at: https://gatsby.dev/graphql-typegen
  graphqlTypegen: true,
  plugins: [
    'gatsby-plugin-sass',
    'gatsby-plugin-image',
    'gatsby-plugin-antd',
    'gatsby-plugin-sitemap',
    {
      options: {
        background_color: siteMetadata.device.backgroundColor,
        description: siteMetadata.description,
        display: 'standalone',
        icon: "src/icon.png", // This path is relative to the root of the site.
        // An optional attribute which provides support for CORS check.
        // If you do not provide a crossOrigin option, it will skip CORS for manifest.
        // Any invalid keyword or empty string defaults to `anonymous`
        lang: siteMetadata.language,
        // localize: [{
        //   start_url: `/de/`,
        //   lang: `de`,
        //   name: `Die coole Anwendung`,
        //   short_name: `Coole Anwendung`,
        //   description: `Die Anwendung macht coole Dinge und macht Ihr Leben besser.`,
        // }],
        name: siteMetadata.title,
        short_name: siteMetadata.title.replace( /\s+/g, '' ),
        start_url: '/',
        theme_color: siteMetadata.device.themeColor,
        // Enables "Add to Homescreen" prompt and disables browser UI (including back button)
        // see https://developers.google.com/web/fundamentals/web-app-manifest/#display
        crossOrigin: `use-credentials`
      },
      resolve: 'gatsby-plugin-manifest'
    },
    {
      resolve: `gatsby-plugin-sharp`,
      options: {
        defaults: {
          placeholder: 'blurred'
        }
      }
    },
    'gatsby-transformer-sharp',
    {
      __key: "images",
      options: {
        name: 'images',
        path: `${ __dirname }/src/images/`
      },
      resolve: 'gatsby-source-filesystem'
    },
    'gatsby-plugin-offline'
  ],
  siteMetadata
};

export default config;
