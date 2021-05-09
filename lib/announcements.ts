import db, {AnnouncementRow} from "graphql/db";
import {arrayToSqlList, PaginationArgs} from './db_helpers'

type Args = {
  fellowships: string[];
  pagination: PaginationArgs;
}

export async function fetchAnnouncementById(id : number): Promise<AnnouncementRow | null> {
  const sql = `SELECT * FROM announcements WHERE id = ${id}`;
  const announcement : AnnouncementRow | undefined = await db.getOne(sql)
  if (!announcement) {
    return null
  }
  return announcement
}

// fetch all announcements that are for given fellowships
export async function fetchAnnouncementsByFellowships({fellowships, pagination}: Args): Promise<AnnouncementRow[]> {
  const fellowshipsListStr = arrayToSqlList(fellowships)
  let sql = `SELECT * FROM announcements WHERE fellowship IN ${fellowshipsListStr}`
  if (pagination.cursor) {
    sql += ` AND created_ts < "${pagination.cursor}"`
  }
  sql += ` ORDER BY created_ts DESC LIMIT ${pagination.limit}`
  return await db.getAll(sql)
}