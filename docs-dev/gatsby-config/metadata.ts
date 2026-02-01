import pkgJson from '../package.json';

export const NO_SIDER_URI_PATTERN = /^$/; // /^(?:\/(?:quick-start\/?)?(?:\?.*)?)?$/;

export default {
    _24Hours: 8.64e7,
    contact: pkgJson.author.email,
    copyright: 'This website is a copyright of webKrafters Inc. 2024-Present',
    darkmode: {
        defaultValue: true,
        key: 'DKM-E'
    },
    description: pkgJson.description,
    device: {
        backgroundColor: '#22222f',
        maxWidth: {
            handheldPortait: 991
        },
        themeColor: '#da4'
    },
    language: 'en',
    siteUrl: 'https://eagleeye.js.org',
    title: pkgJson.name
        .replace( /-dev$/i, '-jS' )
        .split( /-+/ )
        .map(( t : string ) => `${ t[ 0 ].toUpperCase() }${ t.substring( 1 ) }` )
        .join( ' ' ),
    url: {
        demo: 'https://codesandbox.io/s/github/webKrafters/react-observable-context-app',
        npm: 'https://www.npmjs.com/package/@webkrafters/react-observable-context',
        repo: "https://github.com/webKrafters/eagleeye.js.git",
        site: pkgJson.homepage
    }
};