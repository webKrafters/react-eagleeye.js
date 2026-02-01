<p align="center">
	<img alt="Eagle Eye" height="150px" src="logo.png" width="250px" />
</p>
<p align="center">
	<a href="https://typescriptlang.org">
		<img alt="TypeScript" src="https://badgen.net/badge/icon/typescript?icon=typescript&label">
	</a>
	<a href="https://github.com/webKrafters/eagleeye.js/actions">
		<img alt="GitHub Workflow Status" src="https://img.shields.io/github/actions/workflow/status/webKrafters/eagleeye.js/test.yml">
	</a>
	<a href="https://coveralls.io/github/webKrafters/eagleeye.js">
		<img alt="coverage" src="https://img.shields.io/coveralls/github/webKrafters/eagleeye.js">
	</a>
	<img alt="NPM" src="https://img.shields.io/npm/l/@webkrafters/react-observable-context">
	<img alt="Maintenance" src="https://img.shields.io/maintenance/yes/2032">
	<img alt="build size" src="https://img.shields.io/bundlephobia/minzip/@webkrafters/react-observable-context?label=bundle%20size">
	<a href="https://www.npmjs.com/package/@webKrafters/react-observable-context">
		<img alt="Downloads" src="https://img.shields.io/npm/dt/@webkrafters/react-observable-context.svg">
	</a>
	<img alt="GitHub package.json version" src="https://img.shields.io/github/package-json/v/webKrafters/eagleeye.js">
</p>

# React-Observable-Context [Eagle Eye]

<table BORDER-COLOR="0a0" BORDER-WIDTH="2">
    <td VALIGN="middle" ALIGN="center" FONT-WEIGHT="BOLD" COLOR="#333" HEIGHT="250px" width="1250px">
		COMPATIBLE WITH REACT VERSIONS 16.8 to 18.x.x.<br />
		A VERSION 7.0.0 FOR REACT 19+ IS CURRENTLY UNDER DEVELOPMENT.
	</td>
</table>

<ul>
	<li> Auto-immutable update-friendly context. See <a href="https://eagleeye.js.org/concepts/store/setstate"><code>store.setState</code></a>.</li>
	<li> A context bearing an observable consumer <a href="https://eagleeye.js.org/concepts/store">store</a>.</li>
	<li> Recognizes <b>negative array indexing</b>. Please see <a href="https://eagleeye.js.org/concepts/property-path">Property Path</a> and <code>store.setState</code> <a href="https://eagleeye.js.org/concepts/store/setstate#indexing">Indexing</a>.</li>
	<li> Only re-renders subscribing components (<a href="https://eagleeye.js.org/concepts/client">clients</a>) on context state changes.</li>
	<li> Subscribing component decides which context state properties' changes to trigger its update.</li>
</ul>

**Name:** React-Observable-Context

**Moniker:** Eagle Eye

**Usage:** Please see <b><a href="https://eagleeye.js.org/getting-started">Getting Started</a></b>.

**Demo:** [Play with the app on codesandbox](https://codesandbox.io/s/github/webKrafters/react-observable-context-app)\
If sandbox fails to load app, please refresh dependencies on its lower left.

**Install:**\
npm i -S react-eagleeye\
Alternate: npm i -S @webkrafters/react-observable-context

May also see <b><a href="https://eagleeye.js.org/history/features">What's Changed?</a></b>

## Please see full documentation here:
**[eagleeye.js.org](https://eagleeye.js.org)**

# License

MIT
