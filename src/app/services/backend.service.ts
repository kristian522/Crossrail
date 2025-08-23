import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// Javasolt típusdefiníciók a kérésekhez és válaszokhoz.
// Ezek segítenek elkerülni a gépelési hibákat a kódban.
export interface Station {
  code: string;
  name: string;
  // ...esetleges további állomás adatok
}

export interface StationInfoRequest {
  type: string;
  stationNumberCode: string;
  travelDate: string;
  minCount: string;
  maxCount: string;
  language: string;
}

// ÚJ/MÓDOSÍTOTT INTERFACE a vonatinfó kéréshez
export interface TrainInfoRequest {
  type: "TrainInfo";
  trainNumber: string;
  travelDate: string; // YYYY-MM-DDTHH:mm:ss.sssZ formátum
  minCount: string;
  maxCount: string;
  language: string;
}

@Injectable({
  providedIn: 'root'
})
export class BackendService {

  // A Raspberry Pi-on futó szerver címe.
  private serverUrl = 'http://62.201.95.91:3000';

  constructor(private http: HttpClient) { }

  /**
   * Lekéri az összes állomás listáját a szervertől.
   * @returns Observable, ami egy Station objektumokból álló tömböt tartalmaz.
   */
  getStations(): Observable<Station[]> {
    return this.http.post<Station[]>(`${this.serverUrl}/api/stations`, {});
  }

  /**
   * Lekéri egy adott állomás menetrendjét.
   * @param requestBody Az állomás és a dátum adatai.
   * @returns Observable a menetrendi adatokkal.
   */
  getStationInfo(requestBody: StationInfoRequest): Observable<any> {
    return this.http.post<any>(`${this.serverUrl}/api/stationInfo`, requestBody);
  }

  /**
 * Lekéri egy konkrét vonat részletes adatait.
 * @param requestBody A vonat száma és a dátum.
 */
  getTrainInfo(requestBody: TrainInfoRequest): Observable<any> {
    return this.http.post<any>(`${this.serverUrl}/api/trainInfo`, requestBody);
  }

}