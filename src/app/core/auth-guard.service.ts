import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { NavController } from '@ionic/angular';
import { VaultService } from './vault.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuardService implements CanActivate {
  constructor(
    private navController: NavController,
    private vault: VaultService,
  ) {}

  async canActivate(): Promise<boolean> {
    const isLoggedIn = !!(await this.vault.restoreSession());
    if (!isLoggedIn) {
      this.navController.navigateRoot(['/', 'login']);
    }
    return isLoggedIn;
  }
}
