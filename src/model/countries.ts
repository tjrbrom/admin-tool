export interface Country {
  label: string;
  value: string;
}

export const countries: Country[] = [
  { label: 'United States of America (the)', value: 'US' },
  { label: 'Canada', value: 'CA' },
  { label: 'Mexico', value: 'MX' },
  { label: 'Greece', value: 'GR' },
];

export const getCountryLabel = (countryCode: string) => {
  const country = countries.find(c => c.value === countryCode);
  return country ? country.label : countryCode;
};
