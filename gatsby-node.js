const path = require("path")

exports.createPages = async ({graphql, actions}) => {
  const { data } = await graphql(`
    query Sheets {
      allMarkdownRemark {
        nodes {
          frontmatter {
            slug
          }
        }
      }
    }
  `)

  data.allMarkdownRemark.nodes.forEach(node => {
    actions.createPage({
      path: `/sheets/${node.frontmatter.slug}`,
      component: path.resolve('./src/templates/sheet-details.js'),
      context: {slug: node.frontmatter.slug}
    })
  });
}