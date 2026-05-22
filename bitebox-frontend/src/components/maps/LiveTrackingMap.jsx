import {
  GoogleMap,
  Marker,
  useJsApiLoader,
} from "@react-google-maps/api";

function LiveTrackingMap({

  driverLocation,

  customerLocation,

  restaurantLocation,

}) {

  const { isLoaded } =
    useJsApiLoader({

      googleMapsApiKey:
        import.meta.env
          .VITE_GOOGLE_MAPS_API_KEY,

    });

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

    <GoogleMap

      mapContainerStyle={{

        width: "100%",

        height: "500px",

        borderRadius: "35px",
      }}

      center={driverLocation}

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
            elementType: "labels.text.stroke",
            stylers: [
              {
                color: "#0f172a"
              }
            ]
          },

          {
            elementType: "labels.text.fill",
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
  );
}

export default LiveTrackingMap;