import {Locale, WearableCategory} from "@dcl/schemas";
import {WearableRepresentation} from "@dcl/schemas/dist/platform/item/wearable/representation";

export type SourceJson = {
  name: string
  i18n: {
    [key: string]: string
  }
  tags: string[]
  replaces?: string[]
  hides?: string[]
  category: string
  rarity?: string
  description?: string
  main: {
    overrideReplaces?: string[]
    overrideHides?: string[]
    type: string
    model: string
  }[]
}

export type Wearable = {
  id: WearableId
  name: string
  type: 'wearable'
  thumbnail: string
  image: string | undefined
  category: WearableCategory
  baseUrl: string
  replaces: WearableCategory[]
  hides: WearableCategory[]
  i18n: {
    code: Locale
    text: string
  }[]
  tags: string[]
  representations: WearableRepresentation[]
  rarity: string
  description: string
  customContents: Content[]
}
export type WearableId = string

export type BodyShapeRespresentation = {
  bodyShapes: string[]
  mainFile: string
  overrideReplaces: string[]
  overrideHides: string[]
  contents: Content[]
}

export type Content = {
  file: string
  hash: string
}
