import React from 'react';

import Anchor from '../anchor';

import './style.scss';

const Component : React.FC = () => (
    <section className="site-tags">
        <img alt="GitHub package.json version" src="https://img.shields.io/github/package-json/v/webKrafters/auto-immutable.js" />
        <Anchor to="https://typescriptlang.org">
            <img alt="TypeScript" src="https://badgen.net/badge/icon/typescript?icon=typescript&label" />
        </Anchor>
        <img alt="NPM" src="https://img.shields.io/npm/l/@webkrafters/react-observable-context" />
    </section>
)

export default Component;