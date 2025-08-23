import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { StationTimetableComponent } from './components/station-timetable/station-timetable.component';
import { TrainDetailsComponent } from './components/train-info/train-info.component';

const routes: Routes = [
  { path: '', component: HomeComponent },

  // Az :stationName egy dinamikus paraméter, amit az URL-ből olvasunk ki
  { path: 'station-info/:stationName', component: StationTimetableComponent },

   { path: 'train-info/:trainNumber', component: TrainDetailsComponent },
  
  // Ha egyik útvonal sem illeszkedik, irányítsuk át a főoldalra
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
