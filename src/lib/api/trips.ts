import { axios } from "../axios";

export interface TranslatedField {
  ar: string;
  en: string;
}

export interface MediaImage {
  file_name: string;
  url: string;
  uuid: string;
  mime_type: string;
  responsive_urls: string[];
}

export interface Place {
  id: number;
  name: TranslatedField;
  is_active: boolean;
  images: MediaImage[];
  num_trips?: number;
  created_at: string;
  updated_at: string;
}

export interface Airport {
  id: number;
  name: TranslatedField;
}

export interface Price {
  id: number;
  trip_id: number;
  hotel_id: number | null;
  airline_id: number | null;
  airport_id: number | null;
  name: TranslatedField;
  price: string;
  description: unknown[];
  is_active: boolean;
  airport: Airport;
  created_at: string;
  updated_at: string;
}

export interface FlightSchedule {
  id: number;
  trip_id: number;
  airport_id: number;
  from_date: string;
  to_date: string;
  remaining_seats: number;
  is_active: boolean;
  airport: Airport;
  created_at: string;
  updated_at: string;
}

export interface Trip {
  id: number;
  name: TranslatedField;
  description: TranslatedField;
  number_of_days: number;
  is_active: number;
  place_id: number;
  place: Place;
  prices: Price[];
  flight_schedules: FlightSchedule[];
  hotels: string[];
  airports: string[];
  airlines: string[];
  tags: string[];
  image: MediaImage;
  portrait_images?: MediaImage[];
  landscape_images?: MediaImage[];
  agent_phone: string | null;
  agent_phone_country: string | null;
  agent_phone_normalized: string | null;
  agent_phone_national: string | null;
  agent_phone_e164: string | null;
  agent_phone_verified_at: string | null;
  created_at: string;
  updated_at: string;
}

export const getTrips = async (): Promise<Trip[]> => {
  const { data } = await axios.get<Trip[]>("/trips");
  return data;
};

export const searchTrips = async (q: string): Promise<Trip[]> => {
  const { data } = await axios.get<Trip[]>("/trips", { params: { q } });
  return data;
};

export const getTripById = async (id: number): Promise<Trip> => {
  const { data } = await axios.get<Trip>(`/trips/${id}`);
  return data;
};
