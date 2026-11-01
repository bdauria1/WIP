export const ALPHABET = 'abcdefghijklmnopqrstuvwxyz'.split('')
export const STATIC_LETTERS = ALPHABET.filter((id) => id !== 'j' && id !== 'z')

export const PRACTICE_WORDS = [
  'hello',
  'name',
  'yes',
  'love',
  'cat',
  'dog',
  'book',
  'help',
  'please',
  'thanks',
  'friend',
  'school',
  'water',
  'home',
  'good',
]

export const LETTERS = [
  { id: 'a', motion: false, tip: 'Fist, thumb along the side of the index finger.' },
  { id: 'b', motion: false, tip: 'Flat hand, fingers together, thumb tucked across the palm.' },
  { id: 'c', motion: false, tip: 'Curve the hand into a C, as if holding a cup.' },
  { id: 'd', motion: false, tip: 'Index up; thumb and remaining fingers touch to form a circle.' },
  { id: 'e', motion: false, tip: 'Fingertips fold down onto the thumb, a tight claw.' },
  { id: 'f', motion: false, tip: 'Thumb and index touch; the other three fingers stand up.' },
  { id: 'g', motion: false, tip: 'Index and thumb point forward, parallel, like a sideways gun.' },
  { id: 'h', motion: false, tip: 'Index and middle together, pointing forward; thumb tucked.' },
  { id: 'i', motion: false, tip: 'Fist with the pinky raised.' },
  { id: 'j', motion: true, tip: 'Start like I, then pinky traces a J in the air. Motion is required.' },
  { id: 'k', motion: false, tip: 'Index and middle up in a V; thumb rests on the middle knuckle.' },
  { id: 'l', motion: false, tip: 'Index up, thumb out — an L shape.' },
  { id: 'm', motion: false, tip: 'Thumb under the first three fingers, pinky resting on the side.' },
  { id: 'n', motion: false, tip: 'Thumb under the first two fingers.' },
  { id: 'o', motion: false, tip: 'All fingertips meet the thumb in a round O.' },
  { id: 'p', motion: false, tip: 'Like K, but the hand points down.' },
  { id: 'q', motion: false, tip: 'Like G, but the hand points down.' },
  { id: 'r', motion: false, tip: 'Index and middle cross; remaining fingers fold.' },
  { id: 's', motion: false, tip: 'Fist with the thumb wrapping over the front of the fingers.' },
  { id: 't', motion: false, tip: 'Thumb tucked under the index, peeking between index and middle.' },
  { id: 'u', motion: false, tip: 'Index and middle together, pointing up.' },
  { id: 'v', motion: false, tip: 'Index and middle up in a V.' },
  { id: 'w', motion: false, tip: 'Index, middle, and ring up; thumb holds the pinky.' },
  { id: 'x', motion: false, tip: 'Index hooked; the rest of the hand in a fist.' },
  { id: 'y', motion: false, tip: 'Thumb and pinky out — a “shaka” / Y shape.' },
  { id: 'z', motion: true, tip: 'Index traces a Z in the air. Motion is required.' },
]

export const LETTER_CHART_URL = 'https://www.lifeprint.com/asl101/fingerspelling/abc.htm'

export function letterMeta(id) {
  return LETTERS.find((letter) => letter.id === id) ?? null
}
