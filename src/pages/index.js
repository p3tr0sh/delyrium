import { graphql, navigate } from "gatsby"
import React from "react"
import { Router } from "@reach/router"
import SheetPage from "../components/sheet-details"
import Home from "../components/home"


// TODO: Loading all pages at once can perform badly for huge libraries, fix with LazyLoad vs offline mode?
export default function Sheetlist({ data }) {

  const sheetlist = data.allFile.nodes
  const NotFound = () => (<div onLoad={navigate("/", {replace: true})}>Page not found</div>)



  return (
    <Router>
      <Home sheetlist={sheetlist} path="/" />
      {sheetlist.map(sheet => (
        <SheetPage data={sheet.fields} path={`/sheets/${sheet.fields.slug}`} />
      ))}
      <NotFound default />
    </Router>
  )
}

export const query = graphql`
query sheetlist {
  allFile(filter: {extension: {eq: "crd"}}) {
    nodes {
      fields {
        slug
        content
        meta {
          album
          artist
          capo
          composer
          copyright
          duration
          key
          lyricist
          meta
          sorttitle
          subtitle
          tags
          tempo
          time
          title
          year
        }
      }
      id
    }
  }
}
`
