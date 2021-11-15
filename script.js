"use strict";

// prettier-ignore
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const form = document.querySelector(".form");
const containerWorkouts = document.querySelector(".workouts");
const inputType = document.querySelector(".form__input--type");
const inputDistance = document.querySelector(".form__input--distance");
const inputDuration = document.querySelector(".form__input--duration");
const inputCadence = document.querySelector(".form__input--cadence");
const inputElevation = document.querySelector(".form__input--elevation");
let map, mapEvent;

class workout {
  // date
  date = new Date();
  id = (Date.now() + " ").slice(-10);
  constructor(coords, distance, duration) {
    this.coords = coords; // [lat, long]
    this.distance = distance; // in km
    this.duration = duration; // in minute
  }
}
class running extends workout {
  constructor(coords, distance, duration, cadence) {
    super(coords, distance, duration);
    this.cadence = cadence;
    this.calcPace();
  }
  // calculating pace
  calcPace() {
    this.pace = this.duration / this.distance;
    return this.pace;
  }
}
class cycling extends workout {
  constructor(coords, distance, duration, elevgain) {
    super(coords, distance, duration);
    this.elevgain = elevgain;
    this.calcSpeed();
  }
  calcSpeed() {
    this.speed = this.distance / (this.duration / 60);
    return this.speed;
  }
}

// setting up the class
class App {
  // Private instance property
  #map;
  #mapEvent;
  constructor() {
    // calling the position, form inputs and elevation change
    this._getposition();
    form.addEventListener("submit", this._newWorkout.bind(this));
    inputType.addEventListener("change", this._toggleElevationField);
  }

  // Getting the Position
  _getposition() {
    // GeoLocation API - IT takes up two functions
    navigator.geolocation.getCurrentPosition(
      this._loadMap.bind(this),
      function () {
        alert(` couldn't get your location`);
      }
    );
  }

  // Loading the Map
  _loadMap(position) {
    // Getting latitude & longitude
    const {latitude} = position.coords;
    const {longitude} = position.coords;
    console.log(longitude, latitude);
    console.log(`https://www.google.com/maps/@${latitude},${longitude}`);

    // for showing your location
    const coords = [latitude, longitude];

    // leaflet code
    this.#map = L.map("map").setView(coords, 13);
    L.tileLayer("https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.#map);

    // Handling click event
    this.#map.on("click", this._showForm.bind(this));
  }
  // showing the form
  _showForm(mapE) {
    // Global variable equal to event
    this.#mapEvent = mapE;
    form.classList.remove("hidden");
    inputDistance.focus();
  }
  // toggle elevation
  _toggleElevationField() {
    inputElevation.closest(".form__row").classList.toggle("form__row--hidden");
    inputCadence.closest(".form__row").classList.toggle("form__row--hidden");
  }

  // new workout
  _newWorkout(e) {
    e.preventDefault();
    // Clear Input Fields
    inputDistance.value =
      inputCadence.value =
      inputDuration.value =
      inputElevation.value =
        " ";
    const {lat, lng} = this.#mapEvent.latlng;
    // Adding marker
    L.marker([lat, lng])
      .addTo(this.#map)
      .bindPopup(
        L.popup({
          maxWidth: 250,
          minWidth: 100,
          autoClose: false,
          closeOnClick: false,
          className: "running-popup",
        })
      )
      .setPopupContent("Workout")
      .openPopup();
  }
}

const app = new App();
