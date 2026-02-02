import type {
    SelectorMap,
    State,
    Store
} from '@webkrafters/eagleeye';

import {
    ElementType,
    FC,
    NamedExoticComponent
} from 'react';

import { createEagleEye } from './main';

export interface ConnectProps<
	T extends State = State,
	S extends SelectorMap = SelectorMap
>{
	store : Store<T, S>;
}

export type OwnPropsOf<P extends {}> = Omit<P, 'store'>;

export interface StreamAdapter<T extends State = State>{
	<S extends SelectorMap>(selectorMap? : S) : <
		P extends ConnectProps<T, S>
	>(WrappedComponent: ElementType<P>) => FC<OwnPropsOf<P>>;
	<S extends SelectorMap>(selectorMap? : S) : <
		P extends ConnectProps<T, S>
	>(WrappedComponent: NamedExoticComponent<P>) => FC<OwnPropsOf<P>>;
}

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
    ContextInfra,
    Data,
    FullStateSelector,
    IStorage,
    IStore,
    Listener,
    LiveStore,
    ObjectSelector,
    Prehooks,
    ProviderProps,
    RawProviderProps,
    SelectorMap,
    State,
    Store,
    StoreRef,
    Text,
    Unsubscribe
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

export {
    createEagleEye,
    EagleEyeContext,
} from './main';

export default createEagleEye;
