import {
	Context,
	createContext as _createContext,
	FC,
	use,
	ComponentType,
	JSX,
	RefObject,
	useState,
	useEffect,
	useMemo,
	useRef,
	Component
} from 'react';

import isPlainObject from 'lodash.isplainobject';
import stringify from 'safe-stable-stringify';
import { sha512 } from 'js-sha512';

import { AutoImmutable, Changes, IStore } from '@webkrafters/eagleeye';

import { AbstractObservable, makeStore } from '..';

import {
	Channel,
	createEagleEye,
	type ProviderProps as BaseProviderProps,
	SelectorMap,
	State,
	Store
} from '../..';

export interface Address<
	ID extends string = string
>{
	targetId : ID;
}

export interface Point<
	T extends State = any,
	ID extends string = string
> extends Address<ID> {
	target : AbstractObservable<T>;
}

export type BaseProviderPropsRaw<T extends State> = {
	value? : T
} & Pick<BaseProviderProps<T>, "prehooks"|"storage">;

export interface IProviderProps<ID extends string = string> {
	ref? : RefObject<Address<ID>>;
}

export interface RefProps<
	ID extends string = string
> extends IProviderProps<ID> { targetId : ID; }

export interface ProviderProps<
	T extends State = any,
	ID extends string = string
> extends IProviderProps<ID> {
	observable? : AbstractObservable<T>;
}

export interface ProviderPropsRaw<
	T extends State = any,
	ID extends string = string
> extends IProviderProps<ID> {
	observableConfig? : BaseProviderProps<T>;
}

export interface ProviderPropsPrimitive<
	T extends State = any,
	ID extends string = string
> extends IProviderProps<ID> {
	observableConfig? : BaseProviderPropsRaw<T>;
}

type OwnPropsTemplate<P> = P extends IProviderProps<infer U> ? U : never;
type ObservableTemplate<T> = T extends AbstractObservable<infer U> ? U : never;

export type WithChildren<P extends IProviderProps<OwnPropsTemplate<P>>> = P & {
	children? : React.ReactNode;
}

interface ChannelEntry {
	channel : WeakRef<Channel>;
	numConnections : number;
}

interface Entry {
	channels : ChsResource<Channel>;
	observable : WeakRef<AbstractObservable<any>>;
}

interface Handle<W extends WeakKey> {
	readonly resource : W;
}

class ObserverHandle<W extends AbstractObservable<ObservableTemplate<W>>> implements Handle<W> {
	private _wObs :  WeakRef<ObsResource<W>>;
	private _regNum : string;
	constructor(
		obs : ObsResource<W>,
		regNum : string
	) {
		this._wObs = new WeakRef( obs );
		this._regNum = regNum;
	}
	private get _obs () { return this._wObs.deref() }
	private get _entry() {
		return this._obs.registry[ this._regNum ] ?? {} as Entry;
	}
	get resource () {
		return this._entry?.observable?.deref?.() as W
	}
	addChannelAt( sMapHash : string, channel : Channel ) {
		return this._entry?.channels.acquire( sMapHash, channel );
	}
	getChannelHandleAt( sMapHash : string ) {
		return this._entry?.channels.createHandleFor( sMapHash );
	}
	release( force = false ) {
		if( !force && this._entry.channels.size ) { return }
		this._obs.finalizer.unregister( this.resource );
		this._entry.observable = null;
		this._obs.finalize( this._regNum );
	}
}

class StreamerHandle<W extends Channel> implements Handle<W> {
	private _wChs : WeakRef<ChsResource<W>>;
	private _sMapHash : string;
	constructor(
		chs : ChsResource<W>,
		sMapHash : string
	) {
		this._wChs = new WeakRef( chs );
		this._sMapHash = sMapHash;
	}
	private get _chs() { return this._wChs.deref() }
	private get _entry() {
		return this._chs?.registry[ this._sMapHash ] as ChannelEntry;
	}
	get isValid() { return !!this._entry }
	get resource() {
		return this._entry?.channel?.deref?.() as W
	}
	// istanbul ignore next
	get size() { return this.isValid ? this._entry.numConnections : -1 }
	// istanbul ignore next
	dec() { 
		if( !this.isValid ) { return }
		this._entry.numConnections--;
		if( this.size ) { return }
		this.resource.endStream();
		this._chs.finalizer.unregister( this.resource );
		this._entry.channel = null;
		this._chs.finalize( this._sMapHash );
	}
	inc() { this.isValid && this._entry.numConnections++ }
}

