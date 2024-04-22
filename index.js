import { apiKey, users, usernameToFMName } from "./config.js";

const url = (user) =>
  `http://ws.audioscrobbler.com/2.0/?method=user.gettoptracks&user=${user}&api_key=${apiKey}&format=json&period=7day&limit=100`;

const run = async () => {
  const idsToListeners = {};

  console.log(
    "Here's the overlap between some people's top 100 most-listened songs in the past week:"
  );
  for (let i = 0; i < users.length; i++) {
    const username = users[i];
    const res = await fetch(url(username));
    const data = await res.json();

    const tracks = data.toptracks.track;

    tracks.forEach((track) => {
      const id = `"${track.name}" by ${track.artist.name}`;
      if (!idsToListeners[id]) {
        idsToListeners[id] = [];
      }
      idsToListeners[id].push(
        `${usernameToFMName[username] || username} (#${track["@attr"].rank})`
      );
    });
  }

  Object.keys(idsToListeners).forEach((id) => {
    if (idsToListeners[id].length > 1) {
      console.log(idsToListeners[id].join(", ") + ": " + id);
    }
  });
};

run();
