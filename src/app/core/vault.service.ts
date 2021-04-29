import { Injectable } from '@angular/core';
import {
  IonicIdentityVaultUser,
  AuthMode,
  IonicNativeAuthPlugin,
} from '@ionic-enterprise/identity-vault';
import { ModalController, NavController, Platform } from '@ionic/angular';
import { Session } from '../models';
import { PinDialogComponent } from '../pin-dialog/pin-dialog.component';
import { BrowserVaultPlugin } from './browser-vault.plugin';

@Injectable({
  providedIn: 'root',
})
export class VaultService extends IonicIdentityVaultUser<Session> {
  private currentSession: Session | undefined;

  constructor(
    private browserVaultPlugin: BrowserVaultPlugin,
    private modalController: ModalController,
    private navController: NavController,
    platform: Platform,
  ) {
    super(platform, {
      unlockOnAccess: true,
      hideScreenOnBackground: true,
      lockAfter: 5000,
    });
  }

  login(session: Session, mode?: AuthMode): Promise<void> {
    this.currentSession = session;
    return super.login(session, mode);
  }

  async restoreSession(): Promise<Session | undefined> {
    return this.currentSession || super.restoreSession();
  }

  onVaultLocked() {
    this.currentSession = undefined;
    this.navController.navigateRoot(['/', 'tabs', 'tab3']);
  }

  onSessionRestored(session: Session) {
    this.currentSession = session;
  }

  async onPasscodeRequest(isPasscodeSetRequest: boolean): Promise<string> {
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

  getPlugin(): IonicNativeAuthPlugin {
    if ((this.platform as Platform).is('hybrid')) {
      return super.getPlugin();
    }
    return this.browserVaultPlugin;
  }
}
