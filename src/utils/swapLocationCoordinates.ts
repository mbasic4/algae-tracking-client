import { LatLngTuple } from "leaflet"

export type Location = {
  location: {
    coordinates: LatLngTuple
  }
}

export const swapLocationCoordinates = (location: Location): LatLngTuple => {
  return [location.location.coordinates[1], location.location.coordinates[0]]
}