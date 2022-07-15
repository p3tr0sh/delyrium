import { graphql } from "gatsby"
import React, { useState } from "react"
import * as styles from '../styles/sheet.module.css'
import Chord from "./chord"
import SheetBody from "./sheet-body"

export default function SheetPage({ data }) {
  const { rawMarkdownBody } = data.markdownRemark
  const { title, band } = data.markdownRemark.frontmatter
  const originalKey = data.markdownRemark.frontmatter.key
  const [key, setKey] = useState(originalKey)
  const [offset, setOffset] = useState(0)

  function transpose(amount) {
    const k = new Chord(key)
    k.transpose(amount)
    setKey(k.toString())
    setOffset(offset + amount)
  }

  return (
    <div className={styles.layout}>
      <div className={styles.head}>
        <div>
          <h2>{title}</h2>
          <h3>{band}</h3>
        </div>
        <div className={styles.transpose}>
          <button onClick={() => {transpose(-1)}}>Transpose -1</button>
          <span className={styles.chords} id="key">{key}</span>
          <button onClick={() => {transpose(+1)}}>Transpose +1</button>
        </div>
      </div>
      {/* <strong>{tags}</strong> */}
      <SheetBody body={rawMarkdownBody} offset={offset}/>
    </div>
  )
}

export const query = graphql`
query SheetDetails($slug: String) {
  markdownRemark(frontmatter: {slug: {eq: $slug}}) {
    frontmatter {
      band
      key
      title
    }
    rawMarkdownBody
  }
}

`
