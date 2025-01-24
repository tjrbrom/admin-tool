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

export const getCountryLabelFromCode = (countryCode: string) => {
  const country = countries.find(c => c.value === countryCode);
  return country ? country.label : countryCode;
};

export const getCountryCodeFromLabel = (countryLabel: string) => {
  const country = countries.find(c => c.label === countryLabel);
  return country ? country.value : countryLabel;
};
