export type Category = {
  id: number
  name: string
  slug: string
  icon?: string
  description?: string
}

export type Material = {
  id: number
  category_id: number
  title: string
  image_url?: string
  arabic_text: string
  translation: string
  reading?: string // Cara baca (Transliterasi)
  example_sentence?: string
  example_reading?: string
  example_meaning?: string
  example_sentence_2?: string
  example_reading_2?: string
  example_meaning_2?: string
  is_published: boolean
  categories?: Category
}

export type Quiz = {
  id: number
  title: string
  description?: string
  thumbnail_url?: string
}

export type Question = {
  id: number
  quiz_id: number
  question_text: string
  image_url?: string
  option_a: string
  option_b: string
  option_c: string
  option_d: string
  correct_answer: 'a' | 'b' | 'c' | 'd'
}
