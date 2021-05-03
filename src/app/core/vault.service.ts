import { Injectable } from '@angular/core';
import { Vault } from '@ionic-enterprise/identity-vault';
import { Session } from '../models';

@Injectable({
  providedIn: 'root',
})
export class VaultService {
  private key = 'session';
  private vault: Vault;

  constructor() {
    this.vault = new Vault({
      key: 'io.ionic.traininglabng',
      type: 'SecureStorage',
      deviceSecurityType: 'Both',
      lockAfterBackgrounded: 2000,
      shouldClearVaultAfterTooManyFailedAttempts: true,
      customPasscodeInvalidUnlockAttempts: 2,
      unlockVaultOnLoad: false,
    });
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
    console.log('setting vault type', { type, deviceSecurityType });
    return this.vault.updateConfig({
      ...this.vault.config,
      type,
      deviceSecurityType,
    });
  }
}
