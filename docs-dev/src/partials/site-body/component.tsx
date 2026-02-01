import type {
    ForwardRefExoticComponent,
    LegacyRef,
    MouseEventHandler,
    ReactNode,
    RefAttributes,
    RefObject
} from 'react';

import React, {
    Children,
    forwardRef,
    useCallback,
    useContext,
    useEffect,
    useLayoutEffect,
    useMemo,
    useRef,
    useState
} from 'react';

import { Button } from 'antd';

import CloseOutlinedIcon from '@ant-design/icons/CloseOutlined';

import { ValueCtx } from '../../page-context';

import findElementInPath from '../../util/find-element';
import hasHandheldWidth from '../../util/is-handheld-portrait';

import SiteFaqs from '../site-faqs';
import SiteNav from '../site-nav';
import SiteTags from '../site-tags';

import AuxSiderToggleable from '../toggle-switch/container/aux-sider';

import './style.scss';

export interface Props {
    children? : React.ReactNode,
    isAuxCollapsed? : boolean,
    isSiderCollapsed? : boolean,
    onAuxVisibilityChange : ( isCollapsed: boolean ) => void,
    onSiderVisibilityChange : ( isCollapsed: boolean ) => void,
    onToggleAux : VoidFunction
};

type EventHandler = (this: HTMLElement, ev: MouseEvent) => any;

const AuxSider : ForwardRefExoticComponent<{
    children : ReactNode;
    className? : string;
    onClose : MouseEventHandler<HTMLElement>; 
} & RefAttributes<HTMLElement>> = forwardRef(
    ({ children, className = '', onClose }, ref ) => {
        return (
            <section
                className={ `aux-sider${ className.length ? ` ${ className }` : '' }` }
                ref={ ref }
            >
                <Button className="close" onClick={ onClose }>
                    <CloseOutlinedIcon />
                </Button>
                { children }
            </section>
        );
    }
);

AuxSider.displayName = 'Site.Body.Sider.Aux';

const Sider : ForwardRefExoticComponent<{
    isCollapsible?: boolean;
} & RefAttributes<HTMLElement>> = forwardRef(
    ({ isCollapsible = true }, ref ) => {
        useLayoutEffect(() => {
            ( ref as RefObject<HTMLElement> ).current?.classList[ isCollapsible ? 'remove' : 'add' ]( 'closed' );
        }, [ isCollapsible ]);
        return (
            <section
                className={ `site-body-sider${ isCollapsible ? '' : ' closed' }` }
                ref={ ref as LegacyRef<HTMLElement> }
            >
                <SiteNav />
            </section>
        );
    }
);

Sider.displayName = 'Site.Body.Sider';

const NoSider : React.FC<Pick<Props, "children" | "isAuxCollapsed" | "onToggleAux">> = ({ children, ...props }) => {
    const page = useMemo(() => Children.map(
        children as React.ReactHTMLElement<any>,
        c => {
            try {
                return React.cloneElement( c, {
                    className: `page-main${
                        c.props.className?.length
                            ? ` ${ c.props.className }`
                            : ''
                    }`
                } );
            } catch( e ) { return c }
        }
    ), [ children ]);
    return (
        <main>
            <div className="tags-area">
                <SiteTags />
                { !useContext( ValueCtx ).isNoSiderPage && (
                    <AuxSiderToggleable
                        isOn={ !props.isAuxCollapsed }
                        onToggle={ props.onToggleAux }
                    />
                ) }
            </div>
            { page }
        </main>
    );
};
NoSider.displayName = 'Site.Body.NoSider';

const WithSider : React.FC<Props> = ({
    children,
    isAuxCollapsed,
    isSiderCollapsed,
    onAuxVisibilityChange,
    onSiderVisibilityChange,
    onToggleAux
}) => {
    const auxSliderRef = useRef<HTMLElement>( null );
    const siderRef = useRef<HTMLElement>( null );
    const shouldCloseSidersRef = useRef( true );
    const [ isHandheld, setHandheldFlag ] = useState<boolean>(() => isSiderCollapsed ?? hasHandheldWidth());
    const closeAux = useCallback(() => onAuxVisibilityChange( true ), [ onAuxVisibilityChange ]);
    useEffect(() => {
        let timer : NodeJS.Timeout | void;
        const collapseSider = () => {
            timer && clearTimeout( timer );
            timer = setTimeout(() => {
                setHandheldFlag( hasHandheldWidth );
                timer = undefined;
            }, 500 );
        };
        window.addEventListener( 'resize', collapseSider );
        return () => window.removeEventListener( 'resize', collapseSider );
    }, []);
    useEffect(() => onSiderVisibilityChange( isHandheld ), [ isHandheld ]);
    useLayoutEffect(() => {
        const onNavigate : EventHandler = e => {
            if( !findElementInPath({
                lastDescendant: e.target as HTMLElement,
                rootAancestor: e.currentTarget as HTMLElement,
                runCheck: ( t : HTMLElement|null ) => t?.tagName === 'A'
            }) ) { return }
            onAuxVisibilityChange( true );
            isHandheld && onSiderVisibilityChange( true );
            shouldCloseSidersRef.current = false;
        };
        const siteNav = siderRef.current?.querySelector( ':scope .site-nav' ) as HTMLElement;
        siteNav.addEventListener( 'click', onNavigate );
        auxSliderRef.current?.addEventListener( 'click', onNavigate );
        return () => {
            auxSliderRef.current?.removeEventListener( 'click', onNavigate );
            siteNav.removeEventListener( 'click', onNavigate );
        }
    }, [ isHandheld, onAuxVisibilityChange, onSiderVisibilityChange ]);
    const href = typeof location === 'undefined' ? undefined : location.href;
    useLayoutEffect(() => {
        const isCloseable = shouldCloseSidersRef.current;
        shouldCloseSidersRef.current = true;
        if( !isCloseable ) { return }
        shouldCloseSidersRef.current = true;
        onAuxVisibilityChange( true );
        isHandheld && onSiderVisibilityChange( true );
    }, [ href ]);
    return (
        <>
            <Sider isCollapsible={ !( isSiderCollapsed ?? isHandheld ) } ref={ siderRef } />
            <NoSider
                isAuxCollapsed={ isAuxCollapsed }
                onToggleAux={ onToggleAux }
            >
                { children }
            </NoSider>
            <AuxSider
                { ...( isAuxCollapsed ? {} : {
                    className: 'permanent-on'
                } ) }
                onClose={ closeAux }
                ref={ auxSliderRef }
            >
                <SiteFaqs />
            </AuxSider>
        </>
    );
};
WithSider.displayName = 'Site.Body.WithSider';

const Component : React.FC<Props> = ({ children, ...props }) => (
    <section className="site-body">
        { !useContext( ValueCtx ).isNoSiderPage
            ? ( <WithSider { ...props }>{ children }</WithSider> )
            : ( <NoSider { ...props }>{ children }</NoSider> )
        }
    </section>
);
Component.displayName = 'Site.Body';

export default Component;