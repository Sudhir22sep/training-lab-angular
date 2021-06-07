import { Component } from '@angular/core';
import { Device } from '@ionic-enterprise/identity-vault';
import { NavController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuthenticationService } from '../core/authentication.service';
import { VaultService } from '../core/vault.service';
import { User } from '../models';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
})
export class Tab1Page {
  currentUser: User;

  biometricsEnabled: boolean;
  biometricsSupported: boolean;
  lockedOut: boolean;
  privacyScreenEnabled: boolean;
  systemPasscodeSet: boolean;

  lockStatus$: Observable<string> = this.vault.lockStatus;

  constructor(
    private authentication: AuthenticationService,
    private navController: NavController,
    private vault: VaultService,
  ) {}

  async ionViewWillEnter() {
    const session = await this.vault.getSession();
    this.currentUser = session?.user;
    this.biometricsEnabled = await Device.isBiometricsEnabled();
    this.biometricsSupported = await Device.isBiometricsSupported();
    this.lockedOut = await Device.isLockedOutOfBiometrics();
    this.privacyScreenEnabled = await Device.isHideScreenOnBackgroundEnabled();
    this.systemPasscodeSet = await Device.isSystemPasscodeSet();
  }

  logout() {
    this.authentication
      .logout()
      .pipe(
        tap(() => {
          this.vault.clearSession();
          this.navController.navigateRoot(['/', 'login']);
        }),
      )
      .subscribe();
  }
}
