import {
  GoogleMap,
  Marker,
  DirectionsRenderer,
  useJsApiLoader,
} from "@react-google-maps/api";

import {
  useEffect,
  useState,
} from "react";

function LiveTrackingMap({

  driverLocation,

  customerLocation,

  restaurantLocation,

}) {

  const [directions, setDirections] =
    useState(null);

  const [eta, setEta] =
    useState("");

  const [distance, setDistance] =
    useState("");

  // LOAD GOOGLE MAPS

  const { isLoaded } =
    useJsApiLoader({

      googleMapsApiKey:
        import.meta.env
          .VITE_GOOGLE_MAPS_API_KEY,

      libraries: ["routes"],
    });

  // ─────────────────────────────────────
  // GET REAL ROUTE
  // ─────────────────────────────────────

  useEffect(() => {

    if (
      !isLoaded ||
      !driverLocation ||
      !customerLocation ||
      !window.google ||
      !window.google.maps ||
      !window.google.maps.DirectionsService
    ) {
      return;
    }

    const directionsService =
      new window.google.maps.DirectionsService();

    directionsService.route(

      {
        origin: driverLocation,

        destination: customerLocation,

        travelMode:
          window.google.maps.TravelMode.DRIVING,
      },

      (result, status) => {

        if (
          status === "OK" &&
          result
        ) {

          setDirections(result);

          const leg =
            result.routes[0].legs[0];

          setEta(
            leg.duration.text
          );

          setDistance(
            leg.distance.text
          );
        }
      }
    );

  }, [

    isLoaded,
    driverLocation,
    customerLocation

  ]);

  // ─────────────────────────────────────
  // LOADING
  // ─────────────────────────────────────

  if (!isLoaded) {

    return (

      <div className="
        h-[500px]
        rounded-[35px]
        bg-white/5
        border
        border-white/10
        flex
        items-center
        justify-center
        text-2xl
        font-black
        text-white
      ">

        Loading Map...

      </div>
    );
  }

  return (

    <div className="relative">

      {/* ETA CARD */}

      {
        eta && (

          <div className="
            absolute
            top-5
            left-5
            z-50
            bg-[#0f172a]
            border
            border-orange-500/20
            rounded-2xl
            px-5
            py-4
            text-white
            shadow-2xl
          ">

            <p className="
              text-sm
              text-gray-400
              mb-1
            ">
              Live Delivery ETA
            </p>

            <h2 className="
              text-2xl
              font-black
              text-orange-400
            ">
              {eta}
            </h2>

            <p className="
              text-sm
              mt-2
              text-gray-300
            ">
              Distance:
              {" "}
              {distance}
            </p>

          </div>
        )
      }

      <GoogleMap

        mapContainerStyle={{

          width: "100%",

          height: "500px",

          borderRadius: "35px",
        }}

        center={
          driverLocation ||
          customerLocation
        }

        zoom={14}

        options={{

          disableDefaultUI: true,

          zoomControl: true,

          styles: [

            {
              elementType: "geometry",
              stylers: [
                {
                  color: "#0f172a"
                }
              ]
            },

            {
              elementType:
              "labels.text.stroke",

              stylers: [
                {
                  color: "#0f172a"
                }
              ]
            },

            {
              elementType:
              "labels.text.fill",

              stylers: [
                {
                  color: "#94a3b8"
                }
              ]
            },

            {
              featureType: "road",

              elementType: "geometry",

              stylers: [
                {
                  color: "#1e293b"
                }
              ]
            },

            {
              featureType: "water",

              elementType: "geometry",

              stylers: [
                {
                  color: "#020617"
                }
              ]
            }

          ]
        }}
      >

        {/* ROUTE LINE */}

        {
          directions && (

            <DirectionsRenderer

              directions={directions}

              options={{

                suppressMarkers: true,

                polylineOptions: {

                  strokeColor: "#f97316",

                  strokeWeight: 6,
                }
              }}
            />
          )
        }

        {/* DRIVER */}

        {
          driverLocation && (

            <Marker

              position={driverLocation}

              label="🚚"
            />
          )
        }

        {/* CUSTOMER */}

        {
          customerLocation && (

            <Marker

              position={customerLocation}

              label="🏠"
            />
          )
        }

        {/* RESTAURANT */}

        {
          restaurantLocation && (

            <Marker

              position={restaurantLocation}

              label="🍔"
            />
          )
        }

      </GoogleMap>

    </div>
  );
}

export default LiveTrackingMap;