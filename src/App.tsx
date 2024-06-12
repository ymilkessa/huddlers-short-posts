import { useCallback, useState, useEffect } from "react";
import { Event, Filter, Metadata } from "./types";
import { Avatar, Box, CircularProgress, Typography } from "@mui/material";
import "./App.css"

const SinglePostBox = ({
  event: ev,
  profile,
}: {
  event: Event;
  profile?: Event;
}) => {
  const getMetadataObject = useCallback((event: Event): Metadata => {
    try {
      return JSON.parse(event.content);
    } catch (e) {
      return {};
    }
  }, []);

  const metadata = profile ? getMetadataObject(profile) : {};
  const picture =
    metadata.picture ||
    "https://yt3.ggpht.com/a/AATXAJy95ke01msPUiPiieinGX3qX7BDR5ozsqHXNQ=s900-c-k-c0xffffffff-no-rj-mo";
  const name = metadata.name || "Unknown";

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "left",
        alignItems: "top",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          margin: "0.5rem",
        }}
      >
        <Avatar
          src={picture}
          alt="Profile"
          sx={{ width: 40, height: 40 }}
          title={name}
        />
      </div>
      <Typography
        sx={{
          padding: "0.1rem 0.5rem",
          borderRadius: "4px",
          border: "1px solid black",
          textAlign: "left",
          margin: "0.5rem",
          maxWidth: "50vmax",
          minWidth: "200px",
          overflow: "hidden",
          // backgroundColor: (theme) => theme.palette.background.paper,
          // color: (theme) => theme.palette.text.primary,
        }}
      >
        {ev.content}
      </Typography>
    </div>
  );
};


// /**
//  * Below is the filter used to create this cache.
//  * Fetches kind-1 posts by 5 random authors on Nostr (Jack Dorsey + 4 others)
//  */
// const filter: Filter = {
//   authors: [
//     "82341f882b6eabcd2ba7f1ef90aad961cf074af15b9ef44a09f9d2a8fbfbe6a2",
//     "e88a691e98d9987c964521dff60025f60700378a4879180dcbbb4a5027850411",
//     "0d06480b0c6e3be3c9a1a65d7e6bc2091227d55bf4c77eeb6037ba7776c300ec",
//     "b708f7392f588406212c3882e7b3bc0d9b08d62f95fa170d099127ece2770e5e",
//     "bf2376e17ba4ec269d10fcc996a4746b451152be9031fa48e74553dde5526bce",
//   ],
//   since: 1713153600,
//   kinds: [1],
// };

// const relays = ["wss://relay.primal.net"];

const serverUrl = "https://api.huddlers.dev";
const fetchEndpoint = "/fetch";
const cacheId = "5dcb70c39905ccb68e739563cca1c45649b63aa072b18650d0d7b3c7b3d7e644";

const ShortPostsApp = () => {
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState<Event[]>([]);
  const [profiles, setProfiles] = useState<Map<string, Event>>(new Map());

  const fetchEvents = useCallback(async () => {
    try {
      const response = await fetch(
        `${serverUrl}${fetchEndpoint}?cache_id=${cacheId}`,
        {
          mode: "cors",
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      );
      const eventsData = await response.json();

      if (eventsData.events && Array.isArray(eventsData.events)) {
        setEvents(eventsData.events);
        setProfiles(new Map(Object.entries(eventsData.profiles)));
        return eventsData.events.length;
      }
    } catch (err) {
      console.log("Error", err);
    }
    return 0;
  }, []);

  useEffect(() => {
    fetchEvents().then(() => setLoading(false));
  }, []);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        boxSizing: "border-box",
      }}
    >
      <Typography variant="h4" sx={{ margin: "1rem" }}>
        Short Posts
      </Typography>
      {events.map((element) => (
        <SinglePostBox
          key={element.id}
          event={element}
          profile={profiles.get(element.pubkey)}
        />
      ))}
    </Box>
  );
};


export default ShortPostsApp;