interface IResource<W extends WeakKey>{
	acquire ( desc : string, resource : W ) : Handle<W>;
	createHandleFor ( desc : string ) : Handle<W>;
}

abstract class AbstractResource<W extends WeakKey> implements IResource<W> {
	abstract registry : Record<string, any>;
	get size() { return Object.keys( this.registry ).length }
	abstract acquire( desc : string, resource : W ) : Handle<W>;
	abstract createHandleFor( desc : string ) : Handle<W>;
	finalizer = new FinalizationRegistry<string>( s => this.finalize( s ) );
	finalize( key : string ) { delete this.registry[ key ] }
}

/** format: chs.registry = {[sMapHash : string] : {channel : WeakRef<Channel>, numConnections : number, store : Store<T, S> }} */
class ChsResource<W extends Channel> extends AbstractResource<W> {
	registry = {} as Record<string, ChannelEntry>;
	acquire( sMapHash: string, resource: W ) {
		this.registry[ sMapHash ] = {
			channel: new WeakRef( resource ),
			numConnections: 0
		};
		this.finalizer.register( resource, sMapHash, resource );
		return this.createHandleFor( sMapHash );
	}
	createHandleFor( sMapHash : string ) {
		return new StreamerHandle( this, sMapHash );
	}
}

/** format: obs.registry = {channels : ChsResource, observable: {[regNum : `${number}:${number}`] : WeakRef<AbstractObservable<any>>}} */
class ObsResource<W extends AbstractObservable<ObservableTemplate<W>>> extends AbstractResource<W> {
	registry = {} as Record<string, Entry>;
	acquire( regNum: string, resource: W ) {
		this.registry[ regNum ] = {
			channels: new ChsResource<Channel>(),
			observable: new WeakRef( resource )
		};
		this.finalizer.register( resource, regNum, resource );
		return this.createHandleFor( regNum );
	}
	createHandleFor( regNum : string ) {
		return new ObserverHandle( this, regNum );
	}
	getRegNumOf( resource : W ) {
		for( const regNum in this.registry ) {
			if( this.getResourceAt( regNum ) === resource ) {
				return regNum;
			}
		}
	}
	removeResourceAt( regNum : string, force? : boolean ) {
		this.createHandleFor( regNum )?.release( force );
	}
	getResourceAt( regNum : string ) { return this.createHandleFor( regNum )?.resource }
}

const genRegNum = (() => {
	let count = 0;
	let ts = 0;
	return () => {
		const newTs = Date.now();
		if( newTs === ts ) {
			count++;
		} else {
			ts = newTs;
			count = 0;
		}
		return `${ count }:${ ts }` as const;
	};
})();

export class Observable<T extends State> extends AbstractObservable<T>{}

export class ObservableUniverse<T extends State> {

	private _context : Context<string>;
	private _pCache = null as unknown as ReturnType<ObservableUniverse<T>["defineProvider"]>;
	private _obs = null as unknown as ObsResource<AbstractObservable<T>>;
	private _sCache = null as unknown as ReturnType<ObservableUniverse<T>["defineStreamHook"]>;
	private _util = null as Utility<T>;
	
	constructor() {
		this._context = _createContext<string>( '0:0' );
		this._pCache = this.defineProvider();
		this._obs = new ObsResource<AbstractObservable<T>>();
		this._sCache = this.defineStreamHook();
		this._util = new Utility( this );
	}

	/** context provider component */
	get Provider() { return this._pCache }

