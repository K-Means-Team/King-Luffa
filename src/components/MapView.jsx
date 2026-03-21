/**
 * Mapbox GL map: hill GeoJSON layer, follows throttled user position, separate Markers per player.
 */

import { useCallback, useEffect, useMemo, useRef } from "react";
import Map, { Layer, Marker, Source } from "react-map-gl";
import { mapboxToken } from "../config";
import { hillToFeatureCollection } from "../services/zoneService";
import { LocalPlayerMarker, OtherPlayerMarker } from "./PlayerMarker";

const token = mapboxToken;
const CAMERA_MIN_MS = 2000;

export function MapView({ userPosition, otherPlayers, hillPolygon }) {
	const mapRef = useRef(null);
	const lastCam = useRef(0);
	const hillData = useMemo(
		() => hillToFeatureCollection(hillPolygon),
		[hillPolygon],
	);

	const initialView = useMemo(() => {
		if (userPosition?.lng != null && userPosition?.lat != null) {
			return {
				longitude: userPosition.lng,
				latitude: userPosition.lat,
				zoom: 15,
			};
		}
		return { longitude: -122.4194, latitude: 37.7749, zoom: 14 };
	}, []);

	const onLoad = useCallback(() => {
		const map = mapRef.current?.getMap?.();
		if (
			map &&
			userPosition?.lng != null &&
			userPosition?.lat != null
		) {
			map.jumpTo({
				center: [userPosition.lng, userPosition.lat],
				zoom: 15,
			});
		}
	}, [userPosition?.lng, userPosition?.lat]);

	useEffect(() => {
		if (userPosition?.lng == null || userPosition?.lat == null)
			return;
		const map = mapRef.current?.getMap?.();
		if (!map) return;
		const now = Date.now();
		if (now - lastCam.current < CAMERA_MIN_MS) return;
		lastCam.current = now;
		map.easeTo({
			center: [userPosition.lng, userPosition.lat],
			duration: 700,
			essential: true,
		});
	}, [userPosition?.lng, userPosition?.lat]);

	if (!token) {
		return (
			<div className="map-fallback">
				Set <code>VITE_MAPBOX_ACCESS_TOKEN</code> in{" "}
				<code>.env</code> to load the map.
			</div>
		);
	}

	return (
		<Map
			ref={mapRef}
			mapboxjwtToken={token}
			initialViewState={initialView}
			onLoad={onLoad}
			style={{ width: "100%", height: "100%" }}
			mapStyle="mapbox://styles/mapbox/dark-v11"
			reuseMaps
		>
			{hillData.features.length > 0 && (
				<Source
					id="hill"
					type="geojson"
					data={hillData}
				>
					<Layer
						id="hill-fill"
						type="fill"
						paint={{
							"fill-color": "#6366f1",
							"fill-opacity": 0.22,
						}}
					/>
					<Layer
						id="hill-outline"
						type="line"
						paint={{
							"line-color": "#818cf8",
							"line-width": 2,
						}}
					/>
				</Source>
			)}

			{userPosition?.lng != null &&
				userPosition?.lat != null && (
					<Marker
						longitude={userPosition.lng}
						latitude={userPosition.lat}
						anchor="center"
					>
						<LocalPlayerMarker />
					</Marker>
				)}

			{(otherPlayers || []).map((p) => (
				<Marker
					key={p.id}
					longitude={p.lng}
					latitude={p.lat}
					anchor="center"
				>
					<OtherPlayerMarker />
				</Marker>
			))}
		</Map>
	);
}
