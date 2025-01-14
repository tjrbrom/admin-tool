<template>
  <q-page class="q-pa-none">
    <div class="q-mb-md row full-width">
      <q-input
        v-model="searchQuery.userId"
        debounce="300"
        label="Search by User ID"
        outlined
        class="q-mr-md select-width"
      />
      <q-input
        v-model="searchQuery.name"
        debounce="300"
        label="Search by Player Name"
        outlined
        class="q-mr-md select-width"
      />
      <q-select
        v-model="searchQuery.gender"
        :options="genderOptions"
        label="Search by Gender"
        outlined
        class="q-mr-md select-width"
        emit-value
        map-options
        clearable
      />
      <q-select
        v-model="searchQuery.country"
        :options="countries"
        label="Search by Country"
        outlined
        class="q-mr-md select-width"
        emit-value
        map-options
        clearable
      />
      <q-select
        v-model="searchQuery.premium"
        :options="premiumOptions"
        label="Search by Premium"
        outlined
        class="q-mr-md select-width"
        emit-value
        map-options
        clearable
      />
      <q-select
        v-model="searchQuery.banned"
        :options="bannedOptions"
        label="Search by Banned"
        outlined
        class="q-mr-md select-width"
        emit-value
        map-options
        clearable
      />
    </div>
    <q-table
      :rows="filteredPlayers"
      :columns="columns"
      row-key="id"
      class="full-width"
      :pagination="{ rowsPerPage: 10 }"
    />
  </q-page>
</template>

<script setup lang="ts">
import type { Player } from 'src/model/Player'
import { ref, computed } from 'vue'

const premiumOptions = ref([
  { label: 'Yes', value: true },
  { label: 'No', value: false },
])

const bannedOptions = ref([
  { label: 'Yes', value: true },
  { label: 'No', value: false },
])

const genderOptions = ref([
  { label: 'Male', value: 'Male' },
  { label: 'Female', value: 'Female' },
  { label: 'Other', value: 'Other' },
  { label: 'Prefer not to say', value: 'Prefer not to say' },
])

