import { useEffect, useState } from 'react';

import metadata from '../../gatsby-config/metadata';

const hook = () : number => {
    const [ timer, setTimer ] = useState<NodeJS.Timeout>();
    const [ year, setYear ] = useState( () => new Date().getFullYear() );
    useEffect(() => {
        !timer && setTimer(
            setTimeout( () => {
                setTimer( undefined );
                const _year = new Date().getFullYear();
                _year === year && setYear( _year )
            }, metadata._24Hours )
        );
    }, [ timer ]);
    return year;
};

export default hook;