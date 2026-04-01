<p align="center">
	<img alt="Eagle Eye" height="150px" src="logo.png" width="250px" />
</p>
<p align="center">
	<a href="https://typescriptlang.org">
		<img alt="TypeScript" src="https://badgen.net/badge/icon/typescript?icon=typescript&label">
	</a>
	<a href="https://github.com/webKrafters/react-eagleeye.js/actions">
		<img alt="GitHub Workflow Status" src="https://img.shields.io/github/actions/workflow/status/webKrafters/react-eagleeye.js/test.yml">
	</a>
	<a href="https://coveralls.io/github/webKrafters/react-eagleeye.js">
		<img alt="coverage" src="https://img.shields.io/coveralls/github/webKrafters/react-eagleeye.js">
	</a>
	<img alt="NPM" src="https://img.shields.io/npm/l/@webkrafters/react-eagleeye">
	<img alt="Maintenance" src="https://img.shields.io/maintenance/yes/2032">
	<img alt="build size" src="https://img.shields.io/bundlephobia/minzip/@webkrafters/react-eagleeye?label=bundle%20size">
	<a href="https://www.npmjs.com/package/@webKrafters/react-eagleeye">
		<img alt="Downloads" src="https://img.shields.io/npm/dt/@webkrafters/react-eagleeye.svg">
	</a>
	<img alt="GitHub package.json version" src="https://img.shields.io/github/package-json/v/webKrafters/react-eagleeye.js">
</p>

# React Eagle Eye

<table BORDER-COLOR="0a0" BORDER-WIDTH="2">
    <td VALIGN="middle" ALIGN="center" FONT-WEIGHT="BOLD" COLOR="#333" HEIGHT="250px" width="1250px">
		COMPATIBLE WITH REACT VERSIONS 19.2.0 AND BEYOND.<br />
		FOR EARLIER VERSIONS OF REACT 16 TO 19, PLEASE USE THE<br />
		<a href="https://www.npmjs.com/package/@webkrafters/react-eagleeye">React Observable Context</a>.
	</td>
</table>
<ul>
	<li> Ready for use anywhere in the app. No Provider components needed.</li>
	<li> Automatically prevents unnecessary cascading re-renders when used with the <a href="https://react-eagleeye.js.org/getting-started/#connect-usage"><code>connect</code></a> Stream API.</li>
	<li> Auto-immutable update-friendly context. See <a href="https://react-eagleeye.js.org/concepts/store/setstate"><code>store.setState</code></a>.</li>
	<li> A context bearing an observable consumer <a href="https://react-eagleeye.js.org/concepts/store">store</a>.</li>
	<li> Recognizes <b>negative array indexing</b>. Please see <a href="https://react-eagleeye.js.org/concepts/property-path">Property Path</a> and <code>store.setState</code> <a href="https://react-eagleeye.js.org/concepts/store/setstate#indexing">Indexing</a>.</li>
	<li> Only re-renders subscribing components (<a href="https://react-eagleeye.js.org/concepts/client">clients</a>) on context state changes.</li>
	<li> Subscribing component decides which context state properties' changes to trigger its update.</li>
</ul>

**Name:** React-Eagle-Eye

**Usage:** Please see <b><a href="https://react-eagleeye.js.org/getting-started">Getting Started</a></b>.

**Demo:** [Play with the app on codesandbox](https://codesandbox.io/s/github/webKrafters/react-eagleeye-app)\
If sandbox fails to load app, please refresh dependencies on its lower left.

**Install:**\
npm install --save @webkrafters/react-eagleeye

May also see <b><a href="https://react-eagleeye.js.org/history/features">What's Changed?</a></b>

Full Documentation: **[react-eagleeye.js.org](https://react-eagleeye.js.org)**

# License

GPLv3
