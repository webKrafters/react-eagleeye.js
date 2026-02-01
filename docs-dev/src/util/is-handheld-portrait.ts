import metadata from '../../gatsby-config/metadata';

const { handheldPortait: BREAKPOINT } = metadata.device.maxWidth;

const fn = () => typeof window !== 'undefined'
    ? window.innerWidth <= BREAKPOINT
    : false;

export default fn;