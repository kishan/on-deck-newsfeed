import {toEncodedString, fromEncodedString} from 'utils/encoded-string'
import {NewsfeedItem, getNewsfeed} from '../../../lib/newsfeed'

const NEWSFEED_LIMIT = 15

type Args = {
  fellowship: string
  limit?: number
  cursor?: string
}

type PageInfo = {
  hasNextPage: boolean
  nextCursor: string
}

export type NewsfeedQueryReturn = {
  items: NewsfeedItem[]
  pageInfo: PageInfo
}

export default async function newsfeed(
  parent: unknown,
  {fellowship, limit, cursor}: Args
): Promise<NewsfeedQueryReturn> {
  const decodedTimestamp = cursor ? fromEncodedString(cursor) : undefined
  limit ??= NEWSFEED_LIMIT // set default

  const newsfeedItems = await getNewsfeed(fellowship, limit, decodedTimestamp)

  let pageInfo
  if (newsfeedItems.length < limit) {
    // no more newsfeed items left
    pageInfo = {hasNextPage: false, nextCursor: ''}
  } else {
    // we may have more items so pass back cursor
    const lastTimestamp = newsfeedItems[limit - 1].created_ts
    const nextCursor = toEncodedString(lastTimestamp)
    pageInfo = {hasNextPage: true, nextCursor: nextCursor}
  }

  return {items: newsfeedItems, pageInfo: pageInfo}
}
