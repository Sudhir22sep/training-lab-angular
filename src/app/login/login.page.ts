import { Component, OnInit } from '@angular/core';
import { AuthMode } from '@ionic-enterprise/identity-vault';
import { NavController, Platform } from '@ionic/angular';
import { AuthenticationService, VaultService } from '../core';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  email: string;
  password: string;

  authMode: AuthMode;
  authModes: Array<{ mode: AuthMode; label: string }> = [
    {
      mode: AuthMode.PasscodeOnly,
      label: 'Session PIN Unlock',
    },
    {
      mode: AuthMode.SecureStorage,
      label: 'Never Lock Session',
    },
    {
      mode: AuthMode.InMemoryOnly,
      label: 'Force Login',
    },
  ];
  displayLockingOptions: boolean;

  constructor(
    private authentication: AuthenticationService,
    private navController: NavController,
    private platform: Platform,
    private vault: VaultService,
  ) {}

  async ngOnInit() {
    this.displayLockingOptions = this.platform.is('hybrid');
    if (await this.vault.isBiometricsAvailable()) {
      this.authModes = [
        {
          mode: AuthMode.BiometricOnly,
          label: 'Biometric Unlock',
        },
        ...this.authModes,
      ];
    }
    this.authMode = this.authModes[0].mode;
  }

  signIn() {
    this.authentication.login(this.email, this.password).subscribe(session => {
      if (session) {
        this.vault.login(session, this.authMode);
        this.navController.navigateRoot('/');
      }
    });
  }
}
