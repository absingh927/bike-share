import { Action } from './types';

export type ReducerMap<TState> = { [actionId: string]: (state: TState, action: Action<any>) => TState };