import {NewsfeedItem} from '../../../lib/newsfeed'
import {NewsfeedType} from '../../../shared-types'
import {UserRow} from '../../db'
import {fetchUsersByProject} from '../../../lib/users'

export default async function users(newsfeedProject: NewsfeedItem): Promise<UserRow[]> {
  if (newsfeedProject.itemType != NewsfeedType.PROJECT) {
    return []
  }
  return fetchUsersByProject(newsfeedProject.itemId)
}
