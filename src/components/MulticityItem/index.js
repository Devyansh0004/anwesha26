"use client";

import { useState, useEffect } from "react";
import styles from "./multicityitem.module.css";
import { useRouter } from "next/navigation";
import { useAuthUser } from "@/context/AuthUserContext";
import { db } from "@/lib/firebaseConfig";
import { doc, setDoc, getDoc } from "firebase/firestore";
import toast from "react-hot-toast";

export default function MulticityItem({ event }) {

  const router = useRouter();
  const { currentUser } = useAuthUser();

  const [showPopup, setShowPopup] = useState(false);
  const [alreadyRegistered, setAlreadyRegistered] = useState(false);

  /** 🔍 On load — check if user registered earlier */
  useEffect(() => {
    const checkRegistration = async () => {
      if (!currentUser) return;

      const ref = doc(
        db,
        "multicity",
        event.city,
        "registrations",
        currentUser.uid
      );

      const snap = await getDoc(ref);

      if (snap.exists()) {
        setAlreadyRegistered(true);
      }
    };

    checkRegistration();
  }, [currentUser]);

  /** 🟦 CLICK REGISTER */
  const handleRegister = () => {
    if (!currentUser) {
      return router.push(`/login?from=${encodeURIComponent("/multicity")}`);
    }

    setShowPopup(true);
  };

  /** 🟩 SAVE IN FIRESTORE */
  const confirmRegister = async () => {
    try {
      await setDoc(
        doc(db, "multicity", event.city, "registrations", currentUser.uid),
        {
          userId: currentUser.uid,
          anweshaId: currentUser.anweshaId,
          name: `${currentUser.personal?.firstName} ${currentUser.personal?.lastName}`,
          email: currentUser.email,
          phone: currentUser.contact?.phone,
          college: currentUser.college?.name,
          city: event.city,
          registeredAt: new Date().toISOString(),
        }
      );

      toast.success("Successfully registered!");
      setAlreadyRegistered(true);

    } catch (err) {
      console.error(err);
      toast.error("Registration failed!");
    }

    setShowPopup(false);
  };

  return (
    <>
      {/* ORIGINAL UI — UNTOUCHED */}
      <div className={styles.eventCard}>
        <div className={styles.eventImageWrapper}>
          <div className={styles.eventImageWrapper_dot} />
          <img
            loading="lazy"
            src={event.poster}
            className={styles.eventImageWrapper_box}
          />
        </div>

        <div className={styles.eventBody}>
          <p className={styles.eventTitle}>{event.city}</p>

          <div className={styles.eventDetails}>
            <p><b>Date:</b>&nbsp;{event.date}</p>
            <p><b>Venue:</b>&nbsp;{event.venue}</p>
            <p><b>Registration Deadline:</b>&nbsp;{event.registration_deadline}</p>
            <p><b>Registration Fee:</b>&nbsp;{event.registration_fee}</p>
            <p><b>Timings:</b>&nbsp;{event.timings}</p>

            <span style={{ display: "inline-flex" }}>
              <b>Contact Details:</b>&nbsp;
              {Array.isArray(event.contact) ? (
                <div>
                  {event.contact.map((c, idx) => (
                    <span key={idx}>{c.name} ({c.phone})<br /></span>
                  ))}
                </div>
              ) : (
                `${event.contact.name} (${event.contact.phone})`
              )}
            </span>
          </div>

          {/* 🔥 BUTTON FIX — SHOWS REGISTERED STATE */}
          <div className={styles.eventLinks}>

            <button
              disabled={event.completed || alreadyRegistered}
              className={
                event.completed
                  ? styles.rulebookLink
                  : alreadyRegistered
                  ? styles.registeredBtn
                  : styles.registerLink
              }
              onClick={handleRegister}
            >
              <p>
                {event.completed
                  ? "Conducted"
                  : alreadyRegistered
                  ? "Registered ✓"
                  : "Register"}
              </p>
            </button>

            <a
              className={styles.rulebookLink}
              href={event.rulebook_link}
              target="_blank"
            >
              <p>Rulebook</p>
            </a>
          </div>
        </div>
      </div>

      {/* 🔽 POPUP */}
      {showPopup && (
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-[9999]">
          <div className="bg-white p-6 rounded-xl w-[90%] max-w-sm text-center shadow-lg animate-fade-in">
            <h2 className="text-xl font-semibold mb-3">
              Confirm Registration
            </h2>

            <p>
              Register for <b>{event.city}</b> multicity round?
            </p>

            <div className="mt-5 flex justify-center gap-4">
              <button
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:opacity-80"
                onClick={() => setShowPopup(false)}
              >
                Cancel
              </button>

              <button
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:opacity-90"
                onClick={confirmRegister}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
