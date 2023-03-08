export interface Action<T = any> {
  handle(input: T): Promise<void>;
}
