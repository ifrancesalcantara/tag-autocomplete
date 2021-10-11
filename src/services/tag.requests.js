import { mockTagList } from '@/config'
import { sanitize } from '@/lib/Text'

export class TagRequests {
  list (search) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const mockRes = mockTagList
          .filter((tag) => sanitize(tag.text).startsWith(sanitize(search)))
        resolve(mockRes)
      }, 400)
    })
  }
}
