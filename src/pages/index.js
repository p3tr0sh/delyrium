import { graphql, Link, navigate } from "gatsby"
import React from "react"
import { Router } from "@reach/router"
import SheetPage from "../templates/sheet-details"

const Home = ({sheetlist}) => {
  return (
    <div>
      {sheetlist.map(sheet => (
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

// TODO: Loading all pages at once can perform badly for huge libraries, fix with LazyLoad vs offline mode?
export default function Sheetlist({ data }) {
  const sheetlist = data.allMarkdownRemark.nodes
  sheetlist.sort((a,b) => a.frontmatter.title.localeCompare(b.frontmatter.title))
  const NotFound = () => (<div onLoad={navigate("/", {replace: true})}>Page not found</div>)
  return (
    <>
      <Link to="/">Home</Link>
      <Router>
        <Home sheetlist={sheetlist} path="/" />
        {sheetlist.map(sheet => (
          <SheetPage data={sheet} path={`/sheets/${sheet.frontmatter.slug}`} />
        ))}
        <NotFound default />
      </Router>
    </>
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
      rawMarkdownBody
    }
  }
}
`
