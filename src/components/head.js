import React from "react";
import { Helmet} from "react-helmet";

export default function Head({breadcrumbs}) {
  return (
    <Helmet>
      <title>
        Delyrium
        {breadcrumbs ? ` - ${breadcrumbs.join(" - ")}` : ""}
      </title>
    </Helmet>
  )
}
