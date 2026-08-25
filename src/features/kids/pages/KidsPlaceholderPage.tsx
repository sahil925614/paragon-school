import { KidsPageBanner } from '../components/KidsPageBanner'

export function KidsPlaceholderPage({ title, description = '' }: { title: string; description?: string }) {
  return <KidsPageBanner title={title} description={description} />
}