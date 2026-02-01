import { WindowLocation } from '@reach/router';

import { PageProps as P } from 'gatsby';

import React, { createContext, useState } from 'react';

export type PageProps<
    DataType = object,
    PageContextType = object,
    LocationState = WindowLocation[ "state" ],
    ServerDataType = object
> = Partial<P<
    DataType,
    PageContextType,
    LocationState,
    ServerDataType
> & {
    className? : string,
    isNoSiderPage : boolean
}>;

export const UpdaterCtx = createContext<React.Dispatch<React.SetStateAction<PageProps>>>(()=>{});
export const ValueCtx = createContext<PageProps>({});

const Provider : React.FC<{
    children : React.ReactNode,
    initState : PageProps
}> = ({ children, initState }) => {
    const [ state, setState ] = useState( () => initState );
    return (
        <UpdaterCtx.Provider value={ setState }>
            <ValueCtx.Provider value={ state }>
                { children }
            </ValueCtx.Provider>
        </UpdaterCtx.Provider>
    );
};

export default Provider;