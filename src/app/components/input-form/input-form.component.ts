import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ModalService } from '../../services/modal.service';
import { Modal } from 'bootstrap';
import { FormControl } from '@angular/forms';
import { Observable, startWith, map, debounceTime, BehaviorSubject } from 'rxjs'; // <-- BehaviorSubject importálva
import { DataService } from 'src/app/services/data.service';
import { Station } from 'src/app/services/backend.service';

@Component({
  selector: 'app-input-form',
  templateUrl: './input-form.component.html',
  styleUrls: ['./input-form.component.css']
})
export class InputFormComponent implements OnInit {
  modalTitle: string = '';
  isStationSearch: boolean = false;

  stationControl = new FormControl('');
  trainNumberControl = new FormControl('');
  dateControl = new FormControl('');

  allStations: Station[] = [];
  
  // VÁLTOZÁS: Létrehozunk egy BehaviorSubject-et, ami a szűrt állomásokat tárolja.
  // Ez nagyobb kontrollt ad nekünk a lista tartalmának frissítésére.
  filteredStations$ = new BehaviorSubject<Station[]>([]);

  errorMessage: string = '';
  @Output() formSubmitted = new EventEmitter<{ title: string, value1: string, value2: string }>();
  private modalInstance: Modal | undefined;

  constructor(private modalService: ModalService, private dataService: DataService) { }

  ngOnInit(): void {
    const modalElement = document.getElementById('inputFormModal');
    if (modalElement) {
      this.modalInstance = new Modal(modalElement);
    }

    // A valueChanges logikát áthelyezzük ide a háttérbe.
    // Feliratkozunk a beviteli mező változásaira...
    this.stationControl.valueChanges.pipe(
      startWith(''),
      debounceTime(200),
      map(value => this._filterStations(value || '')),
    ).subscribe(stations => {
      // ...és a szűrt eredményt beletöltjük a BehaviorSubject-be.
      // A template már csak a BehaviorSubject-et fogja figyelni.
      this.filteredStations$.next(stations);
    });

    this.modalService.modalState$.subscribe(state => {
      this.resetForm();
      this.modalTitle = state.title;
      this.isStationSearch = state.title === 'Állomásinformáció';

      if (this.isStationSearch) {
        this.dataService.stations$.subscribe(stations => {
          this.allStations = stations;
        });
      }
      this.modalInstance?.show();
    });
  }

  private _filterStations(value: string): Station[] {
    const filterValue = value.toLowerCase();
    if (!filterValue) {
      return [];
    }
    return this.allStations
      .filter(station => station.name.toLowerCase().includes(filterValue))
      .slice(0, 10);
  }
  
  private resetForm(): void {
    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0];
    this.stationControl.setValue('');
    this.trainNumberControl.setValue('');
    this.dateControl.setValue(formattedDate);
    this.errorMessage = '';
  }

  // VÁLTOZÁS: A metódus most már el tudja tüntetni a listát.
  selectStation(stationName: string): void {
    // Beállítjuk az input mező értékét anélkül, hogy a valueChanges eseményt újra kiváltanánk.
    this.stationControl.setValue(stationName, { emitEvent: false });
    // Manuálisan egy üres tömböt küldünk a BehaviorSubject-nek, ami elrejti a találati listát.
    this.filteredStations$.next([]);
  }

  onSubmit(): void {
    // ... a metódus többi része változatlan ...
    const value1 = this.isStationSearch ? this.stationControl.value : this.trainNumberControl.value;
    const dateObject = this.dateControl.value ? new Date(this.dateControl.value) : new Date();
    const value2 = this.formatDate(dateObject);

    if (!value1) {
      this.errorMessage = 'A mező kitöltése kötelező!';
      return;
    }

    this.formSubmitted.emit({
      title: this.modalTitle,
      value1: value1 || '',
      value2: value2
    });

    this.modalInstance?.hide();
  }

  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}