import { Injectable } from '@angular/core';
import { Session } from '../models';

@Injectable({
  providedIn: 'root',
})
export class VaultService {
  private session: Session;

  constructor() {}

  async setSession(session: Session): Promise<void> {
    this.session = session;
  }

  async getSession(): Promise<Session> {
    return this.session;
  }

  async clearSession(): Promise<void> {
    this.session = null;
  }
}
