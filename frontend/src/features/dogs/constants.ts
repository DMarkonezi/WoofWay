import { DogStatus } from './services/dogService'; 

export const DOG_STATUS_LABELS: Record<DogStatus, string> = {
  Lost:      'Izgubljen',
  Spotted:   'Uočen',
  InShelter: 'U azilu',
  Adopted:   'Usvojen',
  Pet:       'Ljubimac'
};

export const DOG_STATUS_COLORS: Record<DogStatus, string> = {
  Lost:      'bg-red-100 text-red-700',
  Spotted:   'bg-yellow-100 text-yellow-700',
  InShelter: 'bg-woof-blue-100 text-woof-blue-700',
  Adopted:   'bg-woof-green-100 text-woof-green-700',
  Pet:       'bg-woof-blue-100 text-woof-blue-700'
};