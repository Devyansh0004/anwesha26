"use client";

import React, { useState, useEffect } from "react";
import styles from "./profile.module.css";
import { useAuthUser } from "../../context/AuthUserContext";

const host = process.env.NEXT_PUBLIC_HOST;

export default function MyEvents() {
  const { currentUser } = useAuthUser();
  const [events, setEvents] = useState({ solo: [], team: [] });
  const [passes, setPasses] = useState([]);

  useEffect(() => {
    async function fetchMyEvents() {
      try {
        const response = await fetch(`${host}/event/myevents`, {
          method: "GET",
          credentials: "include",
        });

        const result = await response.json();
        setEvents(result);
      } catch (error) {
        console.log("Error fetching events:", error);
      }
    }

    fetchMyEvents();
  }, []);

  useEffect(() => {
    if (!currentUser) return;

    async function fetchPasses() {
      try {
        const response = await fetch(`${host}/festpasses/get`, {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            anwesha_id: currentUser.anweshaId,
          }),
        });

        const data = await response.json();

        if (data.message === "You are already registered") {
          setPasses([
            {
              event_name: "Festival Pass",
              event_start_time: "2025-02-09T15:30:00Z",
            },
          ]);
        }
      } catch (error) {
        console.log("Error fetching passes:", error);
      }
    }

    fetchPasses();
  }, [currentUser]);

  return (
    <div className={styles.eventsInfo}>
      {/* No events message */}
      {!events.solo?.length &&
      !events.team?.length &&
      !passes.length ? (
        <div>No events registered</div>
      ) : null}

      {/* Pass Section */}
      {passes.length > 0 && (
        <div>
          <div className={styles.eventsHeading}>Passes</div>
          {passes.map((e, i) => (
            <div key={i} className={styles.pass}>
              <img src="/pics/pass.png" alt="pass" />
              <div className={styles.passDetail}>
                <div style={{ fontFamily: "Laila-Bold" }}>{e.event_name}</div>
                <div>8 & 9 Feb, 8 PM Onwards</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Registered Events */}
      {(events.solo?.length > 0 || events.team?.length > 0) && (
        <div>
          <div className={styles.eventsHeading}>Registered Events</div>

          {/* Solo Events */}
          {events.solo?.map((e, i) => (
            <div key={i} className={styles.pass}>
              <img src="/pics/pass.png" alt="event pass" />
              <div className={styles.passDetail}>
                <div style={{ fontFamily: "Laila-Bold" }}>{e.event_name}</div>

                <div>
                  {new Date(e.event_start_time).toLocaleString("default", {
                    day: "numeric",
                    month: "short",
                    hour: "numeric",
                    minute: "numeric",
                  })}

                  {e.event_end_time && (
                    <>
                      {" — "}
                      {new Date(e.event_end_time).toLocaleString("default", {
                        day: "numeric",
                        month: "short",
                        hour: "numeric",
                        minute: "numeric",
                      })}
                    </>
                  )}

                  {` (${e.event_venue})`}
                </div>

                {e.payment_url && (
                  <a
                    href={e.payment_url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Submission link
                  </a>
                )}
              </div>
            </div>
          ))}

          {/* Team Events */}
          {events.team?.map(
            (e, i) =>
              e.payment_done && (
                <div key={i} className={styles.pass}>
                  <img src="/pics/pass.png" alt="team pass" />
                  <div className={styles.passDetail}>
                    <div style={{ fontFamily: "Laila-Bold" }}>
                      {e.event_name}
                    </div>

                    <div>
                      Team: {e.team_name} &nbsp;
                      {e.payment_url && (
                        <a
                          href={e.payment_url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Submission link
                        </a>
                      )}
                    </div>

                    <div>
                      {new Date(e.event_start_time).toLocaleString("default", {
                        day: "numeric",
                        month: "short",
                        hour: "numeric",
                        minute: "numeric",
                      })}

                      {e.event_end_time && (
                        <>
                          {" — "}
                          {new Date(e.event_end_time).toLocaleString("default", {
                            day: "numeric",
                            month: "short",
                            hour: "numeric",
                            minute: "numeric",
                          })}
                        </>
                      )}

                      {` (${e.event_venue})`}
                    </div>
                  </div>
                </div>
              )
          )}
        </div>
      )}
    </div>
  );
}
