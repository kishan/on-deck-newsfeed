import db from '../graphql/db'
import {arrayToSqlList} from './db_helpers'
import {NewsfeedType} from '../shared-types'
import {fetchAnnouncementsByFellowships} from './announcements'
import {fetchUsersByFellowships} from './users'
import {fetchProjectsByFellowships} from './projects'
import {AnnouncementRow, ProjectRow, UserRow} from 'graphql/db'

export type NewsfeedItem = {
  itemType: NewsfeedType
  itemId: number
  title: string
  description: string
  created_ts: string
  fellowship?: string
  imageUrl?: string
}

type FellowshipFilters = {
  announcements: string[]
  users: string[]
  projects: string[]
}

// build filters that determine visibility of different items on newsfeed for given fellowship
export function getFellowshipFilters(fellowship: string): FellowshipFilters {
  let filters: FellowshipFilters = {announcements: [], users: [], projects: []}

  switch (fellowship) {
    case 'founders':
      filters.announcements = ['founders', 'all']
      filters.users = ['angels', 'founders']
      filters.projects = ['founders']
      break
    case 'angels':
      filters.announcements = ['angels', 'all']
      filters.users = ['angels', 'founders']
      filters.projects = ['founders']
      break
    case 'writers':
      filters.announcements = ['writers', 'all']
      filters.users = ['writers']
      filters.projects = ['writers']
      break
  }
  return filters
}

function announcementToNewsfeedItem(announcement: AnnouncementRow): NewsfeedItem {
  // ommit imageUrl
  return {
    itemType: NewsfeedType.ANNOUNCEMENT,
    itemId: announcement.id,
    title: announcement.title,
    description: announcement.body,
    created_ts: announcement.created_ts,
    fellowship: announcement.fellowship,
  }
}

function userToNewsfeedItem(user: UserRow): NewsfeedItem {
  return {
    itemType: NewsfeedType.USER,
    itemId: user.id,
    title: user.name,
    description: user.bio,
    created_ts: user.created_ts,
    fellowship: user.fellowship,
    imageUrl: user.avatar_url,
  }
}

function projectToNewsfeedItem(project: ProjectRow): NewsfeedItem {
  // ommit fellowship
  return {
    itemType: NewsfeedType.PROJECT,
    itemId: project.id,
    title: project.name,
    description: project.description,
    created_ts: project.created_ts,
    imageUrl: project.icon_url,
  }
}

function compareByCreatedTs(a: NewsfeedItem, b: NewsfeedItem): number {
  return a.created_ts.localeCompare(b.created_ts)
}

// fetch sorted paginated list of items for our newsfeed for given fellowship.
//
// NOTE: we have an unhandled edgecase here where if items with the same timestamp get split across 
//       our pagination, we will not return the subsequent items with the same timestamp in our next 
//       query since we are relying on timestamp as our sole cursor. This is not a critical issue given
//       how this is an edge case and the minimal consequence of missing an item in our returned newsfeed.
export async function getNewsfeed(
  fellowship: string,
  limit: number,
  cursorTimestamp?: string
): Promise<NewsfeedItem[]> {
  // calculate filters based upon fellowship to determine visibility of which items to show
  const fellowshipFilters = getFellowshipFilters(fellowship)
  const paginationArgs = {cursor: cursorTimestamp, limit: limit}
  const announcementsPromise = fetchAnnouncementsByFellowships({
    fellowships: fellowshipFilters.announcements,
    pagination: paginationArgs,
  })
  const usersPromise = fetchUsersByFellowships({
    fellowships: fellowshipFilters.users,
    pagination: paginationArgs,
  })
  const projectsPromise = fetchProjectsByFellowships({
    fellowships: fellowshipFilters.projects,
    pagination: paginationArgs,
  })

  // fetch all items across our sources
  const [announcements, users, projects] = await Promise.all([
    announcementsPromise,
    usersPromise,
    projectsPromise,
  ])

  // format each item as NewsfeedItem
  const announcementsNewfeed = announcements.map((a) => announcementToNewsfeedItem(a))
  const usersNewsfeed = users.map((u) => userToNewsfeedItem(u))
  const projectsNewsfeed = projects.map((p) => projectToNewsfeedItem(p))

  // get most recent items across all sources
  const allNewsfeedItems = announcementsNewfeed.concat(usersNewsfeed, projectsNewsfeed)
  const newsfeedItemsSorted = allNewsfeedItems.sort(compareByCreatedTs).reverse()
  const newsfeedItemsFinal = newsfeedItemsSorted.slice(0, limit)
  return newsfeedItemsFinal
}

// NOTE: this function is not used. It only remains here for purpose of this takehome project
// to show an alternative solution considered for fetching our newsfeed. 
//
// Within this implementation we fetch our newsfeed within a single SQL query which will be
// more performant than above implementation, but provides less resuability and flexibility.
export async function getNewsfeedItemsSingleFetch(
  fellowship: string,
  limit: number,
  cursor?: string
): Promise<NewsfeedItem[]> {
  const fellowshipFilters = getFellowshipFilters(fellowship)
  const announcementFilter = arrayToSqlList(fellowshipFilters.announcements)
  const usersFilter = arrayToSqlList(fellowshipFilters.users)
  const projectsFilter = arrayToSqlList(fellowshipFilters.projects)
  let sql = `
    SELECT * FROM (
      SELECT
        '${NewsfeedType.ANNOUNCEMENT}' as itemType,
          id as itemId,
          title,
          body as description,
          created_ts,
          fellowship,
          null as imageUrl
      FROM announcements
      WHERE fellowship IN ${announcementFilter}
  UNION
      SELECT
        '${NewsfeedType.USER}' as itemType,
        id as itemId,
        name as title,
        bio as description,
        created_ts,
        fellowship,
        avatar_url as imageUrl
      FROM users
      WHERE fellowship IN ${usersFilter}
  UNION
      SELECT
          '${NewsfeedType.PROJECT}' as itemType,
          p.id as itemId,
          p.name as title,
          p.description,
          p.created_ts,
          null as fellowship,
          p.icon_url as imageUrl
      FROM projects p
      JOIN user_projects up ON p.id = up.project_id
      JOIN users u ON up.user_id = u.id
      WHERE u.fellowship IN ${projectsFilter}
  )
  `
  if (cursor) {
    sql += `WHERE created_ts < "${cursor}"`
  }
  sql += `
  ORDER BY created_ts DESC
  LIMIT ${limit}
  `

  const newsfeedItems: NewsfeedItem[] = await db.getAll(sql)
  return newsfeedItems
}
