import db, {UserRow} from "graphql/db";
import {arrayToSqlList, PaginationArgs} from './db_helpers'

type UsersFetchArgs = {
  fellowships: string[];
  pagination: PaginationArgs;
}

// fetch users who are part of given fellowships
export async function fetchUsersByFellowships({fellowships, pagination}: UsersFetchArgs): Promise<UserRow[]> {
  const fellowshipsListStr = arrayToSqlList(fellowships)
  let sql = `SELECT * FROM users WHERE fellowship IN ${fellowshipsListStr}`
  if (pagination.cursor) {
    sql += ` AND created_ts < "${pagination.cursor}"`
  }
  sql += ` ORDER BY created_ts DESC LIMIT ${pagination.limit}`
  return await db.getAll(sql)
}

export async function fetchUsersByProject(project_id: number): Promise<UserRow[]> {
  const sql =
    `  
      SELECT u.*
      FROM user_projects up
      JOIN users u ON up.user_id = u.id
      WHERE up.project_id = ${project_id}
    `;
  return await db.getAll(sql)
}