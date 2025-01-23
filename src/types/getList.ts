export interface BaseGetList {
  meta: {
    page: number
    take: number
    total: number
  }
}

export interface PageParam {
  page: number
}