	/** use stream hook */
	get useStream() { return this._sCache }

	/**
	 * immediately severs this observable context instance from further access.\
	 * the `force` param ensures immediate severance -- summarily abandoning all current clients.
	 */
	free( observable : AbstractObservable<T>, force? : boolean ) : void;
	free( observable : string, force? : boolean ) : void;
	free( observable : any, force? : boolean ) : void {
		!( observable instanceof AbstractObservable )
			? this._util.untrackId( observable, force )
			: this._util.untrack( observable, force );
	} 
	 
	/** context provider - imperative form */
	provide<const ID extends string>( props? : ProviderProps<T, ID> ) : Point<T, ID>;
	provide<const ID extends string>( props? : ProviderPropsRaw<T, ID> ) : Point<T, ID>;
	provide<const ID extends string>( props? : ProviderPropsPrimitive<T, ID> ) : Point<T, ID>;
	provide<const ID extends string>( props : any = {} ) : Point<T, ID> {
		let { observable } = props as ProviderProps<T, ID>;
		if( !observable ) {
			const t = ( props as ProviderPropsPrimitive<T, ID> ).observableConfig!;
			observable = createEagleEye( t?.value, t?.prehooks, t?.storage );
		}
		return this._util.pointAt<ID>( observable );
	}

	secureResourceMapFor( requestor : Utility<T> ) {
		if( requestor === this._util ) {
			return this._obs;
		}
		throw new Error( 'Illegal operation.' );
	}

	/** connects multiple components to a single stream */
	stream<const S extends SelectorMap>( selectorMap? : S ) {
		const { useStream } = this;
		return {
			into<P>( WrappedComponent : ComponentType<Store<T, S> & P> ) {
				const Container : FC<P> = props => {
					const store = useStream( selectorMap ) as Store<T,S>;
					return ( <WrappedComponent {
						...( { ...store, ...props } as Store<T, S> & P )
					} /> );
				};
				return Container;
			}
		};
	}

	getIdOf( observable : AbstractObservable<T> ) {
		return this._util.getIdOf( observable );
	}

	getObservableAt<const ID extends string>( id : ID ) {
		return this._util.getObservableAt( id );
	}

	private defineProvider() {
		const me = this;
		function provide<
			const ID extends string
		>( props? : WithChildren<ProviderProps<T, ID>> ) : JSX.Element;
		function provide<
			const ID extends string
		>( props? : WithChildren<ProviderPropsRaw<T, ID>> ) : JSX.Element;
		function provide<
			const ID extends string
		>( props? : WithChildren<ProviderPropsPrimitive<T, ID>> ) : JSX.Element;
		function provide<const ID extends string>(
			props? : WithChildren<RefProps<ID>> ) : JSX.Element;
		function provide<
			const ID extends string
		>( props : any = {} ) : JSX.Element {
			const id = useRef( null as unknown as ID );
			useMemo(() => {
				if( 'targetId' in props ) {
					if( !me.getObservableAt( props.targetId ) ) {
						throw new Error( `No valid observable instance found at target ID, ${ props.targetId }`);
					}
					id.current = props.targetId;
					return;
				}
				if( !id.current || 'observable' in props ) {
					id.current = me.provide<ID>( props ).targetId;
					return;
				}
				const ctx = me.getObservableAt( id.current );
				// istanbul ignore next
				if( !( 'observableConfig' in props ) ) { return }
				const config = props.observableConfig;
				if( 'storage' in config && config.storage !== ctx.storage ) {
					ctx.storage = config.storage;
				}
				if( 'prehooks' in config && config.prehooks !== ctx.prehooks ) {
					ctx.prehooks = config.prehooks;
				}
				if( !( 'value' in config ) ) { return }
				if( isPlainObject( config.value ) ) {
					return ctx.store.setState( config.value );
				}
				const connection = ( config.value as AutoImmutable<T> ).connect();
				const value = connection.get( '@@GLOBAL' )[ '@@GLOBAL'];
				connection.disconnect();
				ctx.store.setState( value as Changes<T> );
			}, [
				props.observableConfig?.value,
				props.targetId,
				props.observable,
				props.observableConfig?.prehooks,
				props.observableConfig?.storage
			]);
			if( 'ref' in props && props.ref.current?.targetId !== id.current ) {
				if( !props.ref.current ) {
					props.ref.current = {};
				};
				props.ref.current.targetId = id.current;
			}
			const Context = me._context;
			return (
				<Context value={ id.current }>
					{ props.children }
				</Context>
			) as JSX.Element;
		}
		return provide;
	}

