import type { FC } from 'react';

import type { Changes, Prehooks } from '../..';

import React, {
	GetDerivedStateFromError,
	memo,
	useCallback,
	useEffect,
	useState
} from 'react';

import isEmpty from 'lodash.isempty';

import {
	CapitalizedDisplay,
	CustomerPhoneDisplay,
	Editor,
	ObservableContext,
	PriceSticker,
	ProductDescription,
	Reset,
	useObservableContext,
	TestState
} from './normal';

export const MemoizedReset = memo( Reset );
export const MemoizedCustomerPhoneDisplay = memo( CustomerPhoneDisplay );
export const MemoizedEditor = memo( Editor );
export const MemoizedProductDescription = memo( ProductDescription );
export const MemoizedPriceSticker = memo( PriceSticker );

const TallyDisplay : FC = () => {
	const { data: { color, name, price, type } } = useObservableContext({
		color: 'color',
		name: 'customer.name',
		price: 'price',
		type: 'type'
	});
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
				<MemoizedCustomerPhoneDisplay />
			</div>
			<table>
				<tbody>
					<tr><td><label>Type:</label></td><td>
						<CapitalizedDisplay text={ type as unknown as string } />
					</td></tr>
					<tr><td><label>Color:</label></td><td>
						<CapitalizedDisplay text={ color as unknown as string } />
					</td></tr>
					<tr><td><label>Price:</label></td><td>{ price.toFixed( 2 ) }</td></tr>
				</tbody>
			</table>
			<div style={{ textAlign: 'right' }}>
				<MemoizedReset />
			</div>
		</div>
	);
};
TallyDisplay.displayName = 'TallyDisplay';
export const MemoizedTallyDisplay = memo( TallyDisplay );

export const Product : FC<{
	prehooks? : Prehooks,
	type : string
}>= ({ prehooks = undefined, type }) => {

	const [ state, setState ] = useState<TestState>(() => ({
		color: 'Burgundy',
		customer: {
			name: { first: null, last: null },
			phone: null
		},
		price: 22.5,
		type
	}));

	useEffect(() => {
		setState({ type } as TestState ); // use this to update only the changed state
		// setState({ ...state, type }); // this will override the context internal state for these values
	}, [ type ]);

	const overridePricing = useCallback( e => setState({
		price: Number( e.target.value )
	} as TestState ), [] );

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
					<MemoizedEditor />
					<MemoizedTallyDisplay />
				</div>
				<MemoizedProductDescription />
				<MemoizedPriceSticker />
			</ObservableContext.Provider>
		</div>
	);
};
Product.displayName = 'Product';

const App : FC = () => {

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
