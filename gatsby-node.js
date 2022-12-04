const path = require("path");


exports.onCreatePage = ({ page, actions }) => {
  const { createPage } = actions
  if (page.path === `/`) {
    page.matchPath = `/*`
    createPage(page)
  }
}

exports.onCreateNode = async ({node, actions, loadNodeContent}) => {
  const {createNodeField} = actions;
  if (node.internal.type === "File" && node.extension === "crd") {
    const content = await loadNodeContent(node);
    const slug = path.join(node.relativeDirectory,node.name);
    createNodeField({
      node,
      name: "content",
      value: content
    });
    createNodeField({
      node,
      name: "slug",
      value: slug
    });
    const metadata = parseMetadata(content);
    createNodeField({
      node,
      name: 'meta',
      value: metadata
    });
  }
}

function parseMetadata(crdFile) {
  const out = {
    'title': "",
    'sorttitle': "",
    'subtitle': "",
    'artist': "",
    'composer': "",
    'lyricist': "",
    'copyright': "",
    'album': "",
    'year': "",
    'key': "",
    'time': "",
    'tempo': "",
    'duration': "",
    'capo': "",
    'tags': "",
    'meta': [""],
  };
  crdFile.split("\n").forEach(line => {
    const directive = line.match(/\{([^\{\}]*): ([^\{\}]*)\}/);
    if(directive) {
      if (directive[1] === 'meta') {
        const spl = directive[2].split(' ');
        if (spl.length > 1 && spl[0] in out) {
          out[spl[0]] = spl[1];
        } else {
          out['meta'].concat(directive[2]);
        }
      } else if(directive[1] in out) {
        out[directive[1]] = directive[2];
      } else if (directive[1] === 't') {
        out['title'] = directive[2];
      } else if (directive[2] === 'st') {
        out['subtitle'] = directive[2];
      }
    }
  });
  return out;
}
