import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { AuthenticationService } from '../core/authentication.service';
import { VaultService } from '../core/vault.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  email: string;
  password: string;

  authModes: Array<{
    label: string;
    type: 'SecureStorage' | 'DeviceSecurity' | 'CustomPasscode';
    deviceSecurityType: 'SystemPasscode' | 'Biometrics' | 'Both';
  }> = [
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

  constructor(
    private authentication: AuthenticationService,
    private navController: NavController,
    private vault: VaultService,
  ) {}

  ngOnInit() {}

  lockChange(evt: { detail: { value: number } }) {
    const mode = this.authModes[evt.detail.value];
    this.vault.setVaultType(mode.type, mode.deviceSecurityType);
  }

  signIn() {
    this.authentication.login(this.email, this.password).subscribe(session => {
      if (session) {
        this.vault.setSession(session);
        this.navController.navigateRoot('/');
      }
    });
  }
}
