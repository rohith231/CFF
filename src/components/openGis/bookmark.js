import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBookmark,
  faWindowClose,
  faCheckCircle,
  faTrash,
  faDotCircle,
  faPen,
} from "@fortawesome/free-solid-svg-icons";
import "./bookmark.css";

let bookmarks = [];
let id = 0;
const Bookmark = ({ showModal }) => {
  return (
    <div className="bookmark-btn" onClick={() => showModal(true)}>
      <FontAwesomeIcon icon={faBookmark} />
    </div>
  );
};

export const BookmarkModal = ({ showModal, showBMarks }) => {
  const [name, setName] = useState(null);
  const [desc, setDesc] = useState(null);
  const [nameErr, setNameErr] = useState(false);
  const [bms, setBms] = useState(bookmarks);
  const [showList, setShowList] = useState(true);
  function addBookmark() {
    if (name === null) {
      setNameErr(true);
      return;
    }
    setNameErr(false);
    id++;
    bookmarks.push({ id: id, name: name, description: desc, active: false });
    setBms([...bookmarks]);
    document.querySelector("#mark-name").value = null;
    setName(null);
  }
  return (
    <>
      <div className="m-container">
        <div className="m-bar">
          <p>New Bookmark</p>
          <FontAwesomeIcon
            icon={faWindowClose}
            onClick={() => showModal(false)}
          />
        </div>
        <div className="m-block">
          <div className="m-form">
            <label htmlFor="mark-name">Name</label>
            <input
              type="text"
              id="mark-name"
              name="mark-name"
              placeholder="Enter Bookmark name"
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          {nameErr ? (
            <p className="m-block-err">* Name cannot be empty</p>
          ) : null}
          {/* <div className="m-form">
            <label htmlFor="mark-desc">Description</label>
            <input
              id="mark-desc"
              name="mark-desc"
              placeholder="Enter Bookmark description"
              onChange={(e) => setDesc(e.target.value)}
            />
          </div> */}
          <div className="m-btns">
            <button
              onClick={() => {
                addBookmark();
              }}
            >
              Save
            </button>
            {/* <button onClick={() => showModal(false)}>Cancel</button> */}
          </div>
        </div>
      </div>
      <div className="mb-container">
        <div className="mb-bar" onClick={() => setShowList(!showList)}>
          <p style={{ margin: 0 }}>My Bookmarks</p>
          <FontAwesomeIcon icon={faBookmark} />
          {/* <FontAwesomeIcon
      icon={faWindowClose}
      onClick={() => showModal(false)}
    /> */}
        </div>
        {showList ? (
          <div className="mb-block">
            {bms.map((b) => (
              <BookmarkItem mark={b} setBms={setBms} />
            ))}
          </div>
        ) : null}
      </div>
    </>
  );
};

// export const MyBookmarks = ({ showModal }) => {
//   const [bms, setBms] = useState(bookmarks);
//   return (
//     <div className="mb-container">
//       <div className="mb-bar">
//         <FontAwesomeIcon icon={faBookmark} />
//         {/* <FontAwesomeIcon
//           icon={faWindowClose}
//           onClick={() => showModal(false)}
//         /> */}
//       </div>
//       <div className="mb-block">
//         {bms.map((b) => (
//           <BookmarkItem mark={b} setBms={setBms} />
//         ))}
//       </div>
//     </div>
//   );
// };

const BookmarkItem = ({ mark, setBms }) => {
  const [edit, setEdit] = useState(false);
  const [name, setName] = useState(mark.name);
  const [desc, setDesc] = useState(mark.description);
  const [nameErr, setNameErr] = useState(false);
  function toggleActive(id) {
    let newB = bookmarks.map((b) => {
      if (b.id === id) {
        return { ...b, active: !b.active };
      }
      return b;
    });
    bookmarks = newB;
    setBms(bookmarks);
  }
  function deleteBookmark(id) {
    let newB = bookmarks.filter((b) => b.id !== id);
    bookmarks = newB;
    setBms(bookmarks);
  }
  function saveEdit(id) {
    if (name === "" || name === null) {
      setNameErr(true);
      return;
    }
    setNameErr(false);
    let newB = bookmarks.map((b) => {
      if (b.id === id) {
        return { ...b, name: name, description: desc };
      }
      return b;
    });
    bookmarks = newB;
    setBms(bookmarks);
    setEdit(!edit);
  }
  return (
    <div className="mb-item">
      <div>
        <FontAwesomeIcon
          icon={faDotCircle}
          className={mark.active ? "mb-item-active" : "mb-item-inactive"}
          onClick={() => toggleActive(mark.id)}
        />
        <p className="mb-item-name">{mark.name}</p>
        <div className="mb-btns">
          <button
            className={edit ? "mb-btn-edit-act" : "mb-btn-edit"}
            onClick={() => setEdit(!edit)}
          >
            <FontAwesomeIcon icon={faPen} />
          </button>
          <button
            className={mark.active ? "mb-btn-check-act" : "mb-btn-check"}
            onClick={() => toggleActive(mark.id)}
          >
            <FontAwesomeIcon icon={faCheckCircle} />
          </button>
          <button
            className="mb-btn-del"
            onClick={() => deleteBookmark(mark.id)}
          >
            <FontAwesomeIcon icon={faTrash} />
          </button>
        </div>
      </div>
      {edit ? (
        <div className="mb-edit-panel">
          <div className="m-form">
            <label htmlFor="mark-name">Name</label>
            <input
              type="text"
              id="mark-name"
              name="mark-name"
              placeholder="Enter Bookmark name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          {nameErr ? (
            <p className="m-block-err">* Name cannot be empty</p>
          ) : null}
          {/* <div className="m-form">
            <label htmlFor="mark-desc">Description</label>
            <input
              id="mark-desc"
              name="mark-desc"
              placeholder="Enter Bookmark description"
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
            />
          </div> */}
          <div className="m-btns">
            <button
              onClick={() => {
                saveEdit(mark.id);
              }}
            >
              Save
            </button>
            <button onClick={() => setEdit(!edit)}>Cancel</button>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default Bookmark;
