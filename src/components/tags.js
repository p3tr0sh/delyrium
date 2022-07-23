import React from "react"
import * as styles from '../styles/home.module.css'
import Album from '../../assets/album.svg'
import Wohldenberg from '../../assets/wohldenberg.svg'
import Ukulele from '../../assets/ukulele.svg'


export default function Tags({tags}) {
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
