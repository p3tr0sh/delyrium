import { graphql, Link, navigate } from "gatsby"
import React, { useState } from "react"
import { Router } from "@reach/router"
import SheetPage from "../components/sheet-details"
import Home from "../components/home"


// TODO: Loading all pages at once can perform badly for huge libraries, fix with LazyLoad vs offline mode?
export default function Sheetlist({ data }) {
  const [searchString, setSearchString] = useState("")

  const sheetlist = data.allMarkdownRemark.nodes
  sheetlist.sort((a,b) => a.frontmatter.title.localeCompare(b.frontmatter.title))
  const NotFound = () => (<div onLoad={navigate("/", {replace: true})}>Page not found</div>)


  return (
    <Router>
      <Home sheetlist={sheetlist} searchString={searchString} setSearchString={setSearchString} path="/" />
      {sheetlist.map(sheet => (
        <SheetPage data={sheet} path={`/sheets/${sheet.frontmatter.slug}`} />
      ))}
      <NotFound default />
    </Router>
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
