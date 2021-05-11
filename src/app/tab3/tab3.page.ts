import { Component, OnInit } from '@angular/core';
import { VaultService, VaultType } from '../core';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
})
export class Tab3Page implements OnInit {
  vaultTypes: Array<VaultType> = [];

  constructor(private vault: VaultService) {}

  ngOnInit() {
    this.vaultTypes = this.vault.validVaultTypes();
  }

  lock() {
    this.vault.lockSession();
  }

  vaultTypeChanged(evt: { detail: { value: number } }) {
    const mode = this.vaultTypes[evt.detail.value];
    this.vault.setVaultType(mode);
  }
}
