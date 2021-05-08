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

  vaultTypes: Array<{
    label: string;
    type: 'SecureStorage' | 'DeviceSecurity' | 'CustomPasscode';
    deviceSecurityType: 'SystemPasscode' | 'Biometrics' | 'Both';
  }> = [];

  constructor(
    private authentication: AuthenticationService,
    private navController: NavController,
    private vault: VaultService,
  ) {}

  ngOnInit() {
    this.vaultTypes = this.vault.validVaultTypes();
    if (this.vaultTypes.length) {
      this.lockChange({ detail: { value: 0 } });
    }
  }

  lockChange(evt: { detail: { value: number } }) {
    const mode = this.vaultTypes[evt.detail.value];
    this.vault.setVaultType(mode);
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
