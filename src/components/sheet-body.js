
import React from "react"
import * as styles from '../styles/sheet.module.css'
import Chord from "../util/chord"

export default function SheetBody({body, offset}) {
  return (
    <div className={styles.sheet}>
      {body.split("\n").map(line => {
        if (line === "") {
          return <br/>
        } else if(line[0] === "#") {
          // ignore comments and shebang
          return ""
        } else if(line[0] === "{") {
          // TODO: directives
          return ""
        } else {
          if (line.includes("[")) {
            let chordstring = ""
            let chordbuffer = ""
            let lyrics = ""
            let ischord = false
            let chordlength = 0
            for (const chr of line) {
              if (chr === '[') {
                ischord = true
              } else if (chr === ']') {
                ischord = false
                // transpose
                const chord = new Chord(chordbuffer)
                chordbuffer = chord.transpose(offset).toString()
                chordstring += chordbuffer
                chordlength = chordbuffer.length
                chordbuffer = ""
              } else if (ischord) {
                chordbuffer += chr
              } else {
                lyrics += chr
                if (chordlength === 0) {
                  chordstring += " "
                } else {
                  chordlength -= 1
                }
              }
            }
            return (
              <>
                <span className={styles.chords}>{chordstring}</span>
                <br/>
                <span>{lyrics}</span>
                <br/>
              </>
            )
          } else {
            return (
              <>
                <span>{line}</span>
                <br/>
              </>
            )
          }
        }
      })}
    </div>
  )
}
