import { useEffect, useMemo, useState } from "react"
import { MapContainer, Marker, Polygon, Popup, TileLayer, Tooltip, useMapEvents } from "react-leaflet"
import 'leaflet/dist/leaflet.css'
import { LatLng, LatLngExpression, LatLngTuple, Map } from "leaflet"
import toast from "react-simple-toasts";
import 'react-simple-toasts/dist/theme/failure.css';

import { useCurrentUser } from "../../auth/useCurrentUser"
import { apiClient } from "../../apiClient"
import { Button } from "../../components/Button"
import { CreateNewObservation } from "./CreateNewObservation"
import useToggle from "./useToggle"
import { ObservationsList } from "./ObservationsList"
import { Location, swapLocationCoordinates } from "../../utils/swapLocationCoordinates"
import { WaterColorEnum } from "../../constants"

type PolygonData = {
  id: number;
  name?: string;
  geom: {
    coordinates: LatLngExpression[][][][]
  };
  observationRequests: Array<{
    id: number;
    locationId: number;
    location: Location;
  }>;
}

export type Observation = {
  id: number;
  waterColor: WaterColorEnum;
  secchiDepth: string;
  phosphorusConcentration: string;
  observationRequestId?: number;
  location: Location;
}

type CreateNewObservationDraft = {
  observationRequestId?: number;
  bodyOfWaterId: number;
  name?: string;
  locationId?: number;
  lat?: number;
  lon?: number;
}

