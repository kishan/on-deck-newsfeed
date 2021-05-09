import Link from 'next/link'
import styled from 'styled-components'
import Card from './Card'
import MiniProfile from './MiniProfile'
import Markdown from './Markdown'
import {NewsfeedQueryNewsfeedItem} from '../pages/newsfeed/[fellowship]'
import {ANNOUNCEMENTS_IMAGE_URL, PLACEHOLDER_IMAGE_URL} from './constants'
import {NewsfeedType} from '../shared-types'

type Props = {
  newsfeedItem: NewsfeedQueryNewsfeedItem
}

function formatDate(timestamp: string): string {
  const date = new Date(timestamp)
  var options = {month: 'long', day: 'numeric', year: 'numeric'}
  return date.toLocaleDateString('en-US', options)
}

function getNewsfeedImageUrl(newsfeedItem: NewsfeedQueryNewsfeedItem): string {
  if (newsfeedItem.imageUrl) {
    return newsfeedItem.imageUrl
  } else if (newsfeedItem.itemType === NewsfeedType.ANNOUNCEMENT) {
    return ANNOUNCEMENTS_IMAGE_URL
  } else {
    return PLACEHOLDER_IMAGE_URL
  }
}

// core card used to display items within our newsfeed including announcements, users, and projects
export default function NewsFeedItemCard({newsfeedItem}: Props) {
  const imageUrl = getNewsfeedImageUrl(newsfeedItem)
  const cardHref = `/${newsfeedItem.itemType}s/${newsfeedItem.itemId}`

  const showParticipants =
    !!newsfeedItem.users.length && newsfeedItem.itemType === NewsfeedType.PROJECT
  const showProjects = !!newsfeedItem.projects.length && newsfeedItem.itemType === NewsfeedType.USER

  return (
    <div style={{cursor: 'pointer', padding: '10px 0px'}}>
      <Link href={cardHref}>
        <Card>
          <Columns>
            <ColumnLeft>
              <Icon src={imageUrl} />
            </ColumnLeft>
            <ColumnRight>
              <h2>{newsfeedItem.title}</h2>
              <p>Type: {newsfeedItem.itemType}</p>
              {newsfeedItem.fellowship && <p>Fellowship: {newsfeedItem.fellowship}</p>}
              <p>{formatDate(newsfeedItem.created_ts)}</p>
              <Markdown>{newsfeedItem.description}</Markdown>

              {showParticipants && (
                <>
                  <h3>Participants:</h3>
                  {newsfeedItem.users.map((user) => {
                    const href = `/users/${user.id}`
                    return (
                      <MiniProfile
                        imageUrl={user.avatar_url}
                        name={user.name}
                        href={href}
                        key={user.id}
                      ></MiniProfile>
                    )
                  })}
                </>
              )}

              {showProjects && (
                <>
                  <h3>Projects:</h3>
                  {newsfeedItem.projects.map((project) => {
                    const href = `/projects/${project.id}`
                    return (
                      <MiniProfile
                        imageUrl={project.icon_url}
                        name={project.name}
                        href={`/projects/${project.id}`}
                        key={project.id}
                      ></MiniProfile>
                    )
                  })}
                </>
              )}
            </ColumnRight>
          </Columns>
        </Card>
      </Link>
    </div>
  )
}

const Icon = styled.img`
  background-color: rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  height: 100px;
  width: 100px;
`

const Columns = styled.div`
  display: flex;
  flex-direction: row;
  min-width: 21rem;
`

const ColumnLeft = styled.div`
  display: flex;
  flex-direction: column;
  flex-basis: 7rem;
  flex-grow: 0;
  flex-shrink: 0;
  margin-right: 1.5rem;
`

const ColumnRight = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  flex-shrink: 0;
  flex-basis: 14rem;
`
