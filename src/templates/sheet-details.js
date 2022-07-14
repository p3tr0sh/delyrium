import { graphql } from "gatsby"
import React from "react"

export default function SheetDetails({ data }) {
  const { html } = data.markdownRemark
  const { title, band, key, tags } = data.markdownRemark.frontmatter
  return (
    <div>
      <h2>{title}</h2>
      <h3>{band}</h3>
      <p>{key}</p>
      <strong>{tags}</strong>
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  )
}

export const query = graphql`
query SheetDetails($slug: String) {
  markdownRemark(frontmatter: {slug: {eq: $slug}}) {
    html
    frontmatter {
      band
      key
      tags
      title
    }
  }
}

`