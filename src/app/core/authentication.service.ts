import { Injectable } from '@angular/core';
import { IonicAuth } from '@ionic-enterprise/auth';
import { Platform } from '@ionic/angular';
import { mobileAuthConfig, webAuthConfig } from 'src/environments/environment';
import { User } from '../models';
import { VaultService } from './vault.service';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService extends IonicAuth {
  constructor(platform: Platform, vault: VaultService) {
    const config = platform.is('hybrid') ? mobileAuthConfig : webAuthConfig;
    config.tokenStorageProvider = vault;
    super(config);
  }

  async getUserInfo(): Promise<User | undefined> {
    const idToken = await this.getIdToken();
    if (!idToken) {
      return;
    }

    let email = idToken.email;
    if (idToken.emails instanceof Array) {
      email = idToken.emails[0];
    }

    return {
      id: idToken.sub,
      email,
      firstName: idToken.given_name,
      lastName: idToken.family_name,
    };
  }
}
