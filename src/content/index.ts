/**
 * Page content, word for word from the approved copy doc (29 Sep 2026).
 * One JSON file per page so the GYA CMS retrofit can sync them to and from the dashboard.
 */
import home from './pages/home.json'
import understanding from './pages/understanding.json'
import team from './pages/team.json'
import book from './pages/book.json'
import faqs from './pages/faqs.json'
import global from './pages/global.json'
import privacy from './pages/privacy.json'
import type { TeamMember } from './types'

export const CONTENT = {
  home,
  understanding,
  team: { ...team, members: team.members as TeamMember[] },
  book,
  faqs,
  global,
  privacy,
}
