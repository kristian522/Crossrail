import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { BackendService, Station, StationInfoRequest, TrainInfoRequest } from './backend.service';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  // 1. Állapot tárolása BehaviorSubject-ekben
  // A BehaviorSubject egy speciális Observable, ami mindig tárolja az utolsó értéket.
  // Aki feliratkozik rá, azonnal megkapja a legfrissebb állapotot.

  // Az összes állomás listáját tárolja
  private readonly stationsSubject = new BehaviorSubject<Station[]>([]);
  // A komponensek ezen keresztül, "csak olvasható" módon érik el az állomásokat
  public readonly stations$: Observable<Station[]> = this.stationsSubject.asObservable();

  // A kiválasztott állomás induló menetrendjét tárolja
  private readonly departuresTimetableSubject = new BehaviorSubject<any[]>([]); // Egyelőre 'any', később típusosítjuk
  public readonly departuresTimetable$: Observable<any[]> = this.departuresTimetableSubject.asObservable();

  // A kiválasztott állomás érkező menetrendjét tárolja
  private readonly arrivalTimetableSubject = new BehaviorSubject<any[]>([]); // Egyelőre 'any', később típusosítjuk
  public readonly arrivalTimetable$: Observable<any[]> = this.arrivalTimetableSubject.asObservable();

  // A kiválasztott állomás információit tárolja
  private readonly stationInfoSubject = new BehaviorSubject<any[]>([]); // Egyelőre 'any', később típusosítjuk
  public readonly stationInfo$: Observable<any[]> = this.stationInfoSubject.asObservable();

  // A kiválasztott állomás szolgáltatásait tárolja
  private readonly stationServicesSubject = new BehaviorSubject<any[]>([]); // Egyelőre 'any', később típusosítjuk
  public readonly stationServices$: Observable<any[]> = this.stationServicesSubject.asObservable();

  // A konkrét vonat részletes adatait tárolja
  private readonly trainDetailsSubject = new BehaviorSubject<any>(null);
  public readonly trainDetails$ = this.trainDetailsSubject.asObservable();

  // A konkrét vonat részletes menetrendjét tárolja
  private readonly trainSchedulerSubject = new BehaviorSubject<any>(null);
  public readonly trainScheduler$ = this.trainSchedulerSubject.asObservable();

  // Segédváltozó, hogy az állomáslistát csak egyszer kérjük le
  private stationsLoaded = false;

  // Behívjuk a backend service-t, hogy tudjunk a szerverrel kommunikálni
  constructor(private backendService: BackendService) {
    this.loadAllStations(); // Az állomásokat töltsük be azonnal a szolgáltatás indulásakor
  }

  /**
   * Betölti az összes állomás listáját a szerverről, de csak ha még nem történt meg.
   * A tap operátorral "belesünk" a folyamatba és frissítjük a stationsSubject-et.
   */
  public loadAllStations(): void {
    if (this.stationsLoaded) {
      return; // Ha már be van töltve, nem csinálunk semmit
    }

    this.backendService.getStations().pipe(
      tap(stations => {
        // A kapott állomásokat betesszük a Subject-be
        console.log(stations);
        this.stationsSubject.next(stations);
        // Jelezzük, hogy a betöltés sikeres volt
        this.stationsLoaded = true;
        console.log(`${stations.length} állomás sikeresen betöltve a DataService-be.`);
      })
    ).subscribe(); // Feliratkozunk, hogy a kérés elinduljon
  }

  // ÚJ METÓDUS: név alapján keres menetrendet
  public fetchStationTimetableByName(stationName: string): void {
    // Megvárjuk, amíg betöltődnek az állomások
    this.stations$.subscribe(stations => {
      if (stations.length > 0) {
        const station = stations.find(s => s.name.toLowerCase() === stationName.toLowerCase());
        if (station) {
          this.fetchStationTimetableByCode(station.code); // Meghívjuk a kód alapú keresőt
        } else {
          console.error(`Nem található állomás ezzel a névvel: ${stationName}`);
          //this.arrivalTimetable$.next([]); // Ürítjük a menetrendet, ha nincs találat
        }
      }
    });
  }

  /**
   * Lekéri egy konkrét állomás menetrendjét a stationNumberCode alapján.
   * @param stationNumberCode Az állomás egyedi azonosító kódja (pl. "005510017")
   */
  public fetchStationTimetableByCode(stationNumberCode: string): void {
    const requestBody: StationInfoRequest = {
      type: "StationInfo",
      stationNumberCode: stationNumberCode,
      travelDate: new Date().toISOString(), // Az aktuális időpontot használjuk
      minCount: "0",
      maxCount: "50", // Elsőre elég 50 vonatot lekérni
      language: "hu"
    };

    this.backendService.getStationInfo(requestBody).pipe(
      tap(timetableData => {
        // Itt lehet a nyers adatot feldolgozni, mielőtt továbbadjuk.
        // A feldolgozott adatokat betesszük a Subject-be.
        this.departuresTimetableSubject.next(timetableData.stationSchedulerDetails.departureScheduler);
        this.arrivalTimetableSubject.next(timetableData.stationSchedulerDetails.arrivalScheduler);
        this.stationInfoSubject.next(timetableData.stationSchedulerDetails.station);
        this.stationServicesSubject.next(timetableData.stationSchedulerDetails.services);
        console.log(`Menetrend frissítve a(z) ${stationNumberCode} állomásra.`,this.arrivalTimetable$,this.departuresTimetable$, this.stationInfoSubject, this.stationServicesSubject);
      })
    ).subscribe();
  }

  // Vonatadatok lekérése
  public fetchTrainDetails(trainNumber: string, travelDate: string): void {
    const requestBody: TrainInfoRequest = {
      type: "TrainInfo",
      trainNumber: trainNumber.toString(),
      travelDate: new Date(travelDate).toISOString(), // Biztosítjuk az ISO formátumot
      minCount: "0",
      maxCount: "999",
      language: "hu"
    };

    this.backendService.getTrainInfo(requestBody).pipe(
      tap(trainData => {
        // A válasz valószínűleg egy objektum, ami egy 'trains' tömböt tartalmaz.
        // Mivel egy vonatot keresünk, annak az első elemét vesszük.
        this.trainDetailsSubject.next(trainData.trainSchedulerDetails[0].train);
        this.trainSchedulerSubject.next(trainData.trainSchedulerDetails[0].scheduler);
         console.log(`A vonatadatok frissítve a(z) ${trainNumber} sz. vonatra.`,this.trainDetails$,this.trainScheduler$,);
      })
    ).subscribe();
  }
}