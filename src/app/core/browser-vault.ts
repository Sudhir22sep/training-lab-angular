import { Plugins } from '@capacitor/core';
import { VaultError } from '@ionic-enterprise/identity-vault';

export class BrowserVault {
  config: any = {};

  async doesVaultExist(): Promise<boolean> {
    return true;
  }

  clear(): Promise<void> {
    const { Storage } = Plugins; // eslint-disable-line @typescript-eslint/naming-convention
    return Storage.clear();
  }

  exportVault() {
    console.log('exporting the browser vault?');
  }

  importVault(data: { [key: string]: string }) {
    console.log('importing the browser vault?', data);
  }

  async isLocked(): Promise<boolean> {
    return false;
  }

  async getKeys(): Promise<Array<string>> {
    const { Storage } = Plugins; // eslint-disable-line @typescript-eslint/naming-convention
    return (await Storage.keys())?.keys;
  }

  async getValue(key: string): Promise<any | undefined> {
    const { Storage } = Plugins; // eslint-disable-line @typescript-eslint/naming-convention
    const value = (await Storage.get({ key }))?.value;
    if (value) {
      return JSON.parse(value);
    }
  }

  lock(): Promise<void> {
    return Promise.resolve();
  }

  removeValue(key: string): Promise<void> {
    const { Storage } = Plugins; // eslint-disable-line @typescript-eslint/naming-convention
    return Storage.remove({ key });
  }

  setCustomPasscode(passcode: string): Promise<void> {
    console.log('should not set passcode on a browser vault');
    return Promise.resolve();
  }

  setValue(key: string, value: any): Promise<void> {
    const { Storage } = Plugins; // eslint-disable-line @typescript-eslint/naming-convention
    return Storage.set({ key, value: JSON.stringify(value) });
  }

  onConfigChanged(callback: (config: any) => void) {}

  onError(callback: (err: VaultError) => void) {}

  onLock(callback: () => void) {}

  onPasscodeRequested(
    callback: (isPasscodeSetRequest: boolean) => Promise<void>,
  ) {}

  onUnlock(callback: () => void) {}

  unlock(): Promise<void> {
    return Promise.resolve();
  }

  async updateConfig(config: any): Promise<void> {
    console.log('update config?', config);
  }
}