	private defineStreamHook() {
		return <const S extends SelectorMap>( selectorMap? : S ) => {
			const [ sMapHash, updateSMapHash ] = useState(() => this._util.hashSelectorMap( selectorMap ));
			useEffect(() => updateSMapHash( this._util.hashSelectorMap( selectorMap ) ), [ selectorMap ]);
			const targetId = use( this._context );
			const handle = useMemo(() => {
				const ctxHandle = this._obs.createHandleFor( targetId );
				let streamHandle = ctxHandle.getChannelHandleAt( sMapHash );
				if( !streamHandle.isValid ) {
					ctxHandle.addChannelAt(
						sMapHash, ctxHandle.resource.stream( selectorMap )
					);
					streamHandle = ctxHandle.getChannelHandleAt( sMapHash );
				}
				streamHandle.inc();
				return streamHandle;
			}, [ sMapHash, targetId ]);
			const mounted = useRef( false );
			const [ store, setStore ] = useState(() => makeStore( handle.resource ));
			useEffect(() => {
				const channel = handle.resource;
				// istanbul ignore next
				if( mounted.current ) {
					setStore( makeStore( channel ) );
				} else {
					mounted.current = true;
				}
				const fn = () => {
					try { setStore({ ...store, data: channel.data }) } catch( e ) {
						/* allow system gc to clean up scheduled freed streams */
						/* istanbul ignore next */
						if( !( e as Error ).message.includes(
							"Cannot read properties of null (reading 'getState')"
						) ) { throw e }
					}
				}
				channel.addListener( 'data-changed', fn );
				return () => {
					channel.removeListener( 'data-changed', fn );
					handle.dec();
				}
			}, [ handle.resource ]);
			return store as Store<T, S>;
		};
	}

	// private defineStreamHook() {
	// 	return <const S extends SelectorMap>( selectorMap? : S ) => {
	// 		const [ sMapHash, updateSMapHash ] = useState(() => this._util.hashSelectorMap( selectorMap ));
	// 		useEffect(() => updateSMapHash( this._util.hashSelectorMap( selectorMap ) ), [ selectorMap ]);
	// 		const targetId = use( this._context );
	// 		const currChannel = useRef( null as unknown as Channel<T, S> );
	// 		const currHandle = useRef( null as unknown as StreamerHandle<Channel<T, S>> );
	// 		const currUpdater = useRef( null as unknown as () => void );
	// 		const handle = useMemo(() => {
	// 			const ctxHandle = this._obs.createHandleFor( targetId );
	// 			let streamHandle = ctxHandle.getChannelHandleAt( sMapHash );
	// 			if( !streamHandle.isValid ) {
	// 				ctxHandle.addChannelAt(
	// 					sMapHash, ctxHandle.resource.stream( selectorMap )
	// 				);
	// 				streamHandle = ctxHandle.getChannelHandleAt( sMapHash );
	// 			}
	// 			streamHandle.inc();
	// 			return streamHandle as StreamerHandle<Channel<T, S>>;
	// 		}, [ sMapHash, targetId ]);

	// 		let [ store, setStore ] = useState<Store<T,S>>();

