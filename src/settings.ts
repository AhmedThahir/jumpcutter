export interface Settings {
  volumeThreshold: number,
  silenceSpeed: number,
  soundedSpeed: number,
  enabled: boolean,
  enableExperimentalFeatures: boolean,
  marginBefore: number,
  marginAfter: number,
}

export const defaultSettings: Settings = {
  volumeThreshold: 0.010,
  silenceSpeed: 4,
  soundedSpeed: 1.5,
  enabled: true,
  enableExperimentalFeatures: false,
  marginBefore: 0.100,
  marginAfter: 0.100,
};

// https://developer.chrome.com/apps/storage#property-onChanged-changes
export type MyStorageChanges = {
  [P in keyof Settings]?: {
    newValue?: Settings[P],
    oldValue?: Settings[P],
  }
};

const storage = chrome.storage.local;

export async function getSettings(): Promise<Settings> {
  return new Promise(r => storage.get(defaultSettings, r as any))
}
export async function setSettings(items: Partial<Settings>): Promise<void> {
  return new Promise(r => storage.set(items, r));
}
type MyOnChangedListener = (changes: MyStorageChanges) => void;
type NativeOnChangedListener = Parameters<typeof chrome.storage.onChanged.addListener>[0];
const srcListenerToWrapperListener = new WeakMap<MyOnChangedListener, NativeOnChangedListener>();
/**
 * This is a wrapper around the native `chrome.storage.onChanged.addListener`. The reason we need this is so listeners
 * attached using it only react to changes in `local` storage, but not `sync` (or others). See `src/background.ts`.
 */
export function addOnChangedListener(listener: MyOnChangedListener): void {
  const actualListener: NativeOnChangedListener = (changes, areaName) => {
    if (areaName !== 'local') return;
    listener(changes);
  };
  srcListenerToWrapperListener.set(listener, actualListener);
  chrome.storage.onChanged.addListener(actualListener);
}
export function removeOnChangedListener(listener: MyOnChangedListener): void {
  const actualListener = srcListenerToWrapperListener.get(listener);
  if (!actualListener) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn('Did not remove listener because it\'s already not attached');
    }
    return;
  }
  chrome.storage.onChanged.removeListener(actualListener);
}
