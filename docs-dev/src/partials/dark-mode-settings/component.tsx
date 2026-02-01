import React, { forwardRef, useCallback, useContext, useEffect, useState } from 'react';

import { graphql, useStaticQuery } from 'gatsby';

import MoonFilledIcon from '@ant-design/icons/MoonFilled';
import SunFilledIcon from '@ant-design/icons/SunFilled';

import { Button } from 'antd';

import { UpdateCtx, ValueCtx } from './context';

import './style.scss';

export interface Props { reverseIcon?: boolean };

const selectCurrentIcon = ( isDarkMode: boolean, reverseIcon: boolean ) => isDarkMode
    ? reverseIcon ? ( <SunFilledIcon /> ) : ( <MoonFilledIcon suppressHydrationWarning /> )
    : reverseIcon ? ( <MoonFilledIcon suppressHydrationWarning /> ) : ( <SunFilledIcon /> );

const Component = forwardRef<HTMLElement, Props>(({ reverseIcon = false }, ref ) => {

    const { site: { siteMetadata: { darkmode: {
        key: DARKMODE_LOCALSTORAGE_KEY
    } } } } = useStaticQuery(
        graphql`
            query DarkmodeInfo {
                site {
                    siteMetadata {
                        darkmode {
                            key
                        }
                    }
                }
            }
        `
    );

    const updateDarkmodeCtx = useContext( UpdateCtx );
    const darkmodeCtxValue = useContext( ValueCtx );

    const [ isDark, setModeFlag ] = useState(() => {
        if( typeof darkmodeCtxValue !== 'undefined' ) { return darkmodeCtxValue }
        if( typeof window === 'undefined' || !window.localStorage ) { return true }
        const mode = localStorage.getItem( DARKMODE_LOCALSTORAGE_KEY );
        const flag = mode === 'true';
        return flag;
    });

    const onClick = useCallback(
        typeof window === 'undefined' || !window.localStorage
            ? () => {}
            : () => setModeFlag( f => {
                const flag = !f;
                localStorage.setItem( DARKMODE_LOCALSTORAGE_KEY, `${ flag }` );
                return flag;
            } ),
        []
    );

    const [ currentIconEl, setCurrentIconEl ] = useState(() => selectCurrentIcon( isDark, reverseIcon ));
    
    useEffect(() => {
        setCurrentIconEl( selectCurrentIcon( isDark, reverseIcon ) );
        updateDarkmodeCtx( isDark );
    }, [ isDark, reverseIcon ]);

    useEffect(() => {
        darkmodeCtxValue !== isDark && 
        typeof darkmodeCtxValue !== 'undefined' &&
        setModeFlag( darkmodeCtxValue );
    }, [ darkmodeCtxValue ]);

    return (
        <Button
            className="dark-mode-settings"
            icon={ currentIconEl }
            onClick={ onClick }
            ref={ ref }
            shape="circle"
        />
    );
} );

Component.displayName = 'DarkModeSetting';

export default Component;