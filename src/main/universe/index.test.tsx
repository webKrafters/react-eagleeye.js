import {
	act,
	render,
	renderHook,
	RenderResult
} from '@testing-library/react';
import {
	Address,
	createContext,
	ObservableUniverse,
	Point,
	Utility
} from '.';
import {
	Changes,
	createEagleEye,
	FULL_STATE_SELECTOR,
	IStorage,
	Store
} from '../..';
import Immutable from '@webkrafters/auto-immutable';
import {
	Dispatch,
	FC,
	ReactNode,
	RefObject,
	SetStateAction,
	useMemo,
	useState
} from 'react';
import { ObservableContext } from '..';
import createSourceData, { SourceData } from '../../test-artifacts/data/create-state-obj';

describe( 'ReactObservableUniverse', () => {
	let TestContext : ObservableUniverse<any>;
	beforeAll(() => {
		TestContext = createContext();
	});
	test( 'accepts zero argument', () => {
		expect( TestContext  ).toBeInstanceOf( ObservableUniverse );
	} );
	test( 'holds an immutable Provider property', () => {
		expect( TestContext.Provider ).toEqual( expect.any( Function ) );
		/* @ts-expect-error */
		expect(() => { TestContext.Provider = () => null }).toThrow();
		expect( TestContext.Provider ).toEqual( TestContext.Provider );
	} );
	test( 'holds an immutable useStream property', () => {
		expect( TestContext.useStream ).toEqual( expect.any( Function ) );
		/* @ts-expect-error */
		expect(() => { TestContext.useStream = () => null }).toThrow();
		expect( TestContext.useStream ).toEqual( TestContext.useStream );
	} );
	describe( 'free(...) method as a manual tenant scope enforcement option', () => {
		test( '1xxxx only severs relationship with non-streaming context instances', () => {
			let renderResult : RenderResult;
			const obsIds : Array<string> = [];
			const TestContext = createContext();
			expect( obsIds ).toHaveLength( 0 );
			let {
				target: outerTarget,
				targetId: outerTargetId
			} = TestContext.provide();
			obsIds.push( outerTargetId );
			expect( obsIds[ 0 ] ).toBe( outerTargetId );
			expect( TestContext.getObservableAt( obsIds[ 0 ] ) )
				.toBe( outerTarget );
			{
				const innerTargetId = TestContext.provide().targetId;
				obsIds.push( innerTargetId );
				expect( obsIds[ 0 ] ).toBe( outerTargetId );
				expect( obsIds[ 1 ] ).toBe( innerTargetId );
				let target = TestContext.getObservableAt( obsIds[ 1 ] );
				expect( target ).toBeInstanceOf( ObservableContext );
				expect( target ).not.toBe( outerTarget );
				expect( obsIds ).toHaveLength( 2 );
				const useStream = TestContext.useStream
				const Client = () => {
					const { setState } = useStream( null );
					return ( <button onClick={ () => setState({ test: 1 }) } /> );
				}
				renderResult = render(
					<TestContext.Provider targetId={ outerTargetId }>
						<Client />
					</TestContext.Provider>
				);
			}
			TestContext.free( obsIds[ 0 ] );
			expect( obsIds[ 0 ] ).toBe( outerTargetId );
			expect( TestContext.getObservableAt( obsIds[ 0 ] ) ).toBe( outerTarget );
			let innerTarget = TestContext.getObservableAt( obsIds[ 1 ] );
			expect( innerTarget ).toBeInstanceOf( ObservableContext );
			expect( innerTarget ).not.toBe( outerTarget );

			TestContext.free( obsIds[ 0 ] );
			TestContext.free( obsIds[ 1 ] );
			expect( TestContext.getObservableAt( obsIds[ 0 ] ) ).toBe( outerTarget );
			expect( TestContext.getObservableAt( obsIds[ 1 ] ) ).toBeUndefined();
			
			renderResult.unmount();
			
			TestContext.free( outerTarget );
			expect( TestContext.getObservableAt( obsIds[ 0 ] ) ).toBeUndefined();
		} );
		test( 'uses the "force" flag to sever context instances irrespective of its streaming status', () => {
			const TestContext = createContext();
			const {
				target,
				targetId
			} = TestContext.provide();
			expect( TestContext.getObservableAt( targetId ) ).toBe( target );
			const useStream = TestContext.useStream;
			const Client = () => {
				const { setState } = useStream();
				return ( <button onClick={ () => setState({ test: 1 }) } /> );
			}
			const innerRef = { current : null } as unknown as RefObject<Address<string>>;
			render(
				<TestContext.Provider targetId={ targetId }>
					<Client />
					<TestContext.Provider ref={ innerRef }>
						<Client />
					</TestContext.Provider>
				</TestContext.Provider>
			);
			const innerTargetId = innerRef.current.targetId;
			const innerTarget = TestContext.getObservableAt( innerTargetId );
			expect( innerTargetId ).not.toBe( targetId );
			expect( TestContext.getObservableAt( targetId ) ).toBe( target );
			expect( innerTarget ).not.toBe( target );
			TestContext.free( targetId );
			expect( TestContext.getObservableAt( targetId ) ).toBe( target );
			TestContext.free( targetId, true );
			expect( TestContext.getObservableAt( targetId ) ).toBeUndefined();
			TestContext.free( innerTarget );
			expect( TestContext.getObservableAt( innerTargetId ) ).toBe( innerTarget );
			TestContext.free( innerTarget, true );
			expect( TestContext.getObservableAt( innerTargetId ) ).toBeUndefined();
		} );
	} );
	describe( 'useStream', () => {
		test( '', () => {
			const sMap = {
				bff: 'friends[2].name.first',
				eyes: 'eyeColor',
				fruit: 'favoriteFruit',
				name: 'name'
			} as const;
			type SMap = typeof sMap;
			type Streamed = Store<SourceData, SMap>["data"];
			type StreamReset = Store<SourceData, SMap>["resetState"];
			type StreamSet = Store<SourceData, SMap>["setState"];
			const Context = createContext<SourceData>();
			const { useStream } = Context;
			interface Props {
				updateResetter : ( reset : StreamReset ) => void;
				updateSetter : ( set : StreamSet ) => void;
				updateClientData : ( d : Streamed ) => void;
			}
			let clientData = null as unknown as Streamed;
			let resetState = null as unknown as StreamReset;
			let setState = null as unknown as StreamSet;
			const props : Props = {
				updateResetter: r => { resetState = r },
				updateSetter: s => { setState = s },
				updateClientData: d => { clientData = d  }
			}
			const Client : FC<Props> = props => {
				const { data, resetState, setState } = useStream( sMap );
				useMemo(() => { props.updateClientData( data ) }, [ data ]);
				useMemo(() => { props.updateResetter( resetState ) }, [ resetState ]);
				useMemo(() => { props.updateSetter( setState ) }, [ setState ]);
				return null;
			}
			expect( clientData ).toBeNull();
			expect(() => { // must be used within Provider tree
				render( <Client { ...props } /> )
			}).toThrow();
			expect( clientData ).toBeNull();
			const value = createSourceData();
			render(
				<Context.Provider observableConfig={{ value }}>
					<Client { ...props } />
				</Context.Provider>
			);
			expect( clientData ).toEqual({
				bff: value.friends[2].name.first,
				eyes: value.eyeColor,
				fruit: value.favoriteFruit,
				name: value.name
			});
			expect( clientData.eyes ).toBe( 'blue' );
			expect( clientData.fruit ).toBe( 'banana' );
			act(() => {
				setState({
					eyeColor: 'brown',
					favoriteFruit: 'pineapple'
				} as Changes<SourceData> );
			});
			expect( clientData ).not.toEqual({
				bff: value.friends[2].name.first,
				eyes: value.eyeColor,
				fruit: value.favoriteFruit,
				name: value.name
			});
			expect( clientData.eyes ).toBe( 'brown' );
			expect( clientData.fruit ).toBe( 'pineapple' );
			act( resetState );
			expect( clientData ).toEqual({
				bff: value.friends[2].name.first,
				eyes: value.eyeColor,
				fruit: value.favoriteFruit,
				name: value.name
			});
			expect( clientData.eyes ).toBe( 'blue' );
			expect( clientData.fruit ).toBe( 'banana' );
		} );
	} );
	describe( 'Provider', () => {
		test( 'creates and provides annonymous context instance when none available', () => {
			const ctxAddr = { current: null } as unknown as RefObject<Address>;
			const Context = createContext();
			expect( ctxAddr.current ).toBeNull();
			render(
				<Context.Provider ref={ ctxAddr }>
					null
				</Context.Provider>
			);
			expect( ctxAddr.current ).toEqual( expect.objectContaining({
				targetId: expect.any( String )
			}) );
			expect( Context.getObservableAt( ctxAddr.current.targetId ) )
				.toBeInstanceOf( ObservableContext );
		} );
		test( '1: creates and provides annonymous context instance when only its configuration is available', () => {
			const value = { name: '', age: 33 };
			type State = typeof value;
			const ctxAddr = { current: null } as unknown as RefObject<Address>;
			const Context = createContext<State>();
			expect( ctxAddr.current ).toBeNull();
			render(
				<Context.Provider
					observableConfig={{ value }}
					ref={ ctxAddr }
				>
					null
				</Context.Provider>
			);
			expect( ctxAddr.current ).toEqual( expect.objectContaining({
				targetId: expect.any( String )
			}) );
			expect( Context.getObservableAt( ctxAddr.current.targetId ) )
				.toBeInstanceOf( ObservableContext );
		} );
		test( 'creates and provides annonymous context instance when only its configuration is available', () => {
			type State = {
				name: string;
				age: number;
			};
			const value = new Immutable<State>({ name: '', age: 33 });
			const ctxAddr = { current: null } as unknown as RefObject<Address>;
			const Context = createContext<State>();
			expect( ctxAddr.current ).toBeNull();
			render(
				<Context.Provider
					observableConfig={{ value }}
					ref={ ctxAddr }
				>
					null
				</Context.Provider>
			);
			expect( ctxAddr.current ).toEqual( expect.objectContaining({
				targetId: expect.any( String )
			}) );
			expect( Context.getObservableAt( ctxAddr.current.targetId ) )
				.toBeInstanceOf( ObservableContext );
		} );
		test( 'accepts and provides an unknown context instance when available', () => {
			const ctxAddr = { current: null } as unknown as RefObject<Address>;
			const Context = createContext();
			expect( ctxAddr.current ).toBeNull();
			const ctxInstance = createEagleEye();
			render(
				<Context.Provider
					observable={ ctxInstance }
					ref={ ctxAddr }
				>
					null
				</Context.Provider>
			);
			expect( ctxAddr.current ).toEqual( expect.objectContaining({
				targetId: expect.any( String )
			}) );
			expect( Context.getObservableAt( ctxAddr.current.targetId ) ).toBe( ctxInstance );
		} );
		describe( 'provisioning through ID', () => {
			test( 'matches to a known instance', () => {
				const ctxAddr = { current: null } as unknown as RefObject<Address>;
				const Context = createContext();
				const point = Context.provide();
				expect( point ).toEqual( expect.objectContaining({
					target: expect.any( ObservableContext ),
					targetId: expect.any( String ),
				}) );
				render(
					<Context.Provider
						targetId={ point.targetId }
						ref={ ctxAddr }
					>
						null
					</Context.Provider>
				);
				expect( ctxAddr.current ).toEqual( expect.objectContaining({
					targetId: point.targetId
				}) );
				expect( Context.getObservableAt( ctxAddr.current.targetId ) ).toBe( point.target );
			} );
			test( 'throws on no match found', () => {
				expect(() => {
					render(
						<TestContext.Provider
							targetId="UNKNOWN"
						>
							null
						</TestContext.Provider>
					);
				}).toThrow();
			} );
		} );
		describe( 'updating observed instance', () => {
			test( 'can be achieved using any of its configuration', () => {
				const ctxAddr = { current: null } as unknown as RefObject<Address>;
				const Context = createContext();
				const point = Context.provide();
				const {
					prehooks: oldPrehooks,
					storage: oldStorage
				} = point.target;
				let oldValue = point.target.store.getState([
					FULL_STATE_SELECTOR
				]);
				const t = render(
					<Context.Provider
						targetId={ point.targetId }
						ref={ ctxAddr }
					>
						null
					</Context.Provider>
				);
				expect( ctxAddr.current ).toEqual( expect.objectContaining({
					targetId: point.targetId
				}) );
				expect( Context.getObservableAt( ctxAddr.current.targetId ) ).toBe( point.target );
				expect( point.target.storage ).toBe( oldStorage );
				const storage = {
					clone: ()=>expect.any( Object ),
					getItem: ()=>expect.anything(),
					removeItem: ()=>{},
					setItem: ()=>{}
				} as IStorage;
				expect( storage ).not.toBe( oldStorage );
				t.rerender(
					<Context.Provider
						observableConfig={{ storage }}
						ref={ ctxAddr }
					>
						null
					</Context.Provider>
				);
				expect( point.target.prehooks ).toBe( oldPrehooks );
				expect( point.target.store.getState([
					FULL_STATE_SELECTOR
				]) ).toBe( oldValue );
				const prehooks = {};
				let value : any = {
					prompt: {
						q: 'state your business',
						r: 'just testing.....'
					}
				};
				expect( prehooks ).not.toBe( oldPrehooks );
				expect( value ).not.toEqual( oldValue );
				t.rerender(
					<Context.Provider
						observableConfig={{ prehooks, value }}
						ref={ ctxAddr }
					>
						null
					</Context.Provider>
				);

				expect( point.target.store.getState([
					FULL_STATE_SELECTOR
				]) ).toEqual({ ...oldValue, ...value });
				expect( value ).not.toEqual( oldValue );
				oldValue = value;
				const rebutted = true;
				value = {
					prompt: { rebutted },
					rebuttal: {
						q: 'anything else?',
						r: 'Well, still just testing!'
					},
					scalarTest: 1
				};
				expect( value ).not.toEqual( oldValue );
				const imValue = new Immutable( value );
				t.rerender(
					<Context.Provider
						observableConfig={{
							value: imValue
						}}
						ref={ ctxAddr }
					>
						null
					</Context.Provider>
				);
				expect( ctxAddr.current ).toEqual( expect.objectContaining({
					targetId: point.targetId
				}) );
				expect( Context.getObservableAt( ctxAddr.current.targetId ) ).toBe( point.target );
				expect( point.target.storage ).toBe( storage );
				expect( point.target.prehooks ).toBe( prehooks );
				value = { ...value, ...oldValue };
				value.prompt.rebutted = rebutted;
				expect( point.target.store.getState([
					FULL_STATE_SELECTOR
				]) ).toEqual( value );
			} );
			test( 'with a different instance causes the new instance to be provided', () => {
				const ctxAddr = { current: null } as unknown as RefObject<Address>;
				const Context = createContext();
				const point1 = Context.provide();
				const point2 = Context.provide();
				expect( point1.target ).not.toBe( point2.target );
				expect( point1.targetId ).not.toBe( point2.targetId );
				const t = render(
					<Context.Provider
						observable={ point1.target }
						ref={ ctxAddr }
					>
						null
					</Context.Provider>
				);
				expect( ctxAddr.current ).toEqual( expect.objectContaining({
					targetId: point1.targetId
				}) );
				expect( Context.getObservableAt( ctxAddr.current.targetId ) ).toBe( point1.target );
				t.rerender(
					<Context.Provider
						observable={ point2.target }
						ref={ ctxAddr }
					>
						null
					</Context.Provider>
				);
				expect( ctxAddr.current ).toEqual( expect.objectContaining({
					targetId: point2.targetId
				}) );
				expect( Context.getObservableAt( ctxAddr.current.targetId ) ).toBe( point2.target );
			} );
			test( 'by ID causes an instance matching the ID to be provided', () => {
				const ctxAddr = { current: null } as unknown as RefObject<Address>;
				const Context = createContext();
				const point1 = Context.provide();
				const point2 = Context.provide();
				expect( point1.target ).not.toBe( point2.target );
				expect( point1.targetId ).not.toBe( point2.targetId );
				const t = render(
					<Context.Provider
						targetId={ point1.targetId }
						ref={ ctxAddr }
					>
						null
					</Context.Provider>
				);
				expect( ctxAddr.current ).toEqual( expect.objectContaining({
					targetId: point1.targetId
				}) );
				expect( Context.getObservableAt( ctxAddr.current.targetId ) ).toBe( point1.target );
				t.rerender(
					<Context.Provider
						targetId={ point2.targetId }
						ref={ ctxAddr }
					>
						null
					</Context.Provider>
				);
				expect( ctxAddr.current ).toEqual( expect.objectContaining({
					targetId: point2.targetId
				}) );
				expect( Context.getObservableAt( ctxAddr.current.targetId ) ).toBe( point2.target );
			} );
			test( 'by an unrecognized ID throws', () => {
				const ctxAddr = { current: null } as unknown as RefObject<Address>;
				const Context = createContext();
				const point = Context.provide();
				expect( point ).toEqual( expect.objectContaining({
					target: expect.any( ObservableContext ),
					targetId: expect.any( String ),
				}) );
				const t = render(
					<Context.Provider
						targetId={ point.targetId }
						ref={ ctxAddr }
					>
						null
					</Context.Provider>
				);
				expect( ctxAddr.current ).toEqual( expect.objectContaining({
					targetId: point.targetId
				}) );
				expect( Context.getObservableAt( ctxAddr.current.targetId ) ).toBe( point.target );
				expect(() => {
					t.rerender(
						<Context.Provider
							targetId="UNKNOWN"
							ref={ ctxAddr }
						>
							null
						</Context.Provider>
					);
				}).toThrow();
			} );
		} );
	} );
	test( 'throws on attempt to externally access resources', () => {
		expect(() => {
			TestContext.secureResourceMapFor(
				new Utility( TestContext )
			)
		}).toThrow();
	} );
	describe( 'locationing', () => {
		let Context : ObservableUniverse<any> = createContext();
		let point1 : Point;
		let point2 : Point;
		let point3 : Point;
		beforeAll(() => {
			Context = createContext();
			point1 = Context.provide();
			point2 = Context.provide();
			point3 = Context.provide();
		});
		test( 'finds the id of a provisioned observable instance', () => {
			expect( Context.getIdOf( point1.target ) ).toBe( point1.targetId );
			expect( Context.getIdOf( point2.target ) ).toBe( point2.targetId );
			expect( Context.getIdOf( point3.target ) ).toBe( point3.targetId );
			const observable = createEagleEye();
			expect( Context.getIdOf( observable ) ).toBeUndefined();
			const point4 = Context.provide({ observable });
			expect( point4.target ).toBe( observable );
			expect( Context.getIdOf( observable ) ).toBe( point4.targetId );
		} );
		test( 'finds the id of a provisioned instance', () => {
			expect( Context.getObservableAt( point1.targetId ) ).toBe( point1.target );
			expect( Context.getObservableAt( point2.targetId ) ).toBe( point2.target );
			expect( Context.getObservableAt( point3.targetId ) ).toBe( point3.target );
			expect( Context.getObservableAt( 'UNKNOWN' ) ).toBeUndefined();
		} );
	} );
	describe( 'connecting components into a reactive stream of a provisioned observable context', () => {
		const sMap = {
			company: 'company',
			name: 'name'
		} as const;
		type SMap = typeof sMap;
		type Streamed = Store<SourceData, SMap>;
		type Data = Streamed["data"];
		type Reporter = ( d : Data ) => void;
		type ShowLessTrigger = Dispatch<SetStateAction<boolean>>;
		interface Props { report : Reporter }
		class Artifact {
			data = null as unknown as Data;
			setData( d : Data ) { this.data = d }
		}
		let observable : ObservableContext<SourceData>;
		let observableInner : ObservableContext<SourceData>;
		let companyArtifact : Artifact;
		let nameArtifact : Artifact;
		let nameArtifactInner : Artifact;
		let data : Data;
		let observeGranularly : ShowLessTrigger;
		beforeAll(() => {
			companyArtifact = new Artifact();
			nameArtifact = new Artifact();
			nameArtifactInner = new Artifact();
			const Context = createContext<SourceData>();
			const stream = Context.stream( sMap );
			const Company = stream.into<Props>((
				{ data, report } : Streamed & Props
			) => {
				useMemo(() => { report( data ) }, [ data, report ]);
				return ( <div>{ data.company }</div> );
			});
			const Name = stream.into<Props>((
				{ data, report } : Streamed & Props
			) => {
				useMemo(() => { report( data ) }, [ data, report ]);
				return ( <div>{ data.name.last }</div> );
			});
			const reportCompany = ( d : Data ) => companyArtifact.setData( d );
			const reportName = ( d : Data ) => nameArtifact.setData( d );
			const reportNameInner = ( d : Data ) => nameArtifactInner.setData( d );
			observable = createEagleEye( createSourceData() );
			observableInner = createEagleEye({
				... createSourceData(),
				company: 'This New Test Company'
			})
			const App = ({ useInnerObservableTrigger } : {
				useInnerObservableTrigger : ( trigger: ShowLessTrigger ) =>void
			}) => {
				const [ granular, makeGranular ] = useState( true );
				useMemo(
					() => useInnerObservableTrigger( makeGranular ),
					[ useInnerObservableTrigger ]
				);
				return (
					<Context.Provider observable={ observable }>
						<Company report={ reportCompany } />
						{ !granular
							? ( <Name report={ reportNameInner } /> )
							: (
								<div>
									<Context.Provider observable={ observableInner }>
										<Name report={ reportNameInner } />
									</Context.Provider>
								</div>
							)
						}
						<Name report={ reportName } />
					</Context.Provider>
				);
			}
			const useInnerObservableTrigger = ( trigger : ShowLessTrigger ) => { observeGranularly = trigger }
			render( <App { ...{ useInnerObservableTrigger } } /> );
			const d = createSourceData();
			data = { company: d.company, name: d.name };
		});
		test( 'streaming data from the nearest provisioned context', () => {
			// outer clients observe outer provided instance &
			// inner clients observe inner
			expect( companyArtifact.data ).toEqual( data );
			expect( nameArtifact.data ).toEqual( data );
			expect( nameArtifactInner.data ).toEqual({
				...data,
				company: 'This New Test Company'
			});
			// removes inner provided instance - all clients
			// observing the outer instance
			act(() => observeGranularly( false ) );
			expect( companyArtifact.data ).toEqual( data );
			expect( nameArtifact.data ).toEqual( data );
			expect( nameArtifactInner.data ).toEqual( data );
			// reinstates inner provided instance - outer clients
			// observe outer instance & inner clients observe inner
			act(() => observeGranularly( true ) );
			expect( companyArtifact.data ).toEqual( data );
			expect( nameArtifact.data ).toEqual( data );
			expect( nameArtifactInner.data ).toEqual({
				...data,
				company: 'This New Test Company'
			});
		} );
	} );
} );
