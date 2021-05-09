import db, {ProjectRow} from "graphql/db";
import {arrayToSqlList, PaginationArgs} from './db_helpers'

type ProjectsFetchArgs = {
  fellowships: string[];
  pagination: PaginationArgs;
}

// fetch projects which have at least one participating user in one of given fellowships
export async function fetchProjectsByFellowships({fellowships, pagination}: ProjectsFetchArgs): Promise<ProjectRow[]> {
  const fellowshipsListStr = arrayToSqlList(fellowships)
  let sql = 
  `
  SELECT * 
  FROM projects p 
  WHERE p.id IN (
    SELECT DISTINCT up.project_id 
    FROM user_projects up 
    JOIN users u ON up.user_id = u.id 
    WHERE u.fellowship IN ${fellowshipsListStr}
  )
  `
  if (pagination.cursor) {
    sql += ` AND created_ts < "${pagination.cursor}"`
  }
  sql += ` ORDER BY created_ts DESC LIMIT ${pagination.limit}`
  return await db.getAll(sql)
}

export async function fetchProjectsByUser(user_id: number): Promise<ProjectRow[]> {
  const sql =
  `  
  SELECT p.*
  FROM user_projects up
  JOIN projects p ON up.project_id = p.id
  WHERE up.user_id = ${user_id}
  `;
  return await db.getAll(sql)
}