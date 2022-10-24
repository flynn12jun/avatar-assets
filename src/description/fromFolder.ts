import { readFile as readFileOrig } from 'fs'
import { basename, dirname, join } from 'path'
import { Wearable } from 'types'
import { promisify } from 'util'
import { getFileCID } from '../cid/getFileCID'
import {getContents, getHashes} from '../assets/getContents'
import { readAssetJson } from '../assets/readAssetJson'
import { createAssetDescription } from './createAssetDescription'
import {WearableCategory} from "@dcl/schemas";

const readFile = promisify(readFileOrig)

// /some/path/<body_shape>/<asset_id> <-- path
//                         ########## <-- basename(path)
//            ############ <------------- basename(dirname(path))
// ####################### <------------- dirname(path)
const extractCategoryFromPath = (folder: string) => basename(dirname(folder))

export async function createAssetDescriptionFromFolder(
  folderFullPath: string,
  opts: {
    contentBaseUrl?: string
    collectionName?: string
  }
): Promise<Wearable> {
  // if (!folderFullPath || !folderFullPath.startsWith('/')) {
  //   throw new Error('Expected the folder\'s full path to start with "/"')
  // }
  const originalJson = readAssetJson(folderFullPath)
  // console.log("=======> folderFullPath: ", folderFullPath)
  // console.log("=======> originalJson: ", originalJson)
  const ca = extractCategoryFromPath(folderFullPath)

  // todo
  const category =  getWearableCategory(ca)
  const thumbnailCID = await getFilePathCID(folderFullPath, 'thumbnail.png')

  let imageCID
  try {
    imageCID = await getFilePathCID(folderFullPath, `${originalJson.id}.png`)
  } catch (error) {
    console.log(`Skipping image for ${originalJson.id}: ${error.message}`)
  }
  //console.log('====> originalJson.name', originalJson.name)
  const value: Wearable = {
    ...originalJson,
    id: `dcl://${opts.collectionName || 'base-exclusive'}/` + originalJson.id,
    name: originalJson.name,
    category,
    type: 'wearable',
    baseUrl: opts.contentBaseUrl || 'https://dcl-base-exclusive.now.sh',
    thumbnail: thumbnailCID,
    image: imageCID,
    replaces: originalJson.replaces,
    hides: originalJson.hides,
    representations: await getRepresentations(folderFullPath),
    customContents: await getCustomContents(folderFullPath)
  }
  return createAssetDescription(value)
}

async function getRepresentations(folderFullPath: string) {
  const originalJson = readAssetJson(folderFullPath)
  const contents = await getContents(folderFullPath)
  // const newContent = contents.map((content) =>{
  //   return content.file
  // })
  return originalJson.representations.map(representation => ({
    ...representation,
    contents
  }))
}
async function getCustomContents(folderFullPath: string){
  return await getHashes(folderFullPath)
}

async function getFilePathCID(basePath: string, filename: string) {
  const fullPath = join(basePath, filename)
  return getFileCID(await readFile(fullPath))
}

function getWearableCategory(category:string): WearableCategory{
  switch (category){
    case 'eyebrows':
      return WearableCategory.EYEBROWS
    case 'eyes':
      return WearableCategory.EYES
    case 'facial_hair':
      return WearableCategory.FACIAL_HAIR
    case 'hair':
      return WearableCategory.HAIR
    case 'head':
      return WearableCategory.HEAD
    case 'body_shape':
      return WearableCategory.BODY_SHAPE
    case 'mouth':
      return WearableCategory.MOUTH
    case 'upper_body':
      return WearableCategory.UPPER_BODY
    case 'lower_body':
      return WearableCategory.LOWER_BODY
    case 'feet':
      return WearableCategory.FEET
    case 'earring':
      return WearableCategory.EARRING
    case 'eyewear':
      return WearableCategory.EYEWEAR
    case 'hat':
      return WearableCategory.HAT
    case 'helmet':
      return WearableCategory.HELMET
    case 'mask':
      return WearableCategory.MASK
    case 'tiara':
      return WearableCategory.TIARA
    case 'top_head':
      return WearableCategory.TOP_HEAD
    case 'skin':
      return WearableCategory.SKIN
    default:
        return undefined
  }
}
