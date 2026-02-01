export interface RangePayload {
    lastDescendant : HTMLElement;
    rootAancestor? : HTMLElement|null;
    runCheck : ( currentElement : HTMLElement|null ) => boolean;
};

export function findElement({
    lastDescendant,
    rootAancestor = null,
    runCheck
} : RangePayload ) : boolean {
    if( !( lastDescendant instanceof Element ) ) { return false }
    for( let t = lastDescendant; t !== rootAancestor && t !== null; t = t.parentNode as HTMLElement ) {
        if( runCheck( t ) ) { return true }
    }
    return false;
}

export default findElement;