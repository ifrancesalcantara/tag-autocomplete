import { mockTagList } from '@/config'
import { sanitize } from '@/lib/Text'

export class TagRequests {
  list (search) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const mockRes = search
          ? mockTagList.filter((tag, i) => sanitize(tag.text).startsWith(sanitize(search)))
          : mockTagList.slice(0, 5)
        resolve(mockRes)
      }, 400)
    })
  }
}
