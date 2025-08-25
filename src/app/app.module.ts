import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http'; // <-- API hávásokhoz szükséges modul
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; // <-- FONTOS: FormsModule a [(ngModel)]-hez, ReactiveFormsModule a [formGroup]-hoz
import { AppRoutingModule } from './app-routing.module';

// Komponensek importálása
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { InputFormComponent } from './components/input-form/input-form.component';
import { StationTimetableComponent } from './components/station-timetable/station-timetable.component';
import { TrainDetailsComponent } from './components/train-info/train-info.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    InputFormComponent,
    StationTimetableComponent,
    TrainDetailsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule, // <-- JAVÍTÁS: Ez biztosítja a <router-outlet> működését.
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }