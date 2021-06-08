import { Component, OnInit } from '@angular/core';
import { Device } from '@ionic-enterprise/identity-vault';
import { Observable } from 'rxjs';
import { VaultService, SecurityType } from '../core';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
})
export class Tab3Page implements OnInit {
  securityTypes: Array<SecurityType> = [];
  privacyScreen: boolean;

  lockStatus$: Observable<string> = this.vault.lockStatus;

  constructor(private vault: VaultService) {}

  async ngOnInit() {
    this.securityTypes = await this.vault.validSecurityTypes();
    this.privacyScreen = await Device.isHideScreenOnBackgroundEnabled();
  }

  lock() {
    this.vault.lockSession();
  }

  async toggle() {
    await Device.setHideScreenOnBackground(!this.privacyScreen);
    this.privacyScreen = await Device.isHideScreenOnBackgroundEnabled();
  }

  securityTypeChanged(evt: { detail: { value: number } }) {
    const mode = this.securityTypes[evt.detail.value];
    this.vault.setSecurityType(mode);
  }
}
