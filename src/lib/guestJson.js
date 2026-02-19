export function transformGuestJson(data) {
  const categories = []
  const feeds = []

  data.categories.forEach(cat => {
    const categoryId = crypto.randomUUID()

    categories.push({
      id: categoryId,
      name: cat.name,
      color: randomColor(),
    })

    cat.feeds.forEach(feed => {
      feeds.push({
        id: crypto.randomUUID(),
        title: feed.title,
        description: feed.description,
        site_url: feed.siteUrl,
        site_rss: feed.feedUrl,
        category_id: categoryId,
      })
    })
  })

  return { categories, feeds }
}

function randomColor() {
  const colors = [
    "#3b82f6",
    "#10b981",
    "#f59e0b",
    "#ef4444",
    "#8b5cf6",
  ]
  return colors[Math.floor(Math.random() * colors.length)]
}
