import { Command } from 'commander';
import { Action } from '../actions/action';

export abstract class AbstractCommand<T extends Action> {
  constructor(protected action: T) {}

  public abstract load(program: Command): void;
}
