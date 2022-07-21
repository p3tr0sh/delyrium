import React, { useState } from "react"
import * as styles from '../styles/sheet.module.css'
import Chord from "./chord"
import SheetBody from "./sheet-body"

export default function SheetPage({ data }) {
  const { rawMarkdownBody } = data
  const { title, band, tags } = data.frontmatter
  const originalKey = data.frontmatter.key
  const [key, setKey] = useState(originalKey)
  const [offset, setOffset] = useState(0)

  function transpose(amount) {
    const k = new Chord(key)
    k.transpose(amount)
    setKey(k.toString())
    const tmpoff = ((offset + amount) % 12 + 12) % 12
    setOffset(amount < 0 ? tmpoff - 12 : tmpoff)
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
          <span className={styles.tags}>{tags}</span>
        </div>
      </div>
      <SheetBody body={rawMarkdownBody} offset={offset}/>
    </div>
  )
}
