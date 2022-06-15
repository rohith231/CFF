import {
  faFile,
  faFileImage,
  faFileAlt,
  faFilePdf,
  faFileArchive,
  faFileWord,
} from "@fortawesome/free-solid-svg-icons";

const iconByType = (type) => {
  if (type === "image/jpeg") {
    return faFileImage;
  } else if (type === "image/png") {
    return faFileImage;
  } else if (type === "text/plain") {
    return faFileAlt;
  } else if (type === "application/pdf") {
    return faFilePdf;
  } else if (type === "application/x-zip-compressed") {
    return faFileArchive;
  } else if (
    type ===
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ) {
    return faFileWord;
  } else {
    return faFile;
  }
};

export default iconByType;
