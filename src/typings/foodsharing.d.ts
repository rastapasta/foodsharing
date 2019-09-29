declare namespace Foodsharing {

  enum Results {
    MALFORMED,
    UNAUTHORIZED,
    FORBIDDEN,
    CONNECTION_ERROR,
    SERVER_ERROR,
    NOT_FOUND
  }

  interface ConversationListEntry {
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

  interface ConversationMember {
    id: string,
    name: string,
    photo: string,
    email: string,
    geschlecht: string,
    infomail_message: string
  }

  interface ConversationDetail {
    members: User[],
    messages: Message[],
    name: string
  }

  interface Message {
    body: string,
    fs_id: number,
    fs_name: string,
    fs_photo: string,
    id: number,
    is_htmlentity_encoded: number,
    time: string
  }

  interface Profile {
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

  interface Marker {
    id: string,
    lat: string,
    lon: string,
    bid: string
  }

  interface User {
    id: number,
    name: string,
    avatar: string,
    sleepStatus: boolean
  }

  interface Fairteiler {
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

  interface WallPosts {
    mayPost: boolean,
    mayDelete: boolean,
    results: WallPost[]
  }

  interface WallPost {
    id: number,
    body: string,
    createdAt: string,
    pictures: WallPicture[],
    author: User
  }

  interface WallPicture {
    image: string,
    medium: string,
    thumb: string
  }
}