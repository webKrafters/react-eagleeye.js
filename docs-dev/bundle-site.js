var fs = require( 'fs' );
var path = require( 'path' );

try {
    fs.mkdirSync( 'docs' );
} catch( e ) {
    if( e.code !== 'EEXIST' ) {
        console.error( e );
        process.exit( 1 );
    }
}

fs.cp(
    path.join( __dirname, 'public' ),
    path.join( __dirname, 'docs' ),
    {
        preserveTimestamps: true,
        recursive: true
    },
    function( err ) {
        if( err ) {
            console.error( err );
            process.exit( 1 );
        }
        console.log( 'Site deployment complete.' );
        process.exit( 0 );
    }
);