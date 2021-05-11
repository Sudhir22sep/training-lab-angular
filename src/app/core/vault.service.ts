import { Injectable } from '@angular/core';
import { Vault } from '@ionic-enterprise/identity-vault';
import { Platform } from '@ionic/angular';
import { Session } from '../models';
import { BrowserVault } from './browser-vault';

export interface VaultType {
  label: string;
  type: 'SecureStorage' | 'DeviceSecurity' | 'CustomPasscode';
  deviceSecurityType: 'SystemPasscode' | 'Biometrics' | 'Both';
}

@Injectable({
  providedIn: 'root',
})
export class VaultService {
  private key = 'session';
  private vault: Vault | BrowserVault;

  constructor(private platform: Platform) {
    this.vault = this.platform.is('hybrid')
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

    this.vault.onLock(() => this.handleVaultLocked());
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

  async lockSession(): Promise<void> {
    return this.vault.lock();
  }

  validVaultTypes(): Array<VaultType> {
    return this.platform.is('hybrid')
      ? this.validMobileVaultTypes()
      : this.validWebVaultTypes();
  }

  setVaultType(type: VaultType): Promise<void> {
    return this.vault.updateConfig({
      ...this.vault.config,
      type: type.type,
      deviceSecurityType: type.deviceSecurityType,
    });
  }

  private handleVaultLocked() {
    alert('You are now locked out of the vault!!');
  }

  private validMobileVaultTypes(): Array<VaultType> {
    return [
      {
        label: 'System PIN Unlock',
        type: 'DeviceSecurity',
        deviceSecurityType: 'SystemPasscode',
      },
      {
        label: 'Biometric Unlock',
        type: 'DeviceSecurity',
        deviceSecurityType: 'Biometrics',
      },
      {
        label: 'Biometric Unlock (System PIN Fallback)',
        type: 'DeviceSecurity',
        deviceSecurityType: 'Both',
      },
      {
        label: 'Never Lock Session',
        type: 'SecureStorage',
        deviceSecurityType: 'Both',
      },
    ];
  }

  private validWebVaultTypes(): Array<VaultType> {
    return [];
  }
}
