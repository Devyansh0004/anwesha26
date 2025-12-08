"use client";

import React, { useState, useEffect } from "react";
import styles from "./profile.module.css";
import { useAuthUser } from "../../context/AuthUserContext";
import toast from "react-hot-toast";

export default function Details() {
  const { currentUser, updateUser } = useAuthUser();
  const [edit, setEdit] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    gender: "",
    dob: "",
    personalPhone: "",
    collegeName: "",
    collegeCity: "",
    passingYear: "",
    address: "",
    contactPhone: "",
    email: "",
  });
console.log("🔥 Full Firestore User Object:", currentUser);
  useEffect(() => {
  if (!currentUser) return;
  

  setFormData({
    firstName: currentUser.personal?.firstName || "",
    lastName: currentUser.personal?.lastName || "",
    gender: currentUser.personal?.gender || "",
    dob: currentUser.personal?.dob || "",

    personalPhone: currentUser.personal?.phone || "",

    collegeName: currentUser.college?.name || "",
    collegeCity: currentUser.college?.city || "",
    passingYear: currentUser.college?.passingYear || "",

    address: currentUser.contact?.address || "",
    contactPhone: currentUser.contact?.phone || "",

    email: currentUser.email || "",
  });
}, [currentUser]);


  const handleSubmit = async () => {
    if (!currentUser?.uid) {
      toast.error("Session expired. Login again.");
      return;
    }

    try {
      await updateUser(currentUser.uid, {
        "personal.firstName": formData.firstName,
        "personal.lastName": formData.lastName,
        "personal.gender": formData.gender,
        "personal.dob": formData.dob,
        "personal.phone": formData.personalPhone,

        "college.name": formData.collegeName,
        "college.city": formData.collegeCity,
        "college.passingYear": formData.passingYear,

        "contact.address": formData.address,
        "contact.phone": formData.contactPhone,
      });

      toast.success("Profile updated successfully!");
      setEdit(false);
    } catch (err) {
      console.error(err);
      toast.error("Failed to update");
    }
  };

  if (!currentUser) return <p>Loading...</p>;

  return (
    <div className={styles.container}>
      {!edit && (
        <img
          src="/assets/edit.svg"
          className={styles.editIcon}
          onClick={() => setEdit(true)}
        />
      )}

      {/* FIRST NAME */}
      <div className={styles.field}>
        <label>First Name</label>
        <input
          value={formData.firstName}
          disabled={!edit}
          onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
        />
      </div>

      {/* LAST NAME */}
      <div className={styles.field}>
        <label>Last Name</label>
        <input
          value={formData.lastName}
          disabled={!edit}
          onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
        />
      </div>

      {/* EMAIL (read only) */}
      <div className={styles.field}>
        <label>Email ID</label>
        <input value={formData.email} disabled />
      </div>

      {/* PERSONAL PHONE */}
      <div className={styles.field}>
        <label>Phone Number</label>
        <input
          value={formData.personalPhone}
          disabled={!edit}
          maxLength={10}
          onChange={(e) =>
            setFormData({ ...formData, personalPhone: e.target.value })
          }
        />
      </div>

      {/* GENDER */}
      <div className={styles.field}>
        <label>Gender</label>
        <select
          disabled={!edit}
          value={formData.gender}
          onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
        >
          <option>male</option>
          <option>female</option>
          <option>other</option>
        </select>
      </div>

      {/* DOB */}
      <div className={styles.field}>
        <label>Date of Birth</label>
        <input
          type="date"
          disabled={!edit}
          value={formData.dob}
          onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
        />
      </div>

      {/* COLLEGE NAME */}
      <div className={styles.field}>
        <label>College Name</label>
        <input
          value={formData.collegeName}
          disabled={!edit}
          onChange={(e) => setFormData({ ...formData, collegeName: e.target.value })}
        />
      </div>

      {/* COLLEGE CITY */}
      <div className={styles.field}>
        <label>City</label>
        <input
          value={formData.collegeCity}
          disabled={!edit}
          onChange={(e) => setFormData({ ...formData, collegeCity: e.target.value })}
        />
      </div>

      {/* PASSING YEAR */}
      <div className={styles.field}>
        <label>Passing Year</label>
        <input
          value={formData.passingYear}
          disabled={!edit}
          onChange={(e) => setFormData({ ...formData, passingYear: e.target.value })}
        />
      </div>

      {/* ADDRESS */}
      <div className={styles.field}>
        <label>Address</label>
        <input
          value={formData.address}
          disabled={!edit}
          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
        />
      </div>

      {/* CONTACT PHONE */}
      <div className={styles.field}>
        <label>Alternate Contact Number</label>
        <input
          value={formData.contactPhone}
          disabled={!edit}
          maxLength={10}
          onChange={(e) =>
            setFormData({ ...formData, contactPhone: e.target.value })
          }
        />
      </div>

      {edit && (
        <div className={styles.button_row}>
          <button onClick={() => setEdit(false)}>CANCEL</button>
          <button onClick={handleSubmit}>SAVE</button>
        </div>
      )}
    </div>
  );
}
