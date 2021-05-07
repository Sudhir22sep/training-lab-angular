import { Injectable } from '@angular/core';
import { Vault } from '@ionic-enterprise/identity-vault';
import { Platform } from '@ionic/angular';
import { Session } from '../models';
import { BrowserVault } from './browser-vault';

@Injectable({
  providedIn: 'root',
})
export class VaultService {
  private key = 'session';
  private vault: Vault | BrowserVault;

  constructor(platform: Platform) {
    this.vault = platform.is('hybrid')
      ? new Vault({
          key: 'io.ionic.traininglabng',
          type: 'SecureStorage',
          deviceSecurityType: 'Both',
          lockAfterBackgrounded: 2000,
          shouldClearVaultAfterTooManyFailedAttempts: true,
          customPasscodeInvalidUnlockAttempts: 2,
          unlockVaultOnLoad: false,
        })
      : new BrowserVault();
  }

  async setSession(session: Session): Promise<void> {
    return this.vault.setValue(this.key, session);
  }

  async getSession(): Promise<Session> {
    return this.vault.getValue(this.key);
  }

  async clearSession(): Promise<void> {
    return this.vault.clear();
  }

  setVaultType(
    type: 'SecureStorage' | 'DeviceSecurity' | 'CustomPasscode',
    deviceSecurityType?: 'SystemPasscode' | 'Biometrics' | 'Both' | undefined,
  ): Promise<void> {
    return this.vault.updateConfig({
      ...this.vault.config,
      type,
      deviceSecurityType,
    });
  }
}
