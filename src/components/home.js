import { Link } from "gatsby"
import React, { useEffect, useState } from "react"
import { match } from "../util/util"
import * as styles from '../styles/home.module.css'
import Magnifier from '../../assets/magnifier.svg'
import Head from "./head"
import AssetConfig from '../../assets/assets.yml'


export default function Home({sheetlist}) {
  const [searchString, setSearchString] = useState("");
  if (searchString !== "") {
    sheetlist.sort((a,b) => {return match(b.fields.meta, searchString) - match(a.fields.meta, searchString)});
  } else {
    sheetlist.sort((a,b) => a.fields.meta.title.localeCompare(b.fields.meta.title));
  }

  // ---------------------- Icon buffer to avoid loading each icon multiple times
  const [iconBuffer, setIconBuffer] = useState([]);
  const [loadingIcons, setLoadingIcons] = useState(false);
  const [loadingIconsCounter, setLoadingIconsCounter] = useState(0);

  useEffect(() => {
    setLoadingIcons(true);
    const conf = AssetConfig.icons;
    conf.forEach(element => {
      setLoadingIcons(true);
      setLoadingIconsCounter(loadingIconsCounter + 1);
      const importIcon = async () => {
        try {
          const { default: namedImport } = await import(`../../assets/${element.path}`);
          setIconBuffer(oldBuffer => [...oldBuffer, {...element, svg: namedImport}]);
        } catch (err) {
          throw err;
        } finally {
          setLoadingIconsCounter(loadingIconsCounter - 1);
          if (loadingIconsCounter === 0) {
            setLoadingIcons(false);
          }
        }
      };
      importIcon();
    })
  }, []);

  /**
   * Apply icons to the tags
   * @param {string} tags
   * @returns
   */
  function iconifyTags(tags) {
    const allTags = tags.replace(", ", ",").split(",");
    return (
      <>
        {allTags.map((tag) => {
          const iconConf = iconBuffer.find((i) =>
            i.tags.includes(tag) || (i.arguments && i.tags.some((t) => tag.startsWith(t))));
          if (!iconConf) {
            return tag;
          }
          if (!loadingIcons) {
            const { svg: ImportedIcon } = iconConf;
            return (
              <span title={iconConf.name}>
                <ImportedIcon className={styles.icon} />
                {iconConf.arguments && iconConf.tags.reduce((pre, cur) => pre.replace(cur, ""), tag)}
              </span>
            );
          }
          return "";
        })}
      </>
    );
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
          if (searchString === "" || match(sheet.fields.meta, searchString) >= 0.4 + searchString.length * 0.02) {
            return (
              <Link to={`/sheets/${sheet.fields.slug}`} key={sheet.id} className={styles.card} onClick={() => setSearchString("")}>
                  <h3 className={styles.title}>{sheet.fields.meta.title}</h3>
                  <div className={styles.band}>
                    {sheet.fields.meta.artist}
                    {/* {iconifyTags(sheet.frontmatter.tags ?? "")} */}
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
