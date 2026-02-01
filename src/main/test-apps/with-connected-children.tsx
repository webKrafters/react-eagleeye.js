import type {
	FC,
	ReactElement,
	ReactNode
} from 'react';

import type { Store } from '../..';

import { TestState } from './normal';

import React, {
	useCallback,
	useEffect,
	useRef,
	useState
} from 'react';

import isEmpty from 'lodash.isempty';

import { connect } from '..';

import { CapitalizedDisplay, ObservableContext } from './normal';

const Reset : FC<{resetState: (propertyPaths?: string[]) => void}> = ({ resetState }) => {
	useEffect(() => console.log( 'Reset component rendered.....' ));
	const reset = useCallback(() => resetState([ '@@STATE' ]), [ resetState ]);
	return ( <button onClick={ reset }>reset context</button> );
};
Reset.displayName = 'Reset';
export const ConnectedReset = connect( ObservableContext )( Reset );

const CustomerPhoneDisplay : FC<{ data: { phone: string } }> = ({ data }) => {
	useEffect(() => console.log( 'CustomerPhoneDisplay component rendered.....' ));
	return `Phone: ${ data.phone ?? 'n.a.' }` as unknown as ReactElement;
};
CustomerPhoneDisplay.displayName = 'CustomerPhoneDisplay';
export const ConnectedCustomerPhoneDisplay = connect(
	ObservableContext, { phone: 'customer.phone' }
)( CustomerPhoneDisplay as unknown as FC<Store<Partial<TestState>, { phone : string }>> );

const TallyDisplay : FC<{
	data: Pick<TestState, "color" | "price" | "type"> & {
		name: TestState["customer"]["name"]
	}
}> = ({ data: { color, name, price, type } }) => {
	useEffect(() => console.log( 'TallyDisplay component rendered.....' ));
	return (
		<div style={{ margin: '20px 0 10px' }}>
			<div style={{ float: 'left', fontSize: '1.75rem' }}>
				Customer:
				{ ' ' }
				{ isEmpty( name.first ) && isEmpty( name.last )
					? 'n.a.'
					: (
						<>
							<CapitalizedDisplay text={ name.first } />
							{ ' ' }
							<CapitalizedDisplay text={ name.last } />
						</>
					)
				}
			</div>
			<div style={{ clear: 'both', paddingLeft: 3 }}>
				<ConnectedCustomerPhoneDisplay />
			</div>
			<table>
				<tbody>
					<tr><td><label>Type:</label></td><td>
						<CapitalizedDisplay text={ type } />
					</td></tr>
					<tr><td><label>Color:</label></td><td>
						<CapitalizedDisplay text={ color } />
					</td></tr>
					<tr><td><label>Price:</label></td><td>{ price.toFixed( 2 ) }</td></tr>
				</tbody>
			</table>
			<div style={{ textAlign: 'right' }}>
				<ConnectedReset />
			</div>
		</div>
	);
};
TallyDisplay.displayName = 'TallyDisplay';
export const ConnectedTallyDisplay = connect( ObservableContext, {
	color: 'color',
	name: 'customer.name',
	price: 'price',
	type: 'type'
})( TallyDisplay as unknown as FC<Pick<Store<TestState, {[ K in "color" | "name" | "price" | "type" ]: string}>, "data">>);