export const CitizenScientistObservations = () => {
  const { currentUser } = useCurrentUser();
  const [isToggled, toggle] = useToggle(false);
  const [map, setMap] = useState<Map|null>(null);
  const [polygons, setPolygons] = useState<Array<PolygonData>>([]);
  const [observations, setObservations] = useState<Array<Observation>>([]);
  const [createNewObservationDraft, setCreateNewObservationDraft] = useState<CreateNewObservationDraft>();

  const myLocation = currentUser?.citizenScientist?.location.location.coordinates
  // defaults to New York
  const myLocationCenter: LatLngTuple = myLocation ? [myLocation[1], myLocation[0]] : [40.712, -74.006]

  useEffect(() => {
    fetchNearestBodiesOfWater(myLocationCenter)
    fetchMyObservations()
  }, [])

  const fetchNearestBodiesOfWater = async (mapCenter: LatLngTuple) => {
    const queryParams = new URLSearchParams({
      'lat': `${mapCenter[0]}`,
      'lon': `${mapCenter[1]}`,
      'includeRequests': 'true'
    })
  
    try {
      const res = await apiClient(`/bodies-of-water?${queryParams}`)

      setPolygons(res.data)
    } catch (err) {
      toast("Unable to diplay nearest bodies of water at this time. Please try again later.", {
        position: "bottom-right",
        theme: "failure"
      })
    }
  }

  const fetchMyObservations = async () => {
    try {
      const res = await apiClient.get("/observations/me")

      setObservations(res.data)
    } catch(err) {
      toast("Unable to diplay your observations at this time. Please try again later.", {
        position: "bottom-right",
        theme: "failure"
      })
    }
  }

  const handleDragEnd = async (center: LatLng) => {
    await fetchNearestBodiesOfWater([center.lat, center.lng])
  }

  const handleRespondToObservationRequest = (
    polygonId: number, obsRequestId: number, locationId: number
  ) => {
    toggle()
    setCreateNewObservationDraft({
      observationRequestId: obsRequestId,
      bodyOfWaterId: polygonId,
      locationId
    })
  }

  const handleObservationCreated = async () => {
    toggle()
    map && map.closePopup()
    setCreateNewObservationDraft(undefined)

    await fetchMyObservations()
  }

  const swappedCoordMultipolygons = useMemo(() => {
    return polygons.map(multipolygon => {
      return {
        id: multipolygon.id,
        name: multipolygon.name,
        positions: multipolygon.geom.coordinates.flatMap(coord => coord[0].map(c => ([c[1], c[0]]))),
        observationRequests: multipolygon.observationRequests
      }
    })
  }, [polygons])

  const requestedObservations = useMemo(() => {
    return observations.filter(obs => obs.observationRequestId).map(obs => obs.id)
  }, [observations])

  return (
    <div className="h-full max-w-screen-xl mx-auto p-4">
      <MapContainer
        ref={setMap}
        center={myLocationCenter}
        zoom={10} 
        scrollWheelZoom={false}
        style={{ height: 400, minWidth: 600 }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={myLocationCenter}>
          <Tooltip direction="top" offset={[0, 0]} opacity={1} permanent>Me</Tooltip>
        </Marker>
        {swappedCoordMultipolygons?.map(polygon =>
          <div key={polygon.id}>
            <Polygon
              key={polygon.id}
              pathOptions={{ color: "blue" }}
              positions={polygon.positions}
              eventHandlers={{
                click: e => {
                  setCreateNewObservationDraft({
                    bodyOfWaterId: polygon.id, name: polygon.name, lat: e.latlng.lat, lon: e.latlng.lng
                  })
                }
              }}
            />
            {polygon.observationRequests.map(obsRequest =>
              <Marker key={obsRequest.id} position={[obsRequest.location.location.coordinates[1], obsRequest.location.location.coordinates[0]]}>
                <Tooltip direction="right" offset={[0, 0]} opacity={1} permanent>
                  <>
                    <p className="text-sm font-semibold text-emerald-600">Observation requested</p>
                    {requestedObservations.includes(obsRequest.id) &&
                      <p className="text-xs font-semibold">ID_{obsRequest.id}</p>
                    }
                  </>
                </Tooltip>
                <Popup>
                  <div>
                    {requestedObservations.includes(obsRequest.id) &&
                      <p className="text-sm text-gray-900">
                        You already responded to this request. Want to add another observation?
                      </p>
                    }
                    <Button
                      label={requestedObservations.includes(obsRequest.id)
                        ? "Add Another Observation"
                        : "Respond To Observation Request"
                      }
                      onClick={() => handleRespondToObservationRequest(polygon.id, obsRequest.id, obsRequest.locationId)}
                    />
                  </div>
                </Popup>
              </Marker>
            )}
          </div>
        )}
        {(!!createNewObservationDraft && !createNewObservationDraft.observationRequestId) &&
        <Marker position={[createNewObservationDraft.lat!, createNewObservationDraft.lon!]}>
          <Popup>
            <div>
              <p className="text-lg font-medium text-gray-900">{createNewObservationDraft.name}</p>
              <Button label="Create New Observation" onClick={toggle} />
            </div>
          </Popup>
        </Marker>
        }
        {observations.length > 0 && observations.map(observation => {
        return !requestedObservations.includes(observation.id) &&
          <Marker
            key={observation.id}
            position={swapLocationCoordinates(observation.location)}
          >
            <Tooltip direction="bottom" offset={[0, 0]} opacity={1} permanent>
              <p className="text-xs font-semibold">ID_{observation.id}</p>
            </Tooltip>
          </Marker>
        })}
        <MyComponent onDragEnd={handleDragEnd} />
      </MapContainer>
      <div className="mt-3">
        <p className="text-base text-semibold text-gray-700 border border-gray-300 rounded-lg p-2">
          To create a new observation click on a body of water and afterwards on marker which will present possible actions. You can respond to existing observation requests by clicking on markers tagged with "Observation requested".
        </p>
      </div>
      {observations.length > 0
        ? <div className="mt-6">
            <ObservationsList
              observations={observations}
              onEditObservation={fetchMyObservations}
              onDeleteObservation={fetchMyObservations}
            />
          </div>
        : <div className="mt-7">
            <p className="text-base text-gray-900">You have no observations yet.</p>
          </div>
      }
      {createNewObservationDraft &&
        <CreateNewObservation
          isOpen={isToggled}
          closeDrawer={toggle}
          onCreateObservation={handleObservationCreated}
          {...createNewObservationDraft}
        />
      }
    </div>
  )
}

function MyComponent({ onDragEnd }: { onDragEnd: (center: LatLng) => void }) {
  useMapEvents({
    dragend: (e) => {
      onDragEnd(e.target.getCenter());
    }
  });
  return null;
}
