import { Component } from '@angular/core';
import { ModalService } from '../../services/modal.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  menuItems = [
    { name: 'Vonatinformáció' },
    { name: 'Állomásinformáció' },
    { name: 'eVTK' },
    { name: 'Utastájékoztatás' },
    { name: 'Utasszámlálás' },
    { name: 'Ellenőrzés' }
  ];

  constructor(private modalService: ModalService) { }

  hoveredIndex: number | null = null;

  navigateTo(item: any): void {
    let title = '';
    let placeholder1 = '';
    let placeholder2 = '';

    switch (item.name) {
      case 'Vonatinformáció':
        title = 'Vonatinformáció';
        placeholder1 = 'Vonatszám';
        placeholder2 = 'Dátum';
        break;
      case 'Állomásinformáció':
        title = 'Állomásinformáció';
        placeholder1 = 'Állomásnév';
        placeholder2 = 'Dátum';
        break;
      // További menüpontokhoz
      default:
        return;
    }
    this.modalService.openModal(item.name, '', '');
  }

  onHover(index: number): void {
    this.hoveredIndex = index;
  }

  onLeave(): void {
    this.hoveredIndex = null;
  }
}