import {AnnouncementRow} from '../../db'
import {fetchAnnouncementById} from '../../../lib/announcements'

type Args = {
  id: number;
}

export default async function announcement(parent: unknown, {id}: Args): Promise<AnnouncementRow> {
  const announcement = await fetchAnnouncementById(id)
  if (!announcement) {
    throw new Error(`Announcement ${id} not found`)
  }
  return announcement
}
