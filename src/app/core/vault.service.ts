import { Injectable } from '@angular/core';
import { Device, Vault } from '@ionic-enterprise/identity-vault';
import { ModalController, Platform } from '@ionic/angular';
import { BehaviorSubject, Observable } from 'rxjs';
import { Session } from '../models';
import { PinDialogComponent } from '../pin-dialog/pin-dialog.component';
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

  private lockStatusSubject = new BehaviorSubject('Unknown');
  get lockStatus(): Observable<string> {
    return this._lockStatus.asObservable();
  }

  constructor(
    private modalController: ModalController,
    private platform: Platform,
  ) {
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

    this.initializeEventHandlers();
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

  validVaultTypes(): Promise<Array<VaultType>> {
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

  private async getPasscode(isPasscodeSetRequest: boolean): Promise<string> {
    const dlg = await this.modalController.create({
      backdropDismiss: false,
      component: PinDialogComponent,
      componentProps: {
        setPasscodeMode: isPasscodeSetRequest,
      },
    });
    dlg.present();
    const { data } = await dlg.onDidDismiss();
    return data || '';
  }

  private initializeEventHandlers() {
    this.vault.onPasscodeRequested(async (isPasscodeSetRequest: boolean) => {
      const p = await this.getPasscode(isPasscodeSetRequest);
      return this.vault.setCustomPasscode(p);
    });

    this.vault.onUnlock(() => this.lockStatusSubject.next('Unlocked'));

    this.vault.onLock(() => this.lockStatusSubject.next('Locked'));
  }

  private async validMobileVaultTypes(): Promise<Array<VaultType>> {
    const types: Array<VaultType> = [
      {
        label: 'Custom PIN Unlock',
        type: 'CustomPasscode',
        deviceSecurityType: 'Both',
      },
      {
        label: 'System PIN Unlock',
        type: 'DeviceSecurity',
        deviceSecurityType: 'SystemPasscode',
      },
    ];
    // if (await Device.isBiometricsEnabled()) {
    if (await Promise.resolve(true)) {
      types.push({
        label: 'Biometric Unlock',
        type: 'DeviceSecurity',
        deviceSecurityType: 'Biometrics',
      });
      types.push({
        label: 'Biometric Unlock (System PIN Fallback)',
        type: 'DeviceSecurity',
        deviceSecurityType: 'Both',
      });
    }
    types.push({
      label: 'Never Lock Session',
      type: 'SecureStorage',
      deviceSecurityType: 'Both',
    });
    return types;
  }

  private async validWebVaultTypes(): Promise<Array<VaultType>> {
    return [];
  }
}
