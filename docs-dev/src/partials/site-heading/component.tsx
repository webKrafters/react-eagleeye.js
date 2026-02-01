import React, { useContext, useLayoutEffect } from 'react';

import CloseOutlinedIcon from '@ant-design/icons/CloseOutlined';
import MenuOutlinedIcon from '@ant-design/icons/MenuOutlined';

import { graphql, useStaticQuery } from 'gatsby';

import { StaticImage } from 'gatsby-plugin-image';

import Anchor from '../anchor';
import ToggleSwitch from '../toggle-switch';

import AuxSiderToggleable from '../toggle-switch/container/aux-sider';

import { ValueCtx } from '../../page-context';

import DarkModeSetting from '../dark-mode-settings';

import SiteTags from '../site-tags';

import './style.scss';

interface Props {
  isAuxCollapsed?: boolean;
  isSiderCollapsed?: boolean;
  onToggleAux?: VoidFunction;
  onToggleSider?: VoidFunction;
};

const SiderToggleable : React.FC<Props> = props => (
  <ToggleSwitch
    className="sider-toggle-btn"
    isOn={ !props.isSiderCollapsed }
    OffIconType={ CloseOutlinedIcon }
    OnIconType={ MenuOutlinedIcon }
    onToggle={ props.onToggleSider }
  />
);

const Component : React.FC<Props> = props => { 
  const { site: { siteMetadata: { title, url: {
    npm: npmUrl,
    repo: repoUrl
  } } } } = useStaticQuery(
    graphql`
        query HeaderVm{
            site {
                siteMetadata {
                    title
                    url {
                      npm
                      repo
                    }
                }
            }
        }
    `
  );
  const { isNoSiderPage } = useContext( ValueCtx );
  useLayoutEffect(() => {
    props.isAuxCollapsed === false &&
    window.scroll({
      behavior: 'smooth',
      left: 0,
      top: 0
    });
  }, [ props.isAuxCollapsed ]);
  return (
    <header className="site-heading">
      { !isNoSiderPage && ( <SiderToggleable { ...props } /> ) }
      <div className="branding">
        <Anchor className="logo-link" to="/">
          <StaticImage
            alt="Logo"
            className="logo"
            src="../../images/logo.png"
          />
        </Anchor>
        <div className="text">
          <span className="brand">
            <Anchor hideIcon to={ repoUrl }>
              Eagle Eye
            </Anchor>
          </span>
          <span className="name">
            <Anchor hideIcon to={ npmUrl }>
              React-Observable-Context
            </Anchor>
          </span>
        </div>
      </div>
      <div>
        <SiteTags />
        <DarkModeSetting />
        { !isNoSiderPage && (
          <AuxSiderToggleable
            isOn={ !props.isAuxCollapsed }
            onToggle={ props.onToggleAux }
          />
        ) }
      </div>
    </header>
  );
};

Component.displayName = 'Site.Heading';

export default Component;