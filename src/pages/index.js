import { graphql } from "gatsby"
import React from "react"
import { BrowserRouter as Router, Link, Navigate, Route, Routes } from "react-router-dom"
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
  return (
    <Router>
      <Link to="/">Home</Link>
      <Routes>
        <Route path="/" element={<Home sheetlist={sheetlist}/>} />
        {sheetlist.map(sheet => (
          <Route element={<SheetPage data={sheet}/>} path={`/sheets/${sheet.frontmatter.slug}`} />
        ))}
        <Route path="*" element={<Navigate replace to="/" />} />
      </Routes>
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
