import { useEffect, useMemo, useState } from "react"
import { MapContainer, Marker, Polygon, Popup, TileLayer, Tooltip, useMapEvents } from "react-leaflet"
import 'leaflet/dist/leaflet.css'
import { LatLng, LatLngExpression, LatLngTuple } from "leaflet"
import toast from "react-simple-toasts";
import 'react-simple-toasts/dist/theme/success.css';
import 'react-simple-toasts/dist/theme/failure.css';

import { Button } from "../../components/Button"
import { apiClient } from "../../apiClient"
import { Location } from "../../utils/swapLocationCoordinates"
import { ObservationsList } from "./ObservationsList"
import { ConfirmDialog } from "../../components/ConfirmDialog"
import { handleError } from "../../utils/handleError";


const center: LatLngTuple = [40.712, -74.006]

type PolygonData = {
  id: number;
  name?: string;
  geom: {
    coordinates: LatLngExpression[][][][]
  };
}

type ObservationRequestPayload = {
  bodyOfWaterId: number;
  name?: string;
  lat: number;
  lon: number;
}

type ObservationRequestState = {
  polygonId: number;
  position: [number, number];
}

type ObservationRequest = {
  id: number;
  bodyOfWaterId: number;
  locationId: number;
  location: Location;
}

export const BiologistObservations = () => {
  const [requestDraft, setRequestDraft] = useState<ObservationRequestPayload>()
  const [polygons, setPolygons] = useState<Array<PolygonData>>([])
  const [observationRequests, setObservationRequests] = useState<Array<ObservationRequestState>>([])
  const [bodyOfWaterObservations, setBodyOfWaterObservations] = useState([]);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  useEffect(() => {
    fetchNearestBodiesOfWater(center)
    fetchMyObservationRequests()
  }, [])

  const fetchNearestBodiesOfWater = async (mapCenter: LatLngTuple) => {
    const queryParams = new URLSearchParams({
      'lat': `${mapCenter[0]}`,
      'lon': `${mapCenter[1]}`
    })

    try {
      const res = await apiClient.get("/bodies-of-water", {
        params: queryParams
      })

      setPolygons(res.data)
    } catch (err) {
      toast("Unable to diplay nearest bodies of water at this time. Please try again later.", {
        position: "bottom-right",
        theme: "failure"
      })
    }
  }

  const fetchMyObservationRequests = async () => {
    try {
      const res = await apiClient.get("/observation-requests/me")

      const formatted = res.data.map((obs: ObservationRequest) => ({
        polygonId: obs.bodyOfWaterId,
        position: [obs.location.location.coordinates[1], obs.location.location.coordinates[0]]
      }))

      setObservationRequests(formatted)
    } catch(err) {
      toast("Unable to diplay your observation requests at this time. Please try again later.", {
        position: "bottom-right",
        theme: "failure"
      })
    }
  }

  const handleDragEnd = async (center: LatLng) => {
    await fetchNearestBodiesOfWater([center.lat, center.lng])
  }

  const handleRequestObservation = async () => {
    try {
      await apiClient.post("/observation-requests", requestDraft)

      fetchMyObservationRequests()
      toast("Observation successfully requested!", {
        position: "bottom-right",
        theme: "success"
      })
    } catch(err) {
      const errorMessage = handleError(err)
      toast(errorMessage, {
        position: "bottom-right",
        theme: "failure"
      })
    }
  }

  const handleSeeAllBodyOfWaterObservations = async (bodyOfWaterId: number) => {
    try {
      const res = await apiClient.get(`bodies-of-water/${bodyOfWaterId}/observations`)
      
      setBodyOfWaterObservations(res.data)
    } catch(err) {
      toast("There was an issue. Please try again later.", {
        position: "bottom-right",
        theme: "failure"
      })
    }
  }

  const closeConfirmDialog = () => {
    setShowConfirmDialog(false);
  }

  const confirmObservationRequest = () => {
    handleRequestObservation();
    closeConfirmDialog();
  }

  const swappedCoordMultipolygons = useMemo(() => {
    return polygons.map(multipolygon => {
      return {
        id: multipolygon.id,
        name: multipolygon.name,
        positions: multipolygon.geom.coordinates.flatMap(coord => coord[0].map(c => ([c[1], c[0]])))
      }
    })
  }, [polygons])

  const alreadyRequestedPolygonIds = useMemo(() => {
    return observationRequests.map(obsRequest => obsRequest.polygonId)
  }, [observationRequests])

  return (
    <div className="h-full max-w-screen-xl mx-auto p-4">
      <MapContainer
        center={[40.712, -74.006]}
        zoom={10} 
        scrollWheelZoom={false}
        style={{ height: 400, minWidth: 600 }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {swappedCoordMultipolygons?.map(polygon =>
          <Polygon
            key={polygon.id}
            pathOptions={{ color: "blue" }}
            positions={polygon.positions}
            eventHandlers={{
              click: e => {
                setRequestDraft({ bodyOfWaterId: polygon.id, name: polygon.name, lat: e.latlng.lat, lon: e.latlng.lng })
              }
            }}
          />
        )}
        {requestDraft &&
        <Marker position={[requestDraft.lat, requestDraft.lon]}>
          <Popup>
            <div>
              <span className="text-lg font-medium text-gray-900">{requestDraft.name}</span>
              <div className="mb-2">
                <Button
                  size="sm"
                  label="See All Observations"
                  onClick={() =>  handleSeeAllBodyOfWaterObservations(requestDraft.bodyOfWaterId)}
                />
              </div>
              {!alreadyRequestedPolygonIds.includes(requestDraft.bodyOfWaterId) &&
                <Button size="sm" label="Request New Observation" onClick={() => setShowConfirmDialog(true)} />
              }
            </div>
          </Popup>
        </Marker>
        }
        {observationRequests.length > 0 && observationRequests.map(observationReq =>
        <Marker key={observationReq.polygonId} position={observationReq.position}>
          <Popup>
            <div>
              <span className="text-lg font-medium text-gray-900">{}</span>
              <div className="mb-2">
                <Button
                  size="sm"
                  label="See All Observations"
                  onClick={() => handleSeeAllBodyOfWaterObservations(observationReq.polygonId)}
                />
              </div>
            </div>
          </Popup>
          <Tooltip direction="right" offset={[0, 0]} opacity={1} permanent>
            <p className="text-xs font-semibold">Observation requested</p>
          </Tooltip>
        </Marker>
        )}
        <MyComponent onDragEnd={handleDragEnd} />
      </MapContainer>
      <div className="mt-3">
        <p className="text-base text-semibold text-gray-700 border border-gray-300 rounded-lg p-2">
          To request a new observation or to see existing observations click on a body of water and afterwards on marker which will present possible actions. You can also click on existing markers.
        </p>
      </div>
      {bodyOfWaterObservations.length > 0 &&
      <div className="mt-6">
          <ObservationsList
            observations={bodyOfWaterObservations}
          />
        </div>
      }
      <ConfirmDialog
        showDialog={showConfirmDialog}
        message="All citizen-scientists will be able to see this request"
        onConfirm={confirmObservationRequest}
        onCancel={closeConfirmDialog}
      />
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
