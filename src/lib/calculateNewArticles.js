 export function calculateNewArticles(items, lastFetchedMap) {
  const newByFeed = {}
  const newByCategory = {}
  let totalNew = 0

  for (const article of items) {
    const lastFetched = lastFetchedMap[article.feed_id]

    if (!lastFetched) continue

    const isNew =
      new Date(article.published_at) >
      new Date(lastFetched)

    if (isNew) {
      totalNew++

      newByFeed[article.feed_id] =
        (newByFeed[article.feed_id] || 0) + 1

      newByCategory[article.category_id] =
        (newByCategory[article.category_id] || 0) + 1
    }
  }

  return {
    newByFeed,
    newByCategory,
    totalNew
  }
}
