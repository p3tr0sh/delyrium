import { graphql, Link, navigate } from "gatsby"
import React, { useState } from "react"
import { Router } from "@reach/router"
import SheetPage from "../util/sheet-details"
import { match } from "../util/util"

const Home = ({sheetlist, searchString}) => {
  if (searchString !== "") {
    sheetlist.sort((a,b) => {return match(b.frontmatter, searchString) - match(a.frontmatter, searchString)})
  }
  return (
    <div>
      {sheetlist.map(sheet => {
        if (searchString === "" || match(sheet.frontmatter, searchString) >= 0.5) {
          return (
            <Link to={`/sheets/${sheet.frontmatter.slug}`} key={sheet.id}>
              <div>
                <h3>{sheet.frontmatter.title}</h3>
                <p>{sheet.frontmatter.band}</p>
              </div>
            </Link>
          )
        } else {
          return (<></>)
        }
      })}
    </div>
  )
}

// TODO: Loading all pages at once can perform badly for huge libraries, fix with LazyLoad vs offline mode?
export default function Sheetlist({ data }) {
  const [searchString, setSearchString] = useState("")

  const sheetlist = data.allMarkdownRemark.nodes
  sheetlist.sort((a,b) => a.frontmatter.title.localeCompare(b.frontmatter.title))
  const NotFound = () => (<div onLoad={navigate("/", {replace: true})}>Page not found</div>)


  return (
    <>
      <Link to="/">Home</Link>
      <input onChange={(event) => {setSearchString(event.target.value)}} />
      <Router>
        <Home sheetlist={sheetlist} searchString={searchString} path="/" />
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