const Editor : FC<{
	setState: (changes: Record<any, any>) => void
}> = ({ setState }) => {

	const fNameInputRef = useRef<HTMLInputElement>();
	const lNameInputRef = useRef<HTMLInputElement>();
	const phoneInputRef = useRef<HTMLInputElement>();
	const priceInputRef = useRef<HTMLInputElement>();
	const colorInputRef = useRef<HTMLInputElement>();
	const typeInputRef = useRef<HTMLInputElement>();

	const updateColor = useCallback(() => {
		setState({ color: colorInputRef.current.value });
	}, []);
	const updateName = useCallback(() => {
		setState({
			customer: {
				name: {
					first: fNameInputRef.current.value,
					last: lNameInputRef.current.value
				}
			}
		});
	}, []);
	const updatePhone = useCallback(() => {
		const phone = phoneInputRef.current.value;
		if( phone.length && !/[0-9]{10}/.test( phone ) ) { return }
		setState({ customer: { phone } });
	}, []);
	const updatePrice = useCallback(() => {
		setState({ price: Number( priceInputRef.current.value ) });
	}, []);
	const updateType = useCallback(() => {
		setState({ type: typeInputRef.current.value });
	}, []);

	useEffect(() => console.log( 'Editor component rendered.....' ));

	return (
		<fieldset style={{ margin: '10px 0' }}>
			<legend>Editor</legend>
			<h3 style={{ margin: '0.5rem 0' }}>Customer:</h3>
			<div style={{ float: 'left', margin: '10px 0' }}>
				<label htmlFor='firstName'><input ref={ fNameInputRef } placeholder="First name" /></label>
				{ ' ' }
				<label htmlFor='lastName'><input ref={ lNameInputRef } placeholder="Last name" /></label>
				{ ' ' }
				<button onClick={ updateName }>update customer</button>
			</div>
			<div style={{ clear: 'both', margin: '10px 0' }}>
				<label>New Phone: <input
					maxLength={ 10 }
					placeholder="Empty or 10-digit integer"
					ref={ phoneInputRef }
					type="number"
				/></label>
				{ ' ' }
				<button onClick={ updatePhone }>update phone</button>
			</div>
			<hr style={{ margin: '1.5rem 0' }} />
			<div style={{ margin: '10px 0' }}>
				<label>New Price: <input ref={ priceInputRef } /></label>
				{ ' ' }
				<button onClick={ updatePrice }>update price</button>
			</div>
			<div style={{ margin: '10px 0' }}>
				<label>New Color: <input ref={ colorInputRef } /></label>
				{ ' ' }
				<button onClick={ updateColor }>update color</button>
			</div>
			<div style={{ margin: '10px 0' }}>
				<label>New Type: <input ref={ typeInputRef } /></label>
				{ ' ' }
				<button onClick={ updateType }>update type</button>
			</div>
		</fieldset>
	);
};
Editor.displayName = 'Editor';
export const ConnectedEditor = connect( ObservableContext )( Editor );

export const ProductDescription : FC<{
	data : {
		c: ReactNode,
		t: ReactNode
	}
}> = ({ data }) => {
	useEffect(() => console.log( 'ProductDescription component rendered.....' ));
	return (
		<div style={{ fontSize: 24 }}>
			<strong>Description:</strong> { data.c } { data.t }
		</div>
	);
};
ProductDescription.displayName = 'ProductDescription';
export const ConnectedProductDescription = connect(
	ObservableContext, { c: 'color', t: 'type' }
)( ProductDescription as FC<Pick<Store<TestState, { c: string, t: string }>, "data">> );

export const PriceSticker : FC<{data: { p: number }}> = ({ data: { p } }) => {
	useEffect(() => console.log( 'PriceSticker component rendered.....' ));
	return (
		<div style={{ fontSize: 36, fontWeight: 800 }}>
			${ p.toFixed( 2 ) }
		</div>
	);
};
PriceSticker.displayName = 'PriceSticker';
export const ConnectedPriceSticker = connect( ObservableContext, { p: 'price' } )(
	PriceSticker as unknown as FC<Pick<Store<TestState, { p: string }>, "data">>
);

export const Product : React.FC<{
	prehooks? : import("../..").Prehooks,
	type : string
}> = ({ prehooks = undefined, type }) => {

	const [ state, setState ] = useState(() => ({
		color: 'Burgundy',
		customer: {
			name: { first: null, last: null },
			phone: null
		},
		price: 22.5,
		type
	}));

	useEffect(() => {
		setState({ type } as typeof state ); // use this to update only the changed state
		// setState({ ...state, type }); // this will override the context internal state for these values
	}, [ type ]);

	const overridePricing = useCallback( e => setState({
		price: Number( e.target.value )
	} as typeof state ), [] );

	return (
		<div>
			<div style={{ marginBottom: 10 }}>
				<label>$ <input onKeyUp={ overridePricing } placeholder="override price here..."/></label>
			</div>
			<ObservableContext.Provider prehooks={ prehooks } value={ state }>
				<div style={{
					borderBottom: '1px solid #333',
					marginBottom: 10,
					paddingBottom: 5
				}}>
					<ConnectedEditor />
					<ConnectedTallyDisplay />
				</div>
				<ConnectedProductDescription />
				<ConnectedPriceSticker />
			</ObservableContext.Provider>
		</div>
	);
};
Product.displayName = 'Product';

const App : React.FC = () => {

	const [ productType, setProductType ] = useState( 'Calculator' );

	const updateType = useCallback( e => setProductType( e.target.value ), [] );

	return (
		<div className="App">
			<h1>Demo</h1>
			<h2>A contrived product app.</h2>
			<div style={{ marginBottom: 10 }}>
				<label>Type: <input onKeyUp={ updateType } placeholder="override product type here..." /></label>
			</div>
			<Product type={ productType } />
		</div>
	);
};
App.displayName = 'App';

export default App;
