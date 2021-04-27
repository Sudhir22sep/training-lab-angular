import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';
import { AuthenticationService } from '../core/authentication.service';
import { User } from '../models';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
})
export class Tab1Page {
  currentUser: User;

  constructor(
    private auth: AuthenticationService,
    private navController: NavController,
  ) {}

  async ionViewWillEnter() {
    this.currentUser = await this.auth.getUserInfo();
  }

  async logout() {
    await this.auth.logout();
    this.navController.navigateRoot(['/', 'login']);
  }
}
