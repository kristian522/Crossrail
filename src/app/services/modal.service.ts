import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  private modalState = new Subject<{ title: string, placeholder1: string, placeholder2: string }>();
  modalState$ = this.modalState.asObservable();

  openModal(title: string, placeholder1: string, placeholder2: string): void {
    this.modalState.next({ title, placeholder1, placeholder2 });
  }
}