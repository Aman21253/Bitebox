import requests


def get_coordinates(address: str):

    try:

        print("Geocoding Address:", address)

        url = "https://nominatim.openstreetmap.org/search"

        headers = {
            "User-Agent": "BiteBox/1.0"
        }

        params = {
            "q": address,
            "format": "jsonv2",
            "limit": 1
        }

        response = requests.get(
            url,
            headers=headers,
            params=params,
            timeout=10
        )

        print("Status Code:", response.status_code)

        data = response.json()

        print("Geocode Response:", data)

        if not data or len(data) == 0:

            return None, None

        latitude = float(data[0]["lat"])

        longitude = float(data[0]["lon"])

        return latitude, longitude

    except Exception as e:

        print("GEOCODING ERROR:", str(e))

        return None, None