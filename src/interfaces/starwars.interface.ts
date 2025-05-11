export interface StarWarsRawResponse {
  message: string
  result: Result
  apiVersion: string
  timestamp: string
  support: Support
  social: Social
}

export interface Result {
  properties: StarWarsResponse
  _id: string
  description: string
  uid: string
  __v: number
}

export interface StarWarsResponse {
  created: string
  edited: string
  name: string
  gender: string
  skin_color: string
  hair_color: string
  height: string
  eye_color: string
  mass: string
  homeworld: string
  birth_year: string
  url: string
}

export interface Support {
  contact: string
  donate: string
  partnerDiscounts: PartnerDiscounts
}

export interface PartnerDiscounts {
  saberMasters: SaberMasters
  heartMath: HeartMath
}

export interface SaberMasters {
  link: string
  details: string
}

export interface HeartMath {
  link: string
  details: string
}

export interface Social {
  discord: string
  reddit: string
  github: string
}
