/**
 * Minimal IndexedDB wrapper for storing user-provided soundscape audio files.
 * We store Blobs so users can bring high-quality recordings without relying on CDNs.
 */

export type CustomSoundAsset = {
  soundId: string;
  fileName: string;
  mimeType: string;
  blob: Blob;
  updatedAt: number;
};

const DB_NAME = "phoenix_soundscapes";
const DB_VERSION = 1;
const STORE = "assets";

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);

    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE)) {
        db.createObjectStore(STORE, { keyPath: "soundId" });
      }
    };

    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export async function getCustomSound(soundId: string): Promise<CustomSoundAsset | null> {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, "readonly");
    const store = tx.objectStore(STORE);
    const req = store.get(soundId);
    req.onsuccess = () => resolve((req.result as CustomSoundAsset) ?? null);
    req.onerror = () => reject(req.error);
  });
}

export async function listCustomSounds(): Promise<CustomSoundAsset[]> {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, "readonly");
    const store = tx.objectStore(STORE);
    const req = store.getAll();
    req.onsuccess = () => resolve((req.result as CustomSoundAsset[]) ?? []);
    req.onerror = () => reject(req.error);
  });
}

export async function setCustomSound(asset: Omit<CustomSoundAsset, "updatedAt">): Promise<void> {
  const db = await openDb();
  const record: CustomSoundAsset = { ...asset, updatedAt: Date.now() };

  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, "readwrite");
    const store = tx.objectStore(STORE);
    const req = store.put(record);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
}

export async function deleteCustomSound(soundId: string): Promise<void> {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, "readwrite");
    const store = tx.objectStore(STORE);
    const req = store.delete(soundId);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
}
