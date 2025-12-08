"use client";

import React, { useEffect, useRef, useState } from "react";
import QRCode from "react-qr-code";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import Image from "next/image";
import { useRouter } from "next/navigation";

import { useAuthUser } from "@/context/AuthUserContext";
import { db } from "@/lib/firebaseConfig";
import { updateDoc, doc } from "firebase/firestore";

import { generateQrPayload } from "@/services/qr";
import styles from "./profile.module.css";

export default function ProfileDashboard() {
  const { currentUser, loading } = useAuthUser();

  const [qrValue, setQrValue] = useState("");
  const qrRef = useRef(null);
  const router = useRouter();

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState("");

  useEffect(() => {
    if (!loading && !currentUser) router.replace("/login");
    if (currentUser)
      setName(
        `${currentUser.personal?.firstName} ${currentUser.personal?.lastName}`
      );
  }, [loading, currentUser]);

  const handleShowQr = async () => {
    if (!currentUser?.qrEnabled) {
      toast.error("You must register in an event to unlock Entry Pass");
      return;
    }

    const payload = generateQrPayload({
      anweshaId: currentUser.anweshaId,
      firstName: currentUser.personal?.firstName,
      lastName: currentUser.personal?.lastName,
      email: currentUser.email,
      contact: currentUser.contact?.phone,
      college: currentUser.college?.name,
      dob: currentUser.personal?.dob,
      gender: currentUser.personal?.gender,
    });

    try {
      await updateDoc(doc(db, "users", currentUser.uid), { qrTokenId: payload });
      setQrValue(payload);
      toast.success("QR Generated!");
    } catch {
      toast.error("Failed generating QR");
    }
  };

  if (loading || !currentUser) return null;

  return (
    <div className={styles.mainContainer}>
      <div className={styles.welcome}>WELCOME BACK!</div>

      <div className={styles.subContainer}>
        {/* Avatar + Name + ANW ID + QR */}
        <div className={styles.idandqr}>
          <div style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
            {/* Avatar */}
            <div className={styles.userImage}>
              <img src="/pics/circle_greenNobg.png" width={180} height={180} alt="bg" />
              <img src="/pics/mascot 2.png" width={130} height={130} alt="mascot" />
            </div>

            {/* Name + ANW ID */}
            <div>
              <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap" }}>
                {isEditing ? (
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && setIsEditing(false)}
                    autoFocus
                    style={{
                      outline: "none",
                      border: "2px solid lightgray",
                      padding: "10px",
                      fontSize: "24px",
                      borderRadius: "4px",
                      margin: "10px 0",
                    }}
                  />
                ) : (
                  <h1 className={styles.anwesha_username}>{name}</h1>
                )}

                <button onClick={() => setIsEditing(!isEditing)} className={styles.copy}>
                  <motion.div whileTap={{ scale: 0.8 }}>
                    <img src={isEditing ? "/assets/tick.svg" : "/edit.svg"} width={20} height={20} alt="edit" />
                  </motion.div>
                </button>
              </div>

              {/* Anwesha ID */}
              <div style={{ display: "flex", flexDirection: "row" }}>
                <h1 className={styles.anwesha_id}>{currentUser.anweshaId}</h1>

                <button
                  className={styles.copy}
                  onClick={() => {
                    navigator.clipboard.writeText(currentUser.anweshaId);
                    toast.success("Copied!");
                  }}
                >
                  <motion.div whileTap={{ scale: 0.8 }}>
                    <Image src="/copy.svg" width={20} height={20} alt="copy" />
                  </motion.div>
                </button>
              </div>
            </div>
          </div>

          {/* QR RIGHT */}
          <div className={styles.qrcode}>
            {qrValue ? (
              <QRCode value={qrValue} size={200} />
            ) : (
              <img src="/pics/pass.png" width={200} height={200} alt="placeholder" />
            )}
          </div>
        </div>

        {/* DETAILS */}
        <div className={styles.userDetails}>
          <div>
            <h1 className={styles.userDetailsHeading}>Mail ID</h1>
            <h1 className={styles.userDetailsContent}>{currentUser.email}</h1>
          </div>

          <div>
            <h1 className={styles.userDetailsHeading}>Mobile Number</h1>
            <h1 className={styles.userDetailsContent}>{currentUser.contact?.phone}</h1>
          </div>

          <div>
            <h1 className={styles.userDetailsHeading}>Institute / Organization</h1>
            <h1 className={styles.userDetailsContent}>{currentUser.college?.name}</h1>
          </div>
        </div>

        {/* Center Button */}
        <div style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}>
          <button
            onClick={handleShowQr}
            style={{
              width: "200px",
              fontSize: "1.4rem",
              fontWeight: "bold",
              padding: "10px 0",
              borderRadius: "10px",
              backgroundImage: "url('/bg_2_cropped.jpg')",
              backgroundSize: "cover",
              backgroundPosition: "bottom",
              color: "white",
              boxShadow: "0px 4px 8px rgba(0,0,0,0.4)",
            }}
          >
            View Entry Pass
          </button>
        </div>

        {/* Accommodation Notice */}
        <h2
          style={{
            color: "white",
            fontWeight: "normal",
            textAlign: "center",
            letterSpacing: "1px",
            marginTop: "30px",
          }}
        >
          To seek accommodation, fill this&nbsp;
          <a
            href="https://forms.gle/WjTuyC2gR8mHYGzA6"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "skyblue" }}
          >
            FORM
          </a>
        </h2>
      </div>
    </div>
  );
}
