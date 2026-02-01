import type { GatsbyLinkProps } from 'gatsby';

type AnchorProps = Omit<JSX.IntrinsicElements[ "a" ], "href">

export interface Props<TState extends AnchorProps = AnchorProps> extends React.PropsWithoutRef<GatsbyLinkProps<TState>>{
    hideIcon?: boolean
};