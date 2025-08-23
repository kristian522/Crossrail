import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ModalService } from '../../services/modal.service';
import { Modal } from 'bootstrap'; // Importáljuk a Bootstrap Modal osztályát

@Component({
  selector: 'app-input-form',
  templateUrl: './input-form.component.html',
  styleUrls: ['./input-form.component.css']
})
export class InputFormComponent implements OnInit {
  modalTitle: string = '';
  inputPlaceholder1: string = '';
  inputPlaceholder2: string = '';
  inputValue1: string = '';
  inputValue2: string = '';
  errorMessage: string = ''; // Hibaüzenet tárolása

   @Output() formSubmitted = new EventEmitter<{ title: string, value1: string, value2: string }>();

  private modalInstance: Modal | undefined;

  constructor(private modalService: ModalService) { }

  ngOnInit(): void {
    const modalElement = document.getElementById('inputFormModal');
    if (modalElement) {
      this.modalInstance = new Modal(modalElement);
    }

    this.modalService.modalState$.subscribe(state => {
      this.modalTitle = state.title;
      this.inputPlaceholder1 = state.placeholder1;
      this.inputPlaceholder2 = state.placeholder2;
      this.modalInstance?.show();
    });
  }

  // A gombokhoz rendelt események (Mehet, Ellenőriz)

  onCheck(): void {
    // Bezárjuk a modalt a "Mehet" gombra kattintva
    console.log('onCheck() függvény hívása.');
    this.modalInstance?.hide();
  }

 onSubmit(): void {
    // Ezen a ponton kérjük le az input mezők adatait és dolgozzuk fel.
    const input1 = (document.querySelector('#inputFormModal input[type="text"]') as HTMLInputElement).value;
    const input2 = (document.querySelector('#inputFormModal input[type="date"]') as HTMLInputElement).value;

    // Validálás
    if (!input1) { // Elég csak az első mezőt ellenőrizni, a dátum lehet opcionális
      this.errorMessage = 'Az első mező kitöltése kötelező!';
      return;
    }

    this.formSubmitted.emit({
      title: this.modalTitle,
      value1: input1,
      value2: input2
    });

    this.modalInstance?.hide(); // Modal bezárása
  }
}
