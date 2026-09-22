import {
	Context,
	createContext as _createContext,
	FC,
	RefObject,
	use,
	ComponentType,
	JSX,
	useState,
	useEffect,
	useCallback
} from 'react';

import { sha512 } from 'js-sha512';
import stringify from 'safe-stable-stringify';

import { AbstractObservable, makeStore } from '..';

import {
	Channel,
	createEagleEye,
	type ProviderProps as BaseProviderProps,
	SelectorMap,
	State,
	Store,
} from '../../';

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

type TemplateType<P> = P extends IProviderProps<infer U> ? U : never;
type TemplateType2<T> = T extends AbstractObservable<infer U> ? U : never;

export type WithChildren<P extends IProviderProps<TemplateType<P>>> = P & {
	children? : React.ReactNode;
}

export interface ChannelEntry {
	channel : WeakRef<Channel>;
	numConnections : number;
	useStore : () => Store;
}

export interface Entry {
	channels : ChsResource<Channel>;
	observable : WeakRef<AbstractObservable<any>>;
}

export interface Handle<W extends WeakKey> {
	readonly descriptor : string;
	readonly resource : W;
}

interface IResource<W extends WeakKey>{
	acquire ( desc : string, resource : W ) : Handle<W>;
	createHandleFor ( desc : string ) : Handle<W>;
	getResourceAt ( desc : string ) : W;
}

/** format: chs.registry = {[sMapHash : string] : {channel : WeakRef<Channel>, numConnections : number, store : Store<T, S> }} */
class ChsResource<W extends Channel> implements IResource<W> {
	private _finalizer = new FinalizationRegistry<string>( s => this.finalize( s ) );
	private _registry = {} as Record<string, ChannelEntry>;
	acquire( sMapHash: string, resource: W ) {
		const useStore = () => {
			const [ store, setStore ] = useState(() => makeStore( resource ));
			useEffect(() => {
				const fn = () => setStore({ ...store, data: resource.data });
				resource.addListener( 'data-changed', fn );
				return () => resource.removeListener( 'data-changed', fn );
			}, [ resource ]);
			return store;
		};
		this._registry[ sMapHash ] = {
			channel: new WeakRef( resource ),
			numConnections: 0,
			useStore
		};
		this._finalizer.register( resource, sMapHash, resource );
		return this.createHandleFor( sMapHash );
	}
	createHandleFor( sMapHash : string ) {
		const entry = this._registry[ sMapHash ] as ChannelEntry;
		const handle = {
			get descriptor () { return sMapHash },
			get isValid() { return !!entry },
			get resource () { return entry?.channel.deref?.() as W },
			get size () { return handle.isValid ? entry.numConnections : -1 },
			get useStore () { return entry.useStore },
			dec: () => { 
				if( !handle.isValid ) { return }
				entry.numConnections--;
				if( handle.size ) { return }
				handle.resource.endStream();
				this._finalizer.unregister( handle.resource );
				entry.channel = null;
				this.finalize( sMapHash );
			},
			inc() { handle.isValid && entry.numConnections++ }
		};
		return handle;
	}
	getResourceAt( sMapHash : string ) { return this.createHandleFor( sMapHash ).resource }
	private finalize( sMapHash : string ) { delete this._registry[ sMapHash ] }
}

