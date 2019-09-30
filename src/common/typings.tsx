export enum Results {
  MALFORMED,
  UNAUTHORIZED,
  FORBIDDEN,
  CONNECTION_ERROR,
  SERVER_ERROR,
  NOT_FOUND
}

export interface ConversationListEntry {
  id: string,
  last: string,
  last_foodsaver_id: string,
  last_message: string,
  last_message_is_htmlentity_encoded: string,
  last_ts: string,
  name: string,
  unread: string,
  member: ConversationMember[]
}

export interface ConversationMember {
  id: string,
  name: string,
  photo: string,
  email: string,
  geschlecht: string,
  infomail_message: string
}

export interface ConversationDetail {
  members: User[],
  messages: Message[],
  name: string
}

export interface Message {
  body: string,
  fs_id: number,
  fs_name: string,
  fs_photo: string,
  id: number,
  is_htmlentity_encoded: number,
  time: string
}

export interface Profile {
  id: number,
  name: string,
  lastname: string,
  address: string,
  city: string,
  postcode: string,
  lat: string,
  lon: string,
  email: string,
  landline: string,
  mobile: string
}

export interface Marker {
  id: string,
  lat: string,
  lon: string,
  bid: string
}

export interface User {
  id: number,
  name: string,
  avatar: string,
  sleepStatus: boolean
}

export interface Fairteiler {
  id: number,
  regionId: number,
  name: string,
  description: string,
  address: string,
  city: string,
  postcode: string,
  lat: number,
  lon: number,
  createdAt: string,
  picture: string
}

export interface WallPosts {
  mayPost: boolean,
  mayDelete: boolean,
  results: WallPost[]
}

export interface WallPost {
  id: number,
  body: string,
  createdAt: string,
  pictures: WallPicture[],
  author: User
}

export interface WallPicture {
  image: string,
  medium: string,
  thumb: string
}