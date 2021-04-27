import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { AuthenticationService } from '../core/authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  email: string;
  password: string;
  errorMessage: string;

  constructor(
    private auth: AuthenticationService,
    private navController: NavController,
  ) {}

  ngOnInit() {}

  async signIn() {
    try {
      this.errorMessage = '';
      await this.auth.login();
      this.navController.navigateRoot('/');
    } catch (err) {
      this.errorMessage = 'Login failed, please try again';
    }
  }
}
