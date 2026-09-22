import { createContext, EagleEyeUniversal } from './';

describe( 'ReactEagleEye Universal', () => {
	test( 'accepts zero argument', () => {
		expect( createContext()  ).toBeInstanceOf( EagleEyeUniversal );
	} );
} );
