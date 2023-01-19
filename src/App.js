import "./styles.css";
import React from "react";
import GridTable from "@nadavshaar/react-grid-table";
import { func, object } from "prop-types";
import { useEffect, useState } from "react";
import styles from "./styles.css";

let url =
  "https://api.streamersonglist.com/v1/streamers/ninya_music/songs/export";

let urlrequest =
  "https://api.streamersonglist.com/v1/streamers/ninya_music/queue";

const queue = [];
const queueNames = [];
let pageSize = 10;

async function getQueue() {
  fetch(urlrequest)
    .then((res) => res.json())
    .then(function (value) {
      for (let i = 0; i < Object.keys(value.list).length; i++) {
        queue.push(value.list[i].songId);
        queueNames.push(value.list[i].title);
      }
    });
}

getQueue();
const texts = {
  search: "Suche:",
  totalRows: "Total Songs:",
  rows: "Rows:",
  selected: "Selected",
  rowsPerPage: "Songs per page:",
  page: "Page:",
  of: "of",
  prev: "Prev",
  next: "Next",
  columnVisibility: "Column visibility"
};
const showRowsInformation = false;

console.log(texts);

const Song = ({
  tableManager,
  value,
  field,
  data,
  column,
  colIndex,
  rowIndex
}) => {
  return (
    <div
      className="rgt-cell-inner"
      style={{ display: "flex", alignItems: "center", overflow: "hidden" }}
    >
      <img src={data.avatar} alt="user avatar" />
      <span className="rgt-text-truncate" style={{ marginLeft: 10 }}>
        {value}
      </span>
    </div>
  );
};

const Doubler = ({
  tableManager,
  value,
  field,
  data,
  column,
  colIndex,
  rowIndex
}) => {
  return (
    <div
      className="rgt-cell-inner"
      style={{ display: "flex", alignItems: "center", overflow: "hidden" }}
    >
      <span className="rgt-text-truncate" style={{ marginLeft: 10 }}>
        {value}
      </span>
      <span className="rgt-text-truncate" style={{ marginLeft: 10 }}>
        {data.title}
      </span>
    </div>
  );
};

const TuEtwas = ({
  tableManager,
  value,
  field,
  data,
  column,
  colIndex,
  rowIndex
}) => {
  //const [buttonText, setButtonText] = useState("Request Song");
  const [isActive, setActive] = useState(false);
  let buttonState = "buttonRequestfailed";
  let buttonText = "Already Requested";

  if (queue.includes(data.id)) {
    buttonText = "Already Requested";
    buttonState = "buttonRequestfailed";
  } else {
    buttonText = "Request Song";
    buttonState = "buttonRequest";
  }

  function button1Geklickt(name) {
    getQueue();
    //setButtonText("Song Reqested");
    setActive(!isActive);

    var part1Url = "https://api.streamersonglist.com/v1/streamers/";
    var streamerID = "ninya_music";
    var songID = name.id;

    var url = part1Url + streamerID + "/queue/" + songID + "/request";
    var xhr = new XMLHttpRequest();
    xhr.open("POST", url);
    xhr.setRequestHeader("accept", "application/json");
    xhr.setRequestHeader("origin", "Musik");
    xhr.setRequestHeader("content-type", "application/json");
    //xhr.setRequestHeader("Content-Length", "0");
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        console.log(xhr.status);
        console.log(xhr.responseText);
      }
    };
    xhr.send(
      JSON.stringify({ username: document.getElementById("fname").value })
    );
    window.alert("Song requested: " + name.artist + " - " + name.title);
    console.log(queue);
  }
  return (
    <>
      <button
        className={buttonState}
        onClick={button1Geklickt.bind(this, data)}
      >
        {buttonText}
      </button>
    </>
  );
};

const AlbumArt = ({ data }) => {
  const [imgurl, setImg] = useState([]);
  useEffect(() => {
    const albumArt = require("album-art");

    /* DEMO */
    const artist = data.artist;
    const options = {
      album: data.title,
      size: "large"
    };
    albumArt(artist, options, function (err, res) {
      setImg(res);
    });
  }, []);
  var alttag;
  alttag = "Cover von " + data.artist + " - " + data.tite;

  return (
    <>
      <img className="zoomer" src={imgurl} alt={alttag} />
    </>
  );
};

const columns = [
  {
    id: 1,
    field: "artist",
    label: "Künstler",
    width: "30%"
  },
  {
    id: 2,
    field: "title",
    label: "Titel",
    width: "30%"
  },
  {
    id: 3,
    label: "Request",
    field: "title",
    cellRenderer: TuEtwas,
    width: "10%"
  },
  {
    id: 4,
    label: "",
    field: "id",
    cellRenderer: AlbumArt,
    width: "5%"
  },
  {
    id: 5,
    label: "Attribute",
    field: "attributes",
    width: "25%",
    searchable: true
  }
];

const App = () => {
  const [rows, setRows] = useState([]);
  useEffect(() => {
    fetch(url)
      .then((res) => res.json())
      .then((out) => setRows(out.items.filter((song) => song.active === true)));
  }, []);

  return (
    <>
      <div className="usernameInput">
        {" "}
        <input
          className="usernameInput"
          type="text"
          id="fname"
          name="fname"
          placeholder="Username"
        />
      </div>
      <GridTable
        columns={columns}
        rows={rows}
        isPaginated={false}
        pageSize={pageSize}
        texts={texts}
      />
    </>
  );
};

export default App;
