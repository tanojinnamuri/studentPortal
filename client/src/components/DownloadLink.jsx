import React from "react";

function DownloadLink({ base64String, filename, type }) {
  const downloadUrl = URL.createObjectURL(
    new Blob([base64String], { type: base64String.split(";")[0].split(":")[1] })
  );

  return (
    <a href={downloadUrl} download={filename} style={{ color: "black" }}>
      Download {filename}
    </a>
  );
}

export default DownloadLink;
