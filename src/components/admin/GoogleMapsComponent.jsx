import React, { useRef, useEffect } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

const GoogleMapsComponent = ({ formData, setFormData }) => {
  const mapRef = useRef(null);
  const inputRef = useRef(null);
  const markerRef = useRef(null);

  // Centrar el mapa y actualizar el marcador cuando cambien las coordenadas
  useEffect(() => {
    if (mapRef.current) {
      const latitud = parseFloat(formData.latitud);
      const longitud = parseFloat(formData.longitud);

      if (!isNaN(latitud) && !isNaN(longitud)) {
        // Centrar el mapa
        mapRef.current.panTo({ lat: latitud, lng: longitud });

        // Actualizar el marcador (si está disponible)
        if (markerRef.current) {
          markerRef.current.setPosition({ lat: latitud, lng: longitud });
        }
      } else {
        console.error("Las coordenadas no son válidas:", formData.latitud, formData.longitud);
      }
    }
  }, [formData.latitud, formData.longitud]);

  // Manejar la selección de un lugar desde el campo de texto
  const handlePlaceSelect = () => {
    const autocomplete = new window.google.maps.places.Autocomplete(inputRef.current);
    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace();
      if (place.geometry) {
        const { lat, lng } = place.geometry.location;
        const newLat = lat();
        const newLng = lng();

        // Actualizar formData con la nueva dirección y coordenadas
        setFormData((prev) => ({
          ...prev,
          direccion: place.formatted_address || "",
          latitud: newLat,
          longitud: newLng,
        }));

        // Centrar el mapa en la nueva posición
        mapRef.current?.panTo({ lat: newLat, lng: newLng });
      }
    });
  };

  // Manejar el evento de arrastre del marcador
  const handleMarkerDragEnd = (event) => {
    const newLat = event.latLng.lat();
    const newLng = event.latLng.lng();

    // Actualizar el formData con las nuevas coordenadas
    setFormData((prev) => ({
      ...prev,
      latitud: newLat,
      longitud: newLng,
    }));

    // Opcional: Obtener la dirección nueva con Geocoder
    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ location: { lat: newLat, lng: newLng } }, (results, status) => {
      if (status === "OK" && results[0]) {
        setFormData((prev) => ({
          ...prev,
          direccion: results[0].formatted_address,
        }));
      } else {
        console.error("Error al obtener la dirección:", status);
      }
    });
  };

  return (
    <LoadScript googleMapsApiKey="AIzaSyBcJC_lrCkzDFJDOa6ZeLYW0MonsxMnRyo" libraries={['places']}>
      <div className="mb-3">
        <input
          type="text"
          ref={inputRef}
          value={formData.direccion} // Sincronizar el valor con formData
          placeholder="Busca una dirección"
          onFocus={handlePlaceSelect}
          className="form-control"
          required
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, direccion: e.target.value }))
          }
        />
      </div>
      <GoogleMap
        mapContainerStyle={{ height: '400px', width: '100%' }}
        center={{ lat: parseFloat(formData.latitud), lng: parseFloat(formData.longitud) }}
        zoom={14}
        onLoad={(mapInstance) => (mapRef.current = mapInstance)}
      >
        <Marker
          position={{ lat: parseFloat(formData.latitud), lng: parseFloat(formData.longitud) }}
          draggable
          onDragEnd={handleMarkerDragEnd}
          onLoad={(markerInstance) => (markerRef.current = markerInstance)}
        />
      </GoogleMap>
    </LoadScript>
  );
};

export default GoogleMapsComponent;