	// 		if( handle.resource !== currChannel.current ) {
	// 			if( !!currChannel.current ) {
	// 				currChannel.current.removeListener(
	// 					'data-changed', currUpdater.current
	// 				);
	// 				currHandle.current.dec();
	// 			}
	// 			store = makeStore( handle.resource );
	// 			currChannel.current = handle.resource;
	// 			currHandle.current = handle;
	// 			currUpdater.current = () => {
	// 				// try {
	// 					setStore({ ...store, data: currChannel.current.data });
	// 				// } catch( e ) {
	// 				// 	/* istanbul ignore next */
	// 				// 	if( !( e as Error ).message.includes(
	// 				// 		"Cannot read properties of null (reading 'getState')"
	// 				// 	) ) { throw e }
	// 				// 	// allow system gc to clean up scheduled freed streams
	// 				// }
	// 			}
	// 		}

	// 		// useEffect(() => {
	// 		// 	setStore( makeStore( handle.resource ) );
	// 		// 	return handle.dec.bind( handle );
	// 		// }, [ handle.resource ] )
	// 		// useEffect(() => {
	// 		// 	const fn = () => {
	// 		// 		try {
	// 		// 			setStore( makeStore( handle.resource ) );
	// 		// 		} catch( e ) {
	// 		// 			/* istanbul ignore next */
	// 		// 			if( !( e as Error ).message.includes(
	// 		// 				"Cannot read properties of null (reading 'getState')"
	// 		// 			) ) { throw e }
	// 		// 			// allow system gc to clean up scheduled freed streams
	// 		// 		}
	// 		// 	}
	// 		// 	handle.resource.addListener( 'data-changed', fn );
	// 		// 	return () => {
	// 		// 		handle.resource.removeListener( 'data-changed', fn );
	// 		// 	}
	// 		// }, [ handle.resource ]);

	// 		return store as Store<T, S>;
	// 	};
	// }
}

export class Utility<T extends State> {
	private _wContext : WeakRef<ObservableUniverse<T>>;
	constructor( context : ObservableUniverse<T> ) {
		this._wContext = new WeakRef( context );
	}
	getIdOf( target : AbstractObservable<T> ) {
		return this._registry.getRegNumOf( target );
	}
	getObservableAt<const ID extends string>( targetId : ID ) {
		return this._registry.getResourceAt( targetId ) as AbstractObservable<T>;
	}
	hashSelectorMap<S extends SelectorMap>( selectorMap? : S ) {
		return sha512(
			typeof selectorMap === 'undefined'
			? 'undefined'
			: selectorMap === null
			? 'null'
			: stringify( selectorMap )
		);
	}
	pointAt<const ID extends string>( target : AbstractObservable<T>) {
		let targetId = this.getIdOf( target ) as ID;
		if( targetId ) {
			return { target, targetId } as Point<T, ID>
		}
		targetId = genRegNum() as ID;
		this._registry.acquire( targetId, target );
		return { target, targetId } as Point<T, ID>;
	}
	untrack(  target : AbstractObservable<T>, force? : boolean ) {
		this.untrackId( this.getIdOf( target ), force );
	}
	untrackId<const ID extends string>( targetId : ID, force? : boolean ) {
		this._registry?.removeResourceAt( targetId, force );
	}
	private get _context() { return this._wContext.deref() }
	private get _registry() { return this._context.secureResourceMapFor( this ) }
}

export function createContext<T extends State>() { return new ObservableUniverse<T>() }

{/* function _makeStore<
	T extends State,
	S extends SelectorMap
>( channel : Channel<T, S> ) {
	const s = makeStore( channel );
	s.resetState = intercept( s.resetState );
	s.setState = intercept( s.setState );
	return s;
} */}

// function intercept( m : IStore["resetState"] );
// function intercept( m : IStore["setState"] );
// function intercept( m : any ) {
// 	return ( ...args : Parameters<typeof m> ) => {
// 		try { m( ...args ) } catch( e ) {
// 			/* istanbul ignore next */
// 			if( !e.message.startsWith( "Cannot read properties of null (reading 'getState')" ) ) {
// 				throw e;
// 			}
// 			// allow system gc to clean up scheduled freed streams
// 		}
// 	}
//  }
