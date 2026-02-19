export function validateUrl(url) {
  try {
    const parsed = new URL(url)

    if (!["http:", "https:"].includes(parsed.protocol)) {
      return false
    }

    // block localhost
    if (
      parsed.hostname === "localhost" ||
      parsed.hostname === "127.0.0.1"
    ) {
      return false
    }

    return true
  } catch {
    return false
  }
}