/** format: obs.registry = {channels : ChsResource, observable: {[regNum : `${number}:${number}`] : WeakRef<AbstractObservable<any>>}} */
class ObsResource<W extends AbstractObservable<TemplateType2<W>>> implements IResource<W> {
	private _finalizer = new FinalizationRegistry<string>( regKey => {
		delete this._registry[ regKey ];
	} )
	private _registry = {} as Record<string, Entry>;
	acquire( regNum: string, resource: W ) {
		this._registry[ regNum ] = {
			channels: new ChsResource<Channel>(),
			observable: new WeakRef( resource )
		};
		this._finalizer.register( resource, regNum, resource );
		return this.createHandleFor( regNum );
	}
	createHandleFor( regNum : string ) {
		const entry = this._registry[ regNum ] ?? {} as Entry;
		return {
			get descriptor () { return regNum },
			get resource () { return entry?.observable.deref?.() as W },
			addChannelAt( sMapHash : string, channel : Channel ) {
				return entry?.channels.acquire( sMapHash, channel );
			},
			getChannelHandleAt( sMapHash : string ) {
				return entry?.channels.createHandleFor( sMapHash );
			}
		}
	}
	getRegNumOf( resource : W ) {
		for( const regNum in this._registry ) {
			if( this.getResourceAt( regNum ) === resource ) {
				return regNum;
			}
		}
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

export class EagleEyeUniversal<T extends State> {

	private _context : Context<string>;
	private _pCache = null as unknown as ReturnType<EagleEyeUniversal<T>["defineProvider"]>;
	private _obs = null as unknown as ObsResource<AbstractObservable<any>>;
	private _sCache = null as unknown as ReturnType<EagleEyeUniversal<T>["defineStreamHook"]>;
	private _util = null as Utility<T>;
	
	constructor() {
		this._context = _createContext<string>( '0:0' );
		this._pCache = this.defineProvider();
		this._obs = new ObsResource<AbstractObservable<any>>();
		this._sCache = this.defineStreamHook();
		this._util = new Utility( this );
	}

	get resourceMap() { return this._obs }

	/** context provider component */
	get Provider() { return this._pCache }

	/** use stream hook */
	get useStream() { return this._sCache }

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
			let targetId : ID;
			if( !( 'targetId' in props ) ) {
				targetId = me.provide<ID>( props ).targetId;
			} else {
				targetId = props.targetId;
				if( !me._util.getObservableAt( targetId ) ) {
					throw new Error( `No valid observable instance found at target ID, ${ targetId }`);
				}
			}
			props.ref ??= { current: {} as Address<ID> };
			props.ref.current.targetId  = targetId
			const Context = me._context;
			return (
				<Context value={ targetId }>
					{ props.children }
				</Context>
			) as JSX.Element;
		}
		return provide;
	}

	private defineStreamHook() {
		return <const S extends SelectorMap>( selectorMap? : S ) => {
			const [ sMapHash, updateSMapHash ] = useState(() => this._util.hashSelectorMap( selectorMap ));

			const targetId = use( this._context );

			const getStoreHook = useCallback(() => {
				const ctxHandle = this._obs.createHandleFor( targetId );
				let streamHandle = ctxHandle.getChannelHandleAt( sMapHash );
				if( !streamHandle.isValid ) {
					ctxHandle.addChannelAt(
						sMapHash,
						ctxHandle.resource.stream( selectorMap )
					);
					streamHandle = ctxHandle.getChannelHandleAt( sMapHash );
				}
				streamHandle.inc();
				return streamHandle.useStore as () => Store<T, S>;
			}, [ sMapHash, selectorMap, targetId ]);

			const [ useStore, updateStoreHook ] = useState( getStoreHook );

			useEffect(() => updateSMapHash( this._util.hashSelectorMap( selectorMap ) ), [ selectorMap ]);
			
			useEffect(() => updateStoreHook( getStoreHook() ), [ sMapHash ]);

			return useStore();
		};
	}
}

class Utility<T extends State> {
	private context = null as EagleEyeUniversal<T>;
	constructor( context : EagleEyeUniversal<T> ) {
		this.context = context;
	}
	getIdOf( target : AbstractObservable<T> ) {
		return this.context.resourceMap.getRegNumOf( target );
	}
	getObservableAt<const ID extends string>( targetId : ID ) {
		return this.context.resourceMap.getResourceAt( targetId ) as AbstractObservable<T>;
	}
	hashSelectorMap<S extends SelectorMap>( selectorMap? : S ) {
		return sha512( stringify( selectorMap, ( k, v ) => {
			typeof v === 'undefined' ? 'undefined' : v ===  null ? 'null' : v
		} ) )
	}
	pointAt<const ID extends string>( target? : AbstractObservable<T>) {
		if( !target ) {
			target = createEagleEye<T>();
		} else {
			const targetId = this.getIdOf( target ) as ID;
			if( targetId ) {
				return { target, targetId } as Point<T, ID>
			}
		}
		const targetId = genRegNum() as ID;
		this.context.resourceMap.acquire( targetId, target );
		return { target, targetId } as Point<T, ID>;
	}
}

export function createContext<T extends State>() { return new EagleEyeUniversal<T>() }
