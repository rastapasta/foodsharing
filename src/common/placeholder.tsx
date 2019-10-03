import { User } from "./typings";

export const foodsaver = (foodsaver: User): any => foodsaver || {
  id: '',
  name: '',
  photo: null,
  email: '',
  geschlecht: '',
  loading: true
}