// Country names object using 3-letter country codes to reference country name
// ISO 3166 Alpha-3 Format: [3 letter Country Code]: [Country Name]
// Sorted alphabetical by country name (special characters on bottom)
const countries = ref([
  { label: 'Afghanistan', value: 'AFG' },
  { label: 'Albania', value: 'ALB' },
  { label: 'Algeria', value: 'DZA' },
  { label: 'American Samoa', value: 'ASM' },
  { label: 'Andorra', value: 'AND' },
  { label: 'Angola', value: 'AGO' },
  { label: 'Anguilla', value: 'AIA' },
  { label: 'Antarctica', value: 'ATA' },
  { label: 'Antigua and Barbuda', value: 'ATG' },
  { label: 'Argentina', value: 'ARG' },
  { label: 'Armenia', value: 'ARM' },
  { label: 'Aruba', value: 'ABW' },
  { label: 'Australia', value: 'AUS' },
  { label: 'Austria', value: 'AUT' },
  { label: 'Azerbaijan', value: 'AZE' },
  { label: 'Bahamas (the)', value: 'BHS' },
  { label: 'Bahrain', value: 'BHR' },
  { label: 'Bangladesh', value: 'BGD' },
  { label: 'Barbados', value: 'BRB' },
  { label: 'Belarus', value: 'BLR' },
  { label: 'Belgium', value: 'BEL' },
  { label: 'Belize', value: 'BLZ' },
  { label: 'Benin', value: 'BEN' },
  { label: 'Bermuda', value: 'BMU' },
  { label: 'Bhutan', value: 'BTN' },
  { label: 'Bolivia (Plurinational State of)', value: 'BOL' },
  { label: 'Bonaire, Sint Eustatius and Saba', value: 'BES' },
  { label: 'Bosnia and Herzegovina', value: 'BIH' },
  { label: 'Botswana', value: 'BWA' },
  { label: 'Bouvet Island', value: 'BVT' },
  { label: 'Brazil', value: 'BRA' },
  { label: 'British Indian Ocean Territory (the)', value: 'IOT' },
  { label: 'Brunei Darussalam', value: 'BRN' },
  { label: 'Bulgaria', value: 'BGR' },
  { label: 'Burkina Faso', value: 'BFA' },
  { label: 'Burundi', value: 'BDI' },
  { label: 'Cabo Verde', value: 'CPV' },
  { label: 'Cambodia', value: 'KHM' },
  { label: 'Cameroon', value: 'CMR' },
  { label: 'Canada', value: 'CAN' },
  { label: 'Cayman Islands (the)', value: 'CYM' },
  { label: 'Central African Republic (the)', value: 'CAF' },
  { label: 'Chad', value: 'TCD' },
  { label: 'Chile', value: 'CHL' },
  { label: 'China', value: 'CHN' },
  { label: 'Christmas Island', value: 'CXR' },
  { label: 'Cocos (Keeling) Islands (the)', value: 'CCK' },
  { label: 'Colombia', value: 'COL' },
  { label: 'Comoros (the)', value: 'COM' },
  { label: 'Congo (the Democratic Republic of the)', value: 'COD' },
  { label: 'Congo (the)', value: 'COG' },
  { label: 'Cook Islands (the)', value: 'COK' },
  { label: 'Costa Rica', value: 'CRI' },
  { label: 'Croatia', value: 'HRV' },
  { label: 'Cuba', value: 'CUB' },
  { label: 'Curaçao', value: 'CUW' },
  { label: 'Cyprus', value: 'CYP' },
  { label: 'Czechia', value: 'CZE' },
  { label: "Côte d'Ivoire", value: 'CIV' },
  { label: 'Denmark', value: 'DNK' },
  { label: 'Djibouti', value: 'DJI' },
  { label: 'Dominica', value: 'DMA' },
  { label: 'Dominican Republic (the)', value: 'DOM' },
  { label: 'Ecuador', value: 'ECU' },
  { label: 'Egypt', value: 'EGY' },
  { label: 'El Salvador', value: 'SLV' },
  { label: 'Equatorial Guinea', value: 'GNQ' },
  { label: 'Eritrea', value: 'ERI' },
  { label: 'Estonia', value: 'EST' },
  { label: 'Eswatini', value: 'SWZ' },
  { label: 'Ethiopia', value: 'ETH' },
  { label: 'Falkland Islands (the) [Malvinas]', value: 'FLK' },
  { label: 'Faroe Islands (the)', value: 'FRO' },
  { label: 'Fiji', value: 'FJI' },
  { label: 'Finland', value: 'FIN' },
  { label: 'France', value: 'FRA' },
  { label: 'French Guiana', value: 'GUF' },
  { label: 'French Polynesia', value: 'PYF' },
  { label: 'French Southern Territories (the)', value: 'ATF' },
  { label: 'Gabon', value: 'GAB' },
  { label: 'Gambia (the)', value: 'GMB' },
  { label: 'Georgia', value: 'GEO' },
  { label: 'Germany', value: 'DEU' },
  { label: 'Ghana', value: 'GHA' },
  { label: 'Gibraltar', value: 'GIB' },
  { label: 'Greece', value: 'GRC' },
  { label: 'Greenland', value: 'GRL' },
  { label: 'Grenada', value: 'GRD' },
  { label: 'Guadeloupe', value: 'GLP' },
  { label: 'Guam', value: 'GUM' },
  { label: 'Guatemala', value: 'GTM' },
  { label: 'Guernsey', value: 'GGY' },
  { label: 'Guinea', value: 'GIN' },
  { label: 'Guinea-Bissau', value: 'GNB' },
  { label: 'Guyana', value: 'GUY' },
  { label: 'Haiti', value: 'HTI' },
  { label: 'Heard Island and McDonald Islands', value: 'HMD' },
  { label: 'Holy See (the)', value: 'VAT' },
  { label: 'Honduras', value: 'HND' },
  { label: 'Hong Kong', value: 'HKG' },
  { label: 'Hungary', value: 'HUN' },
  { label: 'Iceland', value: 'ISL' },
  { label: 'India', value: 'IND' },
  { label: 'Indonesia', value: 'IDN' },
  { label: 'Iran (Islamic Republic of)', value: 'IRN' },
  { label: 'Iraq', value: 'IRQ' },
  { label: 'Ireland', value: 'IRL' },
  { label: 'Isle of Man', value: 'IMN' },
  { label: 'Israel', value: 'ISR' },
  { label: 'Italy', value: 'ITA' },
  { label: 'Jamaica', value: 'JAM' },
  { label: 'Japan', value: 'JPN' },
  { label: 'Jersey', value: 'JEY' },
  { label: 'Jordan', value: 'JOR' },
  { label: 'Kazakhstan', value: 'KAZ' },
  { label: 'Kenya', value: 'KEN' },
  { label: 'Kiribati', value: 'KIR' },
  { label: "Korea (the Democratic People's Republic of)", value: 'PRK' },
  { label: 'Korea (the Republic of)', value: 'KOR' },
  { label: 'Kuwait', value: 'KWT' },
  { label: 'Kyrgyzstan', value: 'KGZ' },
  { label: "Lao People's Democratic Republic (the)", value: 'LAO' },
  { label: 'Latvia', value: 'LVA' },
  { label: 'Lebanon', value: 'LBN' },
  { label: 'Lesotho', value: 'LSO' },
  { label: 'Liberia', value: 'LBR' },
  { label: 'Libya', value: 'LBY' },
  { label: 'Liechtenstein', value: 'LIE' },
  { label: 'Lithuania', value: 'LTU' },
  { label: 'Luxembourg', value: 'LUX' },
  { label: 'Macao', value: 'MAC' },
  { label: 'Madagascar', value: 'MDG' },
  { label: 'Malawi', value: 'MWI' },
  { label: 'Malaysia', value: 'MYS' },
  { label: 'Maldives', value: 'MDV' },
  { label: 'Mali', value: 'MLI' },
  { label: 'Malta', value: 'MLT' },
  { label: 'Marshall Islands (the)', value: 'MHL' },
  { label: 'Martinique', value: 'MTQ' },
  { label: 'Mauritania', value: 'MRT' },
  { label: 'Mauritius', value: 'MUS' },
  { label: 'Mayotte', value: 'MYT' },
  { label: 'Mexico', value: 'MEX' },
  { label: 'Micronesia (Federated States of)', value: 'FSM' },
  { label: 'Moldova (the Republic of)', value: 'MDA' },
  { label: 'Monaco', value: 'MCO' },
  { label: 'Mongolia', value: 'MNG' },
  { label: 'Montenegro', value: 'MNE' },
  { label: 'Montserrat', value: 'MSR' },
  { label: 'Morocco', value: 'MAR' },
  { label: 'Mozambique', value: 'MOZ' },
  { label: 'Myanmar', value: 'MMR' },
  { label: 'Namibia', value: 'NAM' },
  { label: 'Nauru', value: 'NRU' },
  { label: 'Nepal', value: 'NPL' },
  { label: 'Netherlands (the)', value: 'NLD' },
  { label: 'New Caledonia', value: 'NCL' },
  { label: 'New Zealand', value: 'NZL' },
  { label: 'Nicaragua', value: 'NIC' },
  { label: 'Niger (the)', value: 'NER' },
  { label: 'Nigeria', value: 'NGA' },
  { label: 'Niue', value: 'NIU' },
  { label: 'Norfolk Island', value: 'NFK' },
  { label: 'Northern Mariana Islands (the)', value: 'MNP' },
  { label: 'Norway', value: 'NOR' },
  { label: 'Oman', value: 'OMN' },
  { label: 'Pakistan', value: 'PAK' },
  { label: 'Palau', value: 'PLW' },
  { label: 'Palestine, State of', value: 'PSE' },
  { label: 'Panama', value: 'PAN' },
  { label: 'Papua New Guinea', value: 'PNG' },
  { label: 'Paraguay', value: 'PRY' },
  { label: 'Peru', value: 'PER' },
  { label: 'Philippines (the)', value: 'PHL' },
  { label: 'Pitcairn', value: 'PCN' },
  { label: 'Poland', value: 'POL' },
  { label: 'Portugal', value: 'PRT' },
  { label: 'Puerto Rico', value: 'PRI' },
  { label: 'Qatar', value: 'QAT' },
  { label: 'Republic of North Macedonia', value: 'MKD' },
  { label: 'Romania', value: 'ROU' },
  { label: 'Russian Federation (the)', value: 'RUS' },
  { label: 'Rwanda', value: 'RWA' },
  { label: 'Réunion', value: 'REU' },
  { label: 'Saint Barthélemy', value: 'BLM' },
  { label: 'Saint Helena, Ascension and Tristan da Cunha', value: 'SHN' },
  { label: 'Saint Kitts and Nevis', value: 'KNA' },
  { label: 'Saint Lucia', value: 'LCA' },
  { label: 'Saint Martin (French part)', value: 'MAF' },
  { label: 'Saint Pierre and Miquelon', value: 'SPM' },
  { label: 'Saint Vincent and the Grenadines', value: 'VCT' },
  { label: 'Samoa', value: 'WSM' },
  { label: 'San Marino', value: 'SMR' },
  { label: 'Sao Tome and Principe', value: 'STP' },
  { label: 'Saudi Arabia', value: 'SAU' },
  { label: 'Senegal', value: 'SEN' },
  { label: 'Serbia', value: 'SRB' },
  { label: 'Seychelles', value: 'SYC' },
  { label: 'Sierra Leone', value: 'SLE' },
  { label: 'Singapore', value: 'SGP' },
  { label: 'Sint Maarten (Dutch part)', value: 'SXM' },
  { label: 'Slovakia', value: 'SVK' },
  { label: 'Slovenia', value: 'SVN' },
  { label: 'Solomon Islands', value: 'SLB' },
  { label: 'Somalia', value: 'SOM' },
  { label: 'South Africa', value: 'ZAF' },
  { label: 'South Georgia and the South Sandwich Islands', value: 'SGS' },
  { label: 'South Sudan', value: 'SSD' },
  { label: 'Spain', value: 'ESP' },
  { label: 'Sri Lanka', value: 'LKA' },
  { label: 'Sudan (the)', value: 'SDN' },
  { label: 'Suriname', value: 'SUR' },
  { label: 'Svalbard and Jan Mayen', value: 'SJM' },
  { label: 'Sweden', value: 'SWE' },
  { label: 'Switzerland', value: 'CHE' },
  { label: 'Syrian Arab Republic', value: 'SYR' },
  { label: 'Taiwan', value: 'TWN' },
  { label: 'Tajikistan', value: 'TJK' },
  { label: 'Tanzania, United Republic of', value: 'TZA' },
  { label: 'Thailand', value: 'THA' },
  { label: 'Timor-Leste', value: 'TLS' },
  { label: 'Togo', value: 'TGO' },
  { label: 'Tokelau', value: 'TKL' },
  { label: 'Tonga', value: 'TON' },
  { label: 'Trinidad and Tobago', value: 'TTO' },
  { label: 'Tunisia', value: 'TUN' },
  { label: 'Turkey', value: 'TUR' },
  { label: 'Turkmenistan', value: 'TKM' },
  { label: 'Turks and Caicos Islands (the)', value: 'TCA' },
  { label: 'Tuvalu', value: 'TUV' },
  { label: 'Uganda', value: 'UGA' },
  { label: 'Ukraine', value: 'UKR' },
  { label: 'United Arab Emirates (the)', value: 'ARE' },
  { label: 'United Kingdom of Great Britain and Northern Ireland (the)', value: 'GBR' },
  { label: 'United States Minor Outlying Islands (the)', value: 'UMI' },
  { label: 'United States of America (the)', value: 'USA' },
  { label: 'Uruguay', value: 'URY' },
  { label: 'Uzbekistan', value: 'UZB' },
  { label: 'Vanuatu', value: 'VUT' },
  { label: 'Venezuela (Bolivarian Republic of)', value: 'VEN' },
  { label: 'Viet Nam', value: 'VNM' },
  { label: 'Virgin Islands (British)', value: 'VGB' },
  { label: 'Virgin Islands (U.S.)', value: 'VIR' },
  { label: 'Wallis and Futuna', value: 'WLF' },
  { label: 'Western Sahara', value: 'ESH' },
  { label: 'Yemen', value: 'YEM' },
  { label: 'Zambia', value: 'ZMB' },
  { label: 'Zimbabwe', value: 'ZWE' },
  { label: 'Åland Islands', value: 'ALA' },
])

const players = ref<Player[]>([
  {
    id: '1',
    userId: 'u1',
    name: 'Player 1',
    photoUrl: 'https://via.placeholder.com/50',
    gender: 'Male',
    country: 'USA',
    premium: true,
    banned: false,
    lastLoginAt: 1673479600000, // Example timestamp
    createdAt: 1612492800000, // Example timestamp
  },
  {
    id: '2',
    userId: 'u2',
    name: 'Player 2',
    photoUrl: 'https://via.placeholder.com/50',
    gender: 'Female',
    country: 'Canada',
    premium: false,
    banned: false,
    lastLoginAt: 1673483200000,
    createdAt: 1612492900000,
  },
  {
    id: '3',
    userId: 'u3',
    name: 'Player 3',
    photoUrl: 'https://via.placeholder.com/50',
    gender: 'Male',
    country: 'UK',
    premium: true,
    banned: true,
    lastLoginAt: 1673486800000,
    createdAt: 1612493000000,
  },
  {
    id: '4',
    userId: 'u4',
    name: 'Player 4',
    photoUrl: 'https://via.placeholder.com/50',
    gender: 'Male',
    country: 'Australia',
    premium: false,
    banned: false,
    lastLoginAt: 1673489500000,
    createdAt: 1612493100000,
  },
  {
    id: '5',
    userId: 'u5',
    name: 'Player 5',
    photoUrl: 'https://via.placeholder.com/50',
    gender: 'Female',
    country: 'India',
    premium: true,
    banned: false,
    lastLoginAt: 1673493000000,
    createdAt: 1612493200000,
  },
  {
    id: '6',
    userId: 'u6',
    name: 'Player 6',
    photoUrl: 'https://via.placeholder.com/50',
    gender: 'Male',
    country: 'Germany',
    premium: false,
    banned: true,
    lastLoginAt: 1673496600000,
    createdAt: 1612493300000,
  },
  {
    id: '7',
    userId: 'u7',
    name: 'Player 7',
    photoUrl: 'https://via.placeholder.com/50',
    gender: 'Female',
    country: 'Spain',
    premium: true,
    banned: false,
    lastLoginAt: 1673500200000,
    createdAt: 1612493400000,
  },
  {
    id: '8',
    userId: 'u8',
    name: 'Player 8',
    photoUrl: 'https://via.placeholder.com/50',
    gender: 'Male',
    country: 'Brazil',
    premium: true,
    banned: true,
    lastLoginAt: 1673503800000,
    createdAt: 1612493500000,
  },
  {
    id: '9',
    userId: 'u9',
    name: 'Player 9',
    photoUrl: 'https://via.placeholder.com/50',
    gender: 'Female',
    country: 'France',
    premium: false,
    banned: false,
    lastLoginAt: 1673507400000,
    createdAt: 1612493600000,
  },
  {
    id: '10',
    userId: 'u10',
    name: 'Player 10',
    photoUrl: 'https://via.placeholder.com/50',
    gender: 'Male',
    country: 'Italy',
    premium: true,
    banned: false,
    lastLoginAt: 1673511000000,
    createdAt: 1612493700000,
  },
  {
    id: '11',
    userId: 'u11',
    name: 'Player 11',
    photoUrl: 'https://via.placeholder.com/50',
    gender: 'Female',
    country: 'Japan',
    premium: true,
    banned: true,
    lastLoginAt: 1673514600000,
    createdAt: 1612493800000,
  },
  {
    id: '12',
    userId: 'u12',
    name: 'Player 12',
    photoUrl: 'https://via.placeholder.com/50',
    gender: 'Male',
    country: 'South Korea',
    premium: false,
    banned: false,
    lastLoginAt: 1673518200000,
    createdAt: 1612493900000,
  },
  {
    id: '13',
    userId: 'u13',
    name: 'Player 13',
    photoUrl: 'https://via.placeholder.com/50',
    gender: 'Female',
    country: 'Mexico',
    premium: false,
    banned: true,
    lastLoginAt: 1673521800000,
    createdAt: 1612494000000,
  },
  {
    id: '14',
    userId: 'u14',
    name: 'Player 14',
    photoUrl: 'https://via.placeholder.com/50',
    gender: 'Male',
    country: 'Argentina',
    premium: true,
    banned: false,
    lastLoginAt: 1673525400000,
    createdAt: 1612494100000,
  },
  {
    id: '15',
    userId: 'u15',
    name: 'Player 15',
    photoUrl: 'https://via.placeholder.com/50',
    gender: 'Female',
    country: 'Russia',
    premium: false,
    banned: false,
    lastLoginAt: 1673529000000,
    createdAt: 1612494200000,
  },
])

