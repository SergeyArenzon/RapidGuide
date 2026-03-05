interface City {
  name: string;
  country_code: string;
}

export const cities: City[] = [
  { name: 'Rio de Janeiro', country_code: 'BR' },
  { name: 'São Paulo', country_code: 'BR' },
  { name: 'Salvador', country_code: 'BR' },

  { name: 'Beijing', country_code: 'CN' },
  { name: 'Shanghai', country_code: 'CN' },
  { name: "Xi'an", country_code: 'CN' },

  { name: 'Cairo', country_code: 'EG' },
  { name: 'Luxor', country_code: 'EG' },
  { name: 'Alexandria', country_code: 'EG' },

  { name: 'Paris', country_code: 'FR' },
  { name: 'Nice', country_code: 'FR' },
  { name: 'Lyon', country_code: 'FR' },

  { name: 'Berlin', country_code: 'DE' },
  { name: 'Munich', country_code: 'DE' },
  { name: 'Hamburg', country_code: 'DE' },

  { name: 'Athens', country_code: 'GR' },
  { name: 'Thessaloniki', country_code: 'GR' },
  { name: 'Santorini', country_code: 'GR' },

  { name: 'Bali', country_code: 'ID' },
  { name: 'Jakarta', country_code: 'ID' },
  { name: 'Yogyakarta', country_code: 'ID' },

  { name: 'Jerusalem', country_code: 'IL' },
  { name: 'Tel Aviv', country_code: 'IL' },
  { name: 'Haifa', country_code: 'IL' },

  { name: 'Rome', country_code: 'IT' },
  { name: 'Venice', country_code: 'IT' },
  { name: 'Florence', country_code: 'IT' },

  { name: 'Tokyo', country_code: 'JP' },
  { name: 'Kyoto', country_code: 'JP' },
  { name: 'Osaka', country_code: 'JP' },

  { name: 'Seoul', country_code: 'KR' },
  { name: 'Busan', country_code: 'KR' },
  { name: 'Jeju City', country_code: 'KR' },

  { name: 'Cancun', country_code: 'MX' },
  { name: 'Mexico City', country_code: 'MX' },
  { name: 'Guadalajara', country_code: 'MX' },

  { name: 'Marrakech', country_code: 'MA' },
  { name: 'Casablanca', country_code: 'MA' },
  { name: 'Fes', country_code: 'MA' },

  { name: 'Amsterdam', country_code: 'NL' },
  { name: 'Rotterdam', country_code: 'NL' },
  { name: 'Utrecht', country_code: 'NL' },

  { name: 'Lisbon', country_code: 'PT' },
  { name: 'Porto', country_code: 'PT' },
  { name: 'Faro', country_code: 'PT' },

  { name: 'Barcelona', country_code: 'ES' },
  { name: 'Madrid', country_code: 'ES' },
  { name: 'Seville', country_code: 'ES' },

  { name: 'Bangkok', country_code: 'TH' },
  { name: 'Chiang Mai', country_code: 'TH' },
  { name: 'Phuket', country_code: 'TH' },

  { name: 'Istanbul', country_code: 'TR' },
  { name: 'Antalya', country_code: 'TR' },
  { name: 'Cappadocia', country_code: 'TR' },

  { name: 'Dubai', country_code: 'AE' },
  { name: 'Abu Dhabi', country_code: 'AE' },
  { name: 'Sharjah', country_code: 'AE' },

  { name: 'London', country_code: 'GB' },
  { name: 'Edinburgh', country_code: 'GB' },
  { name: 'Manchester', country_code: 'GB' },

  { name: 'New York City', country_code: 'US' },
  { name: 'Los Angeles', country_code: 'US' },
  { name: 'Las Vegas', country_code: 'US' },
];

export type { City };
