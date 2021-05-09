import {NewsfeedItem} from '../../../lib/newsfeed'
import {NewsfeedType} from '../../../shared-types'
import {ProjectRow} from '../../db'
import {fetchProjectsByUser} from '../../../lib/projects'

export default async function projects(newsfeedUser: NewsfeedItem): Promise<ProjectRow[]> {
  if (newsfeedUser.itemType != NewsfeedType.USER) {
    return []
  }
  return fetchProjectsByUser(newsfeedUser.itemId)
}