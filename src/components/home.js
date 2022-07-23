import { Link } from "gatsby"
import React from "react"
import { match } from "../util/util"
import * as styles from '../styles/home.module.css'
import Magnifier from '../../assets/magnifier.svg'
import Tags from "../components/tags"
import Head from "./head"


export default function Home({sheetlist, searchString, setSearchString}) {
  if (searchString !== "") {
    sheetlist.sort((a,b) => {return match(b.frontmatter, searchString) - match(a.frontmatter, searchString)})
  }
  return (
    <>
      <Head />
      <div className={styles.searchbar}>
        <Magnifier className={styles.icon} />
        <input onChange={(event) => {setSearchString(event.target.value)}} value={searchString} />
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
