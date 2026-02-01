import React, { useCallback, useContext, useState } from 'react';

import isHandheldWidth from '../../../util/is-handheld-portrait';

import { ValueCtx } from '../../../page-context';

import SiteBody from '../../site-body';
import SiteFooting from '../../site-footing';
import SiteHeading from '../../site-heading';

import '../style.scss';
import './style.scss';

/** `Props.children` expects page body contents */
export interface Props { children? : React.ReactNode };

const Layout : React.FC<Props> = ({ children }) => {
  const [ isAuxCollapsed, setCollapsedAuxFlag ] = useState( true );
  const [ isSiderCollapsed, setCollapsedSiderFlag ] = useState( isHandheldWidth );
  const toggleAuxSwitch = useCallback(() => setCollapsedAuxFlag( f => !f ), []);
  const toggleSiderSwitch = useCallback(() => setCollapsedSiderFlag( f => !f ), []);
  return (
    <div className={ `index-layout${ useContext( ValueCtx ).isNoSiderPage ? ' no-sider' : '' }` }>
      <SiteHeading
        isAuxCollapsed={ isAuxCollapsed }
        isSiderCollapsed={ isSiderCollapsed }
        onToggleAux={ toggleAuxSwitch }
        onToggleSider={ toggleSiderSwitch }
      />
      <SiteBody 
        isAuxCollapsed={ isAuxCollapsed }
        isSiderCollapsed={ isSiderCollapsed }
        onAuxVisibilityChange={ setCollapsedAuxFlag }
        onSiderVisibilityChange={ setCollapsedSiderFlag }
        onToggleAux={ toggleAuxSwitch }
      >
        { children }
      </SiteBody>
      <SiteFooting />
    </div>
  );
};

export default Layout;