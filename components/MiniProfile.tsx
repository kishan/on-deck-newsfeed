import Link from 'next/link'
import styled from 'styled-components'

type MiniProfileListProps = {
  imageUrl: string
  name: string
  href: string
}

// display mini profile including avatar and hyperlinked name
export default function MiniProfile({imageUrl, href, name}: MiniProfileListProps) {
  return (
    <MiniProfileContainer>
      <MiniProfileColumnLeft>
        <MiniProfileAvatar src={imageUrl} />
      </MiniProfileColumnLeft>
      <MiniProfileColumnRight>
        <Link href={href}>{name}</Link>
      </MiniProfileColumnRight>
    </MiniProfileContainer>
  )
}

const MiniProfileAvatar = styled.img`
  border-radius: 3px;
  background-color: rgba(0, 0, 0, 0.1);
`

const MiniProfileContainer = styled.div`
  display: flex;
  flex-direction: row;
  margin-bottom: 1rem;
`

const MiniProfileColumnLeft = styled.div`
  flex-basis: 2rem;
  flex-shrink: 0;
  flex-grow: 0;
  margin-right: 1rem;
`

const MiniProfileColumnRight = styled.div`
  flex-basis: 3rem;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
`
