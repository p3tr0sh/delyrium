import React, { useState } from "react"
import * as styles from '../styles/sheet.module.css'
import Chord from "../util/chord"
import SheetBody from "./sheet-body"
import { Link } from "gatsby"
import Home from '../../assets/home.svg'
import Head from "./head"

export default function SheetPage({ data }) {
  const { title, artist, capo } = data.meta
  const originalKey = capo === "" ? data.meta.key : `${data.meta.key}+${capo}`;

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
    <>
      <Head breadcrumbs={[title, artist]} />
      <Link to="/" className={styles.homebutton}><Home className={styles.icon} /></Link>
      <div className={styles.layout}>
        <div className={styles.head}>
          <div>
            <h2>{title}</h2>
            <h3>{artist}</h3>
          </div>
          <div className={styles.transpose}>
            <button onClick={() => {transpose(-1)}}>Transpose -1</button>
            <span className={styles.chords} id="key">{key}</span>
            <button onClick={() => {transpose(+1)}}>Transpose +1</button>
            <span className={styles.tags}>{capo}</span>
          </div>
        </div>
        <SheetBody body={data.content} offset={offset}/>
      </div>
    </>
  )
}
