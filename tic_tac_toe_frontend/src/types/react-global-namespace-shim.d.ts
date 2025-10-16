declare global {
  namespace React {
    type ReactNode = any;
    interface MutableRefObject<T> { current: T | null; }
    type Ref<T> = ((instance: T | null) => void) | MutableRefObject<T> | null;

    interface SyntheticEvent<T = Element, E = Event> {
      nativeEvent: E;
      currentTarget: T;
      target: T;
      preventDefault(): void;
      stopPropagation(): void;
    }

    interface KeyboardEvent<T = Element> extends SyntheticEvent<T, any> {
      altKey: boolean;
      ctrlKey: boolean;
      shiftKey: boolean;
      metaKey: boolean;
      key: string;
    }
  }
}
export {};
