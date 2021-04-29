import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { AuthenticationService, VaultService } from '../core';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  email: string;
  password: string;

  constructor(
    private authentication: AuthenticationService,
    private navController: NavController,
    private vault: VaultService,
  ) {}

  ngOnInit() {}

  signIn() {
    this.authentication.login(this.email, this.password).subscribe(session => {
      if (session) {
        this.vault.login(session);
        this.navController.navigateRoot('/');
      }
    });
  }
}
