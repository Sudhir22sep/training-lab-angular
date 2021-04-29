import { Injectable } from '@angular/core';
import { Session } from '../models';

@Injectable({
  providedIn: 'root',
})
export class VaultService {
  private session: Session;

  constructor() {}

  async login(session: Session): Promise<void> {
    this.session = session;
  }

  async restoreSession(): Promise<Session> {
    return this.session;
  }

  async logout(): Promise<void> {
    this.session = null;
  }
}
