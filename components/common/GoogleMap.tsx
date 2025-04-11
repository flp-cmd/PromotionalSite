"use client";

import { useEffect, useRef } from "react";

declare global {
  interface Window {
    initMap: () => void;
  }
}

const posicao: google.maps.LatLngLiteral = {
  lat: -22.880971570364597,
  lng: -47.05544915152122,
};

export default function MapaGoogle() {
  const mapaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (
      !document.querySelector(
        `script[src^="https://maps.googleapis.com/maps/api/js"]`
      )
    ) {
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_MAPS_API_KEY}&callback=initMap`;
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);
    }

    window.initMap = () => {
      if (!mapaRef.current) return;

      const mapOptions: google.maps.MapOptions = {
        center: posicao,
        zoom: 17,
      };

      const map = new google.maps.Map(mapaRef.current, mapOptions);

      const markerOptions: google.maps.MarkerOptions = {
        position: posicao,
        map: map,
        title: "Ponto de troca",
      };

      new google.maps.Marker(markerOptions);
    };

    return () => {
      delete (window as { initMap?: () => void }).initMap;
    };
  }, []);

  return (
    <div
      ref={mapaRef}
      style={{ height: "100%", width: "100%", borderRadius: "12px" }}
    />
  );
}
