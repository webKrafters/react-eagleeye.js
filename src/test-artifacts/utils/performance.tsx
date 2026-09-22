import {
	createContext,
	ReactNode,
	use
} from 'react';

export type Count = ( componetId : string ) => void;

export interface Counter {
	count: Count;
}

export interface RenderCountMap {
	[ componentId : string ] : number;
}

export interface RenderStats {
	count : RenderCountMap;
	reset : () => void;
}

export const RenderCounter = createContext<Counter|null>( null );

export function useRenderCounter( componentId : string ) {
	use( RenderCounter )?.count( componentId );
}

export function withRenderCounter( ui : ReactNode ) {
	const stats = { count: {} } as RenderStats;
	stats.reset = () => Object.keys( stats.count ).forEach( k => { stats.count[ k ] = 0 } );
	const count = ( componentId : string ) => {
		if( !( componentId in stats.count ) ) {
			stats.count[ componentId ] = 0;
		}
		stats.count[ componentId ]++;
	}
	return {
		stats,
		ui: (
			<RenderCounter.Provider value={{ count }}>
				{ ui }
			</RenderCounter.Provider>
		)
	}
}
