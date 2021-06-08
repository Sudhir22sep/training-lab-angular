import { Injectable } from '@angular/core';
import { Device, Vault } from '@ionic-enterprise/identity-vault';
import { ModalController, Platform } from '@ionic/angular';
import { BehaviorSubject, Observable } from 'rxjs';
import { Session } from '../models';
import { PinDialogComponent } from '../pin-dialog/pin-dialog.component';
import { BrowserVault } from './browser-vault';
import { Storage } from '@capacitor/storage';

export type VaultType = 'SecureStorage' | 'DeviceSecurity' | 'CustomPasscode';
export type DeviceSecurityType = 'SystemPasscode' | 'Biometrics' | 'Both';

export interface SecurityType {
  label: string;
  vaultType: VaultType;
  deviceSecurityType: DeviceSecurityType;
}

@Injectable({
  providedIn: 'root',
})
export class VaultService {
  private key = 'session';
  private vaultTypeKey = 'vaultType';
  private vaultDeviceSecurityTypeKey = 'vaultDeviceSecurityType';

  private vault: Vault | BrowserVault;
  private vaultReady: Promise<void>;

  private lockStatusSubject = new BehaviorSubject('Unknown');
  get lockStatus(): Observable<string> {
    return this.lockStatusSubject.asObservable();
  }

  constructor(
    private modalController: ModalController,
    private platform: Platform,
  ) {
    this.vaultReady = this.initializeVault();
  }

  async setSession(session: Session): Promise<void> {
    await this.vaultReady;
    return this.vault.setValue(this.key, session);
  }

  async getSession(): Promise<Session> {
    await this.vaultReady;
    return this.vault.getValue(this.key);
  }

  async clearSession(): Promise<void> {
    await this.vaultReady;
    return this.vault.clear();
  }

  async lockSession(): Promise<void> {
    await this.vaultReady;
    return this.vault.lock();
  }

  validSecurityTypes(): Promise<Array<SecurityType>> {
    return this.platform.is('hybrid')
      ? this.validMobileSecurityTypes()
      : this.validWebSecurityTypes();
  }

  async setSecurityType(securityType: SecurityType): Promise<void> {
    await this.vaultReady;
    this.setVaultType(securityType.vaultType);
    this.setDeviceSecurityType(securityType.deviceSecurityType);
    return this.vault.updateConfig({
      ...this.vault.config,
      type: securityType.vaultType,
      deviceSecurityType: securityType.deviceSecurityType,
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

  private async initializeVault(): Promise<void> {
    return new Promise<void>(async resolve => {
      const type = await this.getVaultType();
      const deviceSecurityType = await this.getDeviceSecurityType();
      this.vault = this.platform.is('hybrid')
        ? new Vault({
            key: 'io.ionic.traininglabng',
            type,
            deviceSecurityType,
            lockAfterBackgrounded: 2000,
            shouldClearVaultAfterTooManyFailedAttempts: true,
            customPasscodeInvalidUnlockAttempts: 2,
            unlockVaultOnLoad: false,
          })
        : new BrowserVault();
      this.vault.onPasscodeRequested(async (isPasscodeSetRequest: boolean) => {
        const p = await this.getPasscode(isPasscodeSetRequest);
        return this.vault.setCustomPasscode(p);
      });
      this.vault.onUnlock(() => this.lockStatusSubject.next('Unlocked'));
      this.vault.onLock(() => this.lockStatusSubject.next('Locked'));
      resolve();
    });
  }

  private async getVaultType(): Promise<VaultType> {
    const stored = await Storage.get({ key: this.vaultTypeKey });
    switch (stored?.value) {
      case 'SecureStorage':
        return 'SecureStorage';
      case 'DeviceSecurity':
        return 'DeviceSecurity';
      case 'CustomPasscode':
        return 'CustomPasscode';

      default:
        return 'SecureStorage';
    }
  }

  private setVaultType(value: VaultType): Promise<void> {
    return Storage.set({ key: this.vaultTypeKey, value });
  }

  private async getDeviceSecurityType(): Promise<DeviceSecurityType> {
    const stored = await Storage.get({ key: this.vaultDeviceSecurityTypeKey });
    switch (stored?.value) {
      case 'SystemPasscode':
        return 'SystemPasscode';
      case 'Biometrics':
        return 'Biometrics';
      case 'Both':
        return 'Both';

      default:
        return 'Both';
    }
  }

  private setDeviceSecurityType(value: DeviceSecurityType): Promise<void> {
    return Storage.set({ key: this.vaultDeviceSecurityTypeKey, value });
  }

  private async validMobileSecurityTypes(): Promise<Array<SecurityType>> {
    const types: Array<SecurityType> = [
      {
        label: 'Custom PIN Unlock',
        vaultType: 'CustomPasscode',
        deviceSecurityType: 'Both',
      },
      {
        label: 'System PIN Unlock',
        vaultType: 'DeviceSecurity',
        deviceSecurityType: 'SystemPasscode',
      },
    ];
    if (await Device.isBiometricsEnabled()) {
      types.push({
        label: 'Biometric Unlock',
        vaultType: 'DeviceSecurity',
        deviceSecurityType: 'Biometrics',
      });
      types.push({
        label: 'Biometric Unlock (System PIN Fallback)',
        vaultType: 'DeviceSecurity',
        deviceSecurityType: 'Both',
      });
    }
    types.push({
      label: 'Never Lock Session',
      vaultType: 'SecureStorage',
      deviceSecurityType: 'Both',
    });
    return types;
  }

  private async validWebSecurityTypes(): Promise<Array<SecurityType>> {
    return [];
  }
}
