import { Injectable } from '@angular/core';
import {
  IonicIdentityVaultUser,
  AuthMode,
  IonicNativeAuthPlugin,
} from '@ionic-enterprise/identity-vault';
import { NavController, Platform } from '@ionic/angular';
import { Session } from '../models';
import { BrowserVaultPlugin } from './browser-vault.plugin';

@Injectable({
  providedIn: 'root',
})
export class VaultService extends IonicIdentityVaultUser<Session> {
  private currentSession: Session | undefined;

  constructor(
    private browserVaultPlugin: BrowserVaultPlugin,
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

  getPlugin(): IonicNativeAuthPlugin {
    if ((this.platform as Platform).is('hybrid')) {
      return super.getPlugin();
    }
    return this.browserVaultPlugin;
  }
}
