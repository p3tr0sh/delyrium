import { graphql, Link } from "gatsby"
import React from "react"

export default function Sheetlist({ data }) {
  const sheetlist = data.allMarkdownRemark.nodes
  return (
    <div>
      {sheetlist.map(sheet=> (
        <Link to={`/sheets/${sheet.frontmatter.slug}`} key={sheet.id}>
          <div>
            <h3>{sheet.frontmatter.title}</h3>
            <p>{sheet.frontmatter.band}</p>
          </div>
        </Link>
      ))}
    </div>
  )
}

export const query = graphql`
query sheetlist {
  allMarkdownRemark {
    nodes {
      frontmatter {
        band
        key
        tags
        title
        slug
      }
      id
    }
  }
}
`