const columns = ref([
  {
    name: 'userId',
    label: 'User Id',
    align: 'left' as 'left' | 'center' | 'right',
    field: 'userId',
  },
  {
    name: 'name',
    label: 'Name',
    align: 'left' as 'left' | 'center' | 'right',
    field: 'name',
  },
  {
    name: 'photoUrl',
    label: 'Photo URL',
    align: 'left' as 'left' | 'center' | 'right',
    field: 'photoUrl',
  },
  {
    name: 'gender',
    label: 'Gender',
    align: 'left' as 'left' | 'center' | 'right',
    field: 'gender',
  },
  {
    name: 'country',
    label: 'Country',
    align: 'left' as 'left' | 'center' | 'right',
    field: 'country',
  },
  {
    name: 'premium',
    label: 'Premium',
    align: 'center' as 'left' | 'center' | 'right',
    field: 'premium',
  },
  {
    name: 'banned',
    label: 'Banned',
    align: 'center' as 'left' | 'center' | 'right',
    field: 'banned',
  },
  {
    name: 'lastLoginAt',
    label: 'Last Login',
    align: 'center' as 'left' | 'center' | 'right',
    field: 'lastLoginAt',
    format: (val: string | number | Date) => new Date(val).toLocaleString(),
  },
  {
    name: 'createdAt',
    label: 'Created At',
    align: 'center' as 'left' | 'center' | 'right',
    field: 'createdAt',
    format: (val) => new Date(val).toLocaleString(),
  },
])

const searchQuery = ref({
  userId: '',
  name: '',
  gender: '',
  country: '',
  premium: null,
  banned: null,
})

const filteredPlayers = computed(() => {
  return players.value.filter((player) => {
    const matchesUserId = searchQuery.value.userId
      ? player.userId.includes(searchQuery.value.userId)
      : true
    const matchesName = searchQuery.value.name
      ? player.name.toLowerCase().includes(searchQuery.value.name.toLowerCase())
      : true
    const matchesGender = searchQuery.value.gender
      ? player.gender == searchQuery.value.gender
      : true
    const matchesCountry = searchQuery.value.country
      ? player.country == searchQuery.value.country
      : true
    const matchesPremium =
      searchQuery.value.premium !== null ? player.premium == searchQuery.value.premium : true
    const matchesBanned =
      searchQuery.value.banned !== null ? player.banned == searchQuery.value.banned : true

    return (
      matchesUserId &&
      matchesName &&
      matchesGender &&
      matchesCountry &&
      matchesPremium &&
      matchesBanned
    )
  })
})
</script>
<style>
.select-width {
  width: 200px;
}
</style>
