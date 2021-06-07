import { Component, OnInit } from '@angular/core';
import { Device } from '@ionic-enterprise/identity-vault';
import { Observable } from 'rxjs';
import { VaultService, VaultType } from '../core';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
})
export class Tab3Page implements OnInit {
  vaultTypes: Array<VaultType> = [];
  privacyScreen: boolean;

  lockStatus$: Observable<string> = this.vault.lockStatus;

  constructor(private vault: VaultService) {}

  async ngOnInit() {
    this.vaultTypes = await this.vault.validVaultTypes();
    this.privacyScreen = await Device.isHideScreenOnBackgroundEnabled();
  }

  lock() {
    this.vault.lockSession();
  }

  async toggle() {
    await Device.setHideScreenOnBackground(!this.privacyScreen);
    this.privacyScreen = await Device.isHideScreenOnBackgroundEnabled();
  }

  vaultTypeChanged(evt: { detail: { value: number } }) {
    const mode = this.vaultTypes[evt.detail.value];
    this.vault.setVaultType(mode);
  }
}
