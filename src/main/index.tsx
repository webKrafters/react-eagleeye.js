import type {
	AutoImmutable,
	Changes,
	ConnectProps,
	IStorage,
	Prehooks,
	ProviderProps,
	RawProviderProps,
	SelectorMap,
	State,
	Store,
	Stream,
	StreamAdapter
} from '..';

import React, {
	createContext as _createContext,
	type FC,
	useCallback,
	useEffect,
	useEffectEvent,
	useMemo,
	useState,
} from 'react';

import {
	EagleEyeContext as BaseContext
} from '@webkrafters/eagleeye';

export class EagleEyeContext<T extends State = State> extends BaseContext<T> {
	
	private _streamAdapter : StreamAdapter<T>;
	private _stream : Stream<T>;
	
	constructor(
		value? : AutoImmutable<T>,
		prehooks? : Prehooks<T>,
		storage? : IStorage<T>
	);
	constructor(
		value? : T,
		prehooks? : Prehooks<T>,
		storage? : IStorage<T>
	);
	constructor( value, prehooks, storage ) {
		super( value, prehooks, storage );

		// @debug
		this._stream = <S extends SelectorMap>( selectorMap? : S ) => {
			const [ store ] = useState(() => super.stream( selectorMap ));
			const [ data, setData ] = useState( () => store.data );
			useEffectEvent(() => { store.onDataChange = () => setData( store.data ) });
			useMemo(() => { store.selectorMap = selectorMap }, [ selectorMap ]);
			useEffect(() => { store.close() }, []);
			const resetState = useCallback(( propertyPaths? : Array<string> ) => store.resetState( propertyPaths ), []);
			const setState = useCallback(( changes : Changes<T> ) => store.setState( changes ), []);
			return useMemo<Store<T, S>>(() => ({ data, resetState, setState }), [ data ]);
		};
		// this.useContext = <S extends SelectorMap>( selectorMap? : S ) => {
		// 	let [ connection ] = React.useState(() => this.cache.connect());
			
		// 	const _renderKeys = useRenderKeyProvider( selectorMap );

		// 	const refineKeys = () => {
		// 		const rKeys = _renderKeys.slice();
		// 		if( fullStateSelectorIndex !== -1 ) {
		// 			rKeys[ fullStateSelectorIndex ] = constants.GLOBAL_SELECTOR;
		// 		}
		// 		return rKeys;
		// 	}

		// 	/* Reverses selectorMap i.e. {selectorKey: propertyPath} => {propertyPath: selectorKey} */
		// 	const [ selectorMapInverse, fullStateSelectorIndex ] = useMemo(() => {
		// 		const map = {} as {[propertyPath: string]: string};
		// 		if( !_renderKeys.length ) {
		// 			return [ map, _renderKeys.indexOf( constants.FULL_STATE_SELECTOR ) ];
		// 		}
		// 		for( const selectorKey in selectorMap ) {
		// 			map[ selectorMap[ selectorKey as string ] ] = selectorKey;
		// 		}
		// 		return [ map, _renderKeys.indexOf( constants.FULL_STATE_SELECTOR ) ];
		// 	}, [ _renderKeys ]);

		// 	const [ data, setData ] = React.useState(() => {
		// 		const data = {} as Data<S, T>;
		// 		if( !_renderKeys.length ) { return data }
		// 		const state = connection.get( ...refineKeys() as string[] );
		// 		for( const propertyPath of _renderKeys ) {
		// 			data[ selectorMapInverse[ propertyPath ] ] = state[
		// 				propertyPath === constants.FULL_STATE_SELECTOR
		// 					? constants.GLOBAL_SELECTOR
		// 					: propertyPath
		// 			];
		// 		}
		// 		return data;
		// 	});

		// 	const dataSourceListener : Listener = (
		// 		changes, changePathsTokens, netChanges, mayHaveChangesAt
		// 	) => {
		// 		for( let _Len = _renderKeys.length, _ = 0; _ < _Len; _++ ) {
		// 			if( _renderKeys[ _ ] !== constants.FULL_STATE_SELECTOR && !mayHaveChangesAt(
		// 				stringToDotPath( _renderKeys[ _ ] as string ).split( '.' )
		// 			) ) { continue }
		// 			return updateData();
		// 		}
		// 	};

		// 	const updateData = () => {
		// 		let hasChanges = false;
		// 		const state = connection.get( ...refineKeys() as Array<string> );
		// 		for( const propertyPath of _renderKeys ) {
		// 			const selectorKey = selectorMapInverse[ propertyPath ];
		// 			if( propertyPath === constants.FULL_STATE_SELECTOR ) {
		// 				if( data[ selectorKey ] === state[ constants.GLOBAL_SELECTOR ] ) { continue }
		// 				data[ selectorKey ] = state[ constants.GLOBAL_SELECTOR ];
		// 				hasChanges = true;
		// 				continue;
		// 			}
		// 			if( data[ selectorKey ] === state[ propertyPath ] ) { continue }
		// 			data[ selectorKey ] = state[ propertyPath ];
		// 			hasChanges = true;
		// 		}
		// 		hasChanges && setData({ ...data });
		// 	};

		// 	const [ resetState, setState ] = useMemo(() => [
		// 		( propertyPaths = _renderKeys as Array<string> ) => this.resetState( connection, propertyPaths ),
		// 		changes => this.setState( connection, changes ),
		// 	], [ connection ]);

		// 	React.useEffect(() => { // sync data states with new renderKeys
		// 		if( this.cache.closed ) { return }
		// 		connection = this.cache.connect();
		// 		if( !_renderKeys.length ) {
		// 			const _default = {} as typeof data;
		// 			!isEqual( _default, data ) && setData( _default );
		// 			return;
		// 		}
		// 		for( const selectorKey in data ) {
		// 			if( !( selectorMap[ selectorKey as string ] in selectorMapInverse ) ) {
		// 				delete data[ selectorKey ];
		// 			}
		// 		}
		// 		const unsubscribe = this.subscribe( dataSourceListener );
		// 		updateData();
		// 		return () => {
		// 			if( this.cache.closed ) { return }
		// 			unsubscribe();
		// 			connection.disconnect();
		// 		};
		// 	}, [ _renderKeys ]);

		// 	return useMemo<Store<T, S>>(
		// 		() => ({ data, resetState, setState }),
		// 		[ data ]
		// 	);
		// };
		this._streamAdapter = selectorMap => {
			const useContext = this._stream;
			const connect = WrappedComponent => {
				const ConnectedComponent = ownProps => {
					const store = useContext( selectorMap );
					return ( <WrappedComponent store={ store } { ...ownProps } /> );
				};
				ConnectedComponent.displayName = 'ObservableContext.Connected';
				return ConnectedComponent;
			}
			return connect;
		};
	}
	
	public get streamAdapter() { return this._streamAdapter }

	public get stream() { return this._stream }

}

export function createEagleEye<T extends State = State>( props? : RawProviderProps<T> ) : EagleEyeContext<T>;
export function createEagleEye<T extends State = State>( props? : ProviderProps<T> ) : EagleEyeContext<T>; 
export function createEagleEye<T extends State = State>( props = {} as ProviderProps<T> ) {
	return new EagleEyeContext<T>( props.value, props.prehooks, props.storage );
}


/* ------------------------------------------------------- */

// @debug [BEGINS]

type TestState = { a : number };
type TestSelectorMap = { anchor : 'a' };
const obCtx = new EagleEyeContext<TestState>({ a: 22 });
const connect = obCtx.streamAdapter({ anchor: 'a' });

interface Props extends ConnectProps<
	TestState,
	TestSelectorMap
> {
	make : string;
	model : string;
	store : Store<TestState, TestSelectorMap>;
	year : number;
}
const MyComp : FC<Props> = ( props ) => props.year;
const ConnectedComp = connect( MyComp );
() => ( <ConnectedComp make="toyota" model="camry" year={ 1996 } /> );
