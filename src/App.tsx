import React, { useEffect, useRef, useState } from "react";
import { Place } from "./models/Place";
import Places from "./components/Places";
import { AVAILABLE_PLACES } from "./data";
import Modal from "./components/Modal";
import DeleteConfirmation from "./components/DeleteConfirmation";
import logoImg from "./assets/logo.png";
import { sortPlacesByDistance } from "./loc";

const storedIds: string[] = localStorage.getItem("pickedPlaceIds")
  ? JSON.parse(localStorage.getItem("pickedPlaceIds")!)
  : [];
const storedPlaces: Place[] = storedIds.map((id) => {
  const place = AVAILABLE_PLACES.find((place) => place.id === id);
  return place;
}) as Place[];

function App() {
  const selectedPlace = useRef<any>(null);
  const [pickedPlaces, setPickedPlaces] = useState<Place[]>(storedPlaces);
  const [availablePlaces, setAvailablePlaces] = useState<Place[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      const sortedPlaces = sortPlacesByDistance(
        AVAILABLE_PLACES,
        position.coords.latitude,
        position.coords.longitude
      );
      setAvailablePlaces(sortedPlaces);
    });
  }, [AVAILABLE_PLACES]);

  function handleStartRemovePlace(id: string) {
    setIsModalOpen(true);
    selectedPlace.current = id;
  }

  function handleStopRemovePlace() {
    setIsModalOpen(false);
  }

  function handleSelectPlace(id: string) {
    setPickedPlaces((prevPickedPlaces) => {
      if (prevPickedPlaces.some((place) => place.id === id)) {
        return prevPickedPlaces;
      }
      const place = AVAILABLE_PLACES.find((place) => place.id === id);
      if (!place) {
        return prevPickedPlaces;
      }
      return [place, ...prevPickedPlaces];
    });

    const storedIds: string[] = localStorage.getItem("pickedPlaceIds")
      ? JSON.parse(localStorage.getItem("pickedPlaceIds")!)
      : [];
    if (storedIds.includes(id)) return;
    localStorage.setItem("pickedPlaceIds", JSON.stringify([id, ...storedIds]));
  }

  function handleRemovePlace() {
    setPickedPlaces((prevPickedPlaces) =>
      prevPickedPlaces.filter((place) => place.id !== selectedPlace.current)
    );
    const storedIds: string[] = localStorage.getItem("pickedPlaceIds")
      ? JSON.parse(localStorage.getItem("pickedPlaceIds")!)
      : [];
    localStorage.setItem(
      "pickedPlaceIds",
      JSON.stringify(storedIds.filter((id) => id !== selectedPlace.current))
    );
    setIsModalOpen(false);
  }

  return (
    <>
      <Modal open={isModalOpen}>
        <DeleteConfirmation
          onCancel={handleStopRemovePlace}
          onConfirm={handleRemovePlace}
        />
      </Modal>
      <header>
        <img src={logoImg as unknown as string} alt="Stylized globe" />
        <h1>PlacePicker</h1>
        <p>
          Create your personal collection of places you would like to visit or
          you have visited.
        </p>
      </header>
      <main>
        <Places
          title="I'd like to visit ..."
          fallbackText={"Select the places you would like to visit below."}
          places={pickedPlaces}
          onSelectPlace={handleStartRemovePlace}
        />
        <Places
          title="Available Places"
          places={availablePlaces}
          onSelectPlace={handleSelectPlace}
        />
      </main>
    </>
  );
}

export default App;
