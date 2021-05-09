import {useRouter} from 'next/router'
import {useQuery, gql} from '@apollo/client'
import Layout from 'components/Layout'
import NewsFeedItemCard from 'components/NewsfeedItemCard'
import InfiniteScroll from 'react-infinite-scroller'
import {NewsfeedType} from '../../shared-types'

const NEWSFEED_QUERY = gql`
  query newsfeed($fellowship: String!, $cursor: String) {
    newsfeed(fellowship: $fellowship, cursor: $cursor) {
      pageInfo {
        hasNextPage
        nextCursor
      }
      items {
        itemType
        itemId
        title
        description
        created_ts
        fellowship
        imageUrl
        users {
          id
          name
          avatar_url
          fellowship
        }
        projects {
          id
          name
          icon_url
        }
      }
    }
  }
`

export type NewsfeedQueryNewsfeedItem = {
  itemType: NewsfeedType
  itemId: number
  title: string
  description: string
  created_ts: string
  fellowship: 'founders' | 'angels' | 'writers' | 'all'
  imageUrl: string
  users: NewsfeedQueryUser[]
  projects: NewsfeedQueryProject[]
}

type NewsfeedQueryUser = {
  id: number
  name: string
  avatar_url: string
  fellowship: 'founders' | 'angels' | 'writers'
}

type NewsfeedQueryProject = {
  id: number
  name: string
  icon_url: string
}

type NewsfeedQueryPageInfo = {
  hasNextPage: boolean
  nextCursor: string
}

type NewsfeedQueryData = {
  newsfeed: {
    items: NewsfeedQueryNewsfeedItem[]
    pageInfo: NewsfeedQueryPageInfo
  }
}
type NewsfeedQueryVars = {
  fellowship: string
  cursor?: string
}

export default function NewsfeedPage() {
  const {query} = useRouter()
  const fellowship = String(query.fellowship)
  const {data, error, loading, fetchMore} = useQuery<NewsfeedQueryData, NewsfeedQueryVars>(NEWSFEED_QUERY, {
    skip: !query.fellowship,
    variables: {fellowship: fellowship},
  })
  const newsfeed = data?.newsfeed

  if (!newsfeed || loading || error) {
    return null
  }

  const newsfeedItems = newsfeed.items
  const hasNextPage = newsfeed.pageInfo.hasNextPage
  const onLoadMore = () =>
    fetchMore({
      variables: {
        cursor: newsfeed.pageInfo.nextCursor,
      }
    })

  return (
    <Layout>
      <InfiniteScroll initialLoad={false} hasMore={hasNextPage} loadMore={onLoadMore}>
        <h1>Newsfeed: {fellowship}</h1>
        {!!newsfeedItems.length && (
          <div>
            {newsfeedItems.map((item) => (
              <NewsFeedItemCard
                newsfeedItem={item}
                key={item.itemType + item.itemId.toString()}
              />
            ))}
          </div>
        )}
      </InfiniteScroll>
    </Layout>
  )
}
