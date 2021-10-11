import { Tag } from '@/entities/Tag'
import { generateUUID } from '@/lib/UUID'

const mockTagList = [
  'liver',
  'pain',
  'right',
  'left',
  'pancreas',
  'kidney',
  'brain',
  'severe_pain',
  'tumour',
  'cancer',
  'MRI',
  'CT',
  'male',
  'female',
  'bone',
  'shoulder',
  'hip',
  'XRAY',
  'knee',
  'spine',
  'head',
  'abdomen',
  'contrast',
  'fragment',
  'detached',
  'injury',
  'torn',
  'rotator',
  'cuff',
  'abdominal',
  'dilatation' 
].map(text => new Tag({
  id: generateUUID(),
  text
}))


export {
  mockTagList
}