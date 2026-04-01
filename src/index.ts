import type {
    ComponentType,
    NamedExoticComponent
} from 'react';

export type {
    BaseType,
    ClearCommand,
    KeyType,
    MoveCommand,
    PushCommand,
    ReplaceCommand,
    SetCommand,
    SpliceCommand,
    TagCommand,
    TagType,
    UpdateStats,
    UpdatePayload,
    UpdatePayloadArray
} from '@webkrafters/auto-immutable';

export type {
    ArraySelector,
    Changes,
    Channel,
    Data,
    FullStateSelector,
    IStorage,
    IStore,
    Listener,
    ObjectSelector,
    Prehooks,
    ProviderProps,
    SelectorMap,
    State,
    Store,
    StoreInternal,
    StoreRef,
    Stream,
    Text,
    Unsubscribe
} from '@webkrafters/eagleeye';

import {
    SelectorMap,
    State,
    Store
} from '@webkrafters/eagleeye';

export {
    CLEAR_TAG,
    DELETE_TAG,
    FULL_STATE_SELECTOR,
    MOVE_TAG,
    NULL_SELECTOR,
    PUSH_TAG,
    REPLACE_TAG,
    SET_TAG,
    SPLICE_TAG,
    Tag,
} from '@webkrafters/eagleeye';

type InjectedProps<
    STATE extends State = State,
    SELECTOR_MAP extends SelectorMap = SelectorMap
> = { [K in keyof Store<STATE, SELECTOR_MAP>]: Store<STATE, SELECTOR_MAP>[K] };

export type ConnectProps<
    OWNPROPS extends OwnProps = IProps,
    STATE extends State = State,
    SELECTOR_MAP extends SelectorMap = SelectorMap
> = InjectedProps<STATE, SELECTOR_MAP>
    & Omit<OWNPROPS, keyof InjectedProps<STATE, SELECTOR_MAP>>;

export type ExtractInjectedProps<
    STATE extends State = State,
    SELECTOR_MAP extends SelectorMap = SelectorMap,
    ALL_PROPS extends OwnProps = OwnProps
> = Omit<ALL_PROPS, keyof InjectedProps<STATE, SELECTOR_MAP>>

export interface IProps {}

export type OwnProps = IProps & Record<any, any>;

export { createContext as createEagleEye } from './main';
