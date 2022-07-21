import { graphql, Link, navigate } from "gatsby"
import React, { useState } from "react"
import { Router } from "@reach/router"
import SheetPage from "../util/sheet-details"
import { match } from "../util/util"
import * as styles from '../styles/home.module.css'
import Album from '../../assets/album.svg'
import Wohldenberg from '../../assets/wohldenberg.svg'
import Ukulele from '../../assets/ukulele.svg'
import Magnifier from '../../assets/magnifier.svg'

const Tags = ({tags}) => {
  const allTags = tags.replace(", ", ",").split(",")
  return (<span className={styles.tags}>
  {allTags.map(tag => {
    if (tag.startsWith("album:")) {
      return (<><Album className={styles.icon} />{tag.replace("album: ", "").replace("album:", "")}</>)
    }
    if (tag === "wohldenberg") {
      return (<Wohldenberg className={styles.icon} />)
    }
    if (tag === "ukulele") {
      return (<Ukulele className={styles.icon} />)
    }
    return (<>{tag}</>)
  })}
  </span>)
}

const Home = ({sheetlist, searchString, setSearchString}) => {
  if (searchString !== "") {
    sheetlist.sort((a,b) => {return match(b.frontmatter, searchString) - match(a.frontmatter, searchString)})
  }
  return (
    <>
      <div className={styles.searchbar}>
        <Magnifier className={styles.icon} />
        <input onChange={(event) => {setSearchString(event.target.value)}} />
      </div>
      <h1 style={{textAlign: "center", margin: "0px"}}>Delyrium</h1>
      <div className={styles.cardbox}>
        {sheetlist.map(sheet => {
          if (searchString === "" || match(sheet.frontmatter, searchString) >= 0.5) {
            return (
              <Link to={`/sheets/${sheet.frontmatter.slug}`} key={sheet.id} className={styles.card}>
                <div>
                  <h3 className={styles.title}>{sheet.frontmatter.title}</h3>
                  <div className={styles.band}>
                    {sheet.frontmatter.band}
                    <Tags tags={sheet.frontmatter.tags ?? ""} />
                  </div>
                </div>
              </Link>
            )
          } else {
            return (<></>)
          }
        })}
      </div>
    </>
  )
}

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
