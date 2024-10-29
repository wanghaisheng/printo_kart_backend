import { dataSource } from 'src/database/database.module'

export async function getAddressList(userId: string, page: number = 1, limit: number = 10) {
  const offsetCount = (page - 1) * limit
  const sql = `
      SELECT
          "a".*
        FROM
          "address" "a"
        WHERE
          "a"."userId" = $1
        LIMIT $2 OFFSET $3`
  const result = await dataSource.query(sql, [userId, limit, offsetCount])
  return result
}

export async function getAddressCount(userId: string) {
  const sql = `
      SELECT
       count(*) as count
      FROM
        "address" as "a"
      WHERE
        "a"."userId" = $1`
  const [result] = await (await dataSource).query(sql, [userId])
  return result?.count || 0
}
