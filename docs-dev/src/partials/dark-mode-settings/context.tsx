import React, { Children, createContext, useState } from 'react';

import metadata from '../../../gatsby-config/metadata';

export interface Props {
    children?: React.ReactNode;
    initValue? : boolean;
};

export const UpdateCtx = createContext<React.Dispatch<React.SetStateAction<boolean>>>(()=>{});
export const ValueCtx = createContext<boolean|undefined>( undefined );

const Provider : React.FC<Props> = ({
    children,
    initValue = metadata.darkmode.defaultValue
}) => {
    const [ darkModeFlag, setDarkModeFlag ] = useState( () => initValue );
    return (
        <UpdateCtx.Provider value={ setDarkModeFlag }>
            <ValueCtx.Provider value={ darkModeFlag }>
                { Children.map( children, c => c ) }
            </ValueCtx.Provider>
        </UpdateCtx.Provider>
    );
};

export default Provider;