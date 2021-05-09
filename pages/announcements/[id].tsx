import {useRouter} from 'next/router'
import {useQuery, gql} from '@apollo/client'
import Layout from 'components/Layout'
import AnnouncementCard from 'components/AnnouncementCard'

const ANNOUNCEMENT_QUERY = gql`
  query announcement($id: Int!) {
    announcement(id: $id) {
      id
      fellowship
      title
      body
    }
  }
`

export type Announcement = {
  id: number;
  fellowship: "founders" | "angels" | "writers" | "all";
  title: string;
  body: string;
}

type AnnouncementQueryData = {
  announcement: Announcement;
}

type AnnouncementQueryVars = {
  id: number;
}

export default function AnnouncementPage() {
  const {query} = useRouter()

  const {data, error, loading} = useQuery<AnnouncementQueryData, AnnouncementQueryVars>(
    ANNOUNCEMENT_QUERY,
    {
      skip: !query.id,
      variables: {id: Number(query.id)},
    }
  )
  const announcement = data?.announcement;

  if (!announcement || loading || error) {
    return null
  }

  return (
    <Layout>
      <AnnouncementCard announcement={announcement}/>
    </Layout>
  )
}