"use client";

import React from "react";
import { useAuthUser } from "../../context/AuthUserContext";
import {
    soloEventRegistration,
    soloEventRegistrationiitp,
} from "../Event Registration/soloEventRegistration";
import { ToastContainer, toast } from "react-toastify";
import styles from "./Modal.module.css";
import { useRouter } from "next/navigation";
import Image from "next/image";

const Modal = (props) => {
    const router = useRouter();
    const userData = useAuthUser(); // FIXED

    function handleRagister() {
        if (!userData?.isAuth) {
            return router.push("/userLogin");
        }

        const user = userData.user; // FIX — single easy access

        if (!props.body.is_active) {
            return toast.info("Registration Closed !");
        }

        if (props.body.is_solo) {
            if (
                user?.user_type !== "iitp_student" ||
                props.body.id === "EVT49870" ||
                props.body.id === "EVT68cb3"
            ) {
                if (props.body.registration_fee === "0.00") {
                    soloEventRegistrationiitp(
                        props.body.id,
                        router,
                        props.closeHandler
                    );
                } else {
                    soloEventRegistration(
                        props.body.id,
                        props.body.registration_fee,
                        user?.email_id,
                        user?.phone_number,
                        user?.anwesha_id,
                        router,
                        props.closeHandler
                    );
                }
            } else {
                if (props.body.tags === "5") {
                    soloEventRegistration(
                        props.body.id,
                        props.body.registration_fee,
                        user?.email_id,
                        user?.phone_number,
                        user?.anwesha_id,
                        router,
                        props.closeHandler
                    );
                } else {
                    soloEventRegistrationiitp(
                        props.body.id,
                        router,
                        props.closeHandler
                    );
                }
            }
        } else {
            router.push({
                pathname: `/event-registration/${props.body.id}`,
                query: {
                    id: props.body.id,
                    name: props.body.name,
                    description: props.body.description,
                    max_team_size: props.body.max_team_size,
                    min_team_size: props.body.min_team_size,
                    registration_fee: props.body.registration_fee,
                    user_type: user?.user_type,
                    tags: props.body.tags,
                },
            });
        }
    }

    const description = (props.body.description || "").replace(/\n/g, "<br />");

    return (
        <>
            <ToastContainer />
            <div
                id="backdrop"
                className={styles.modal}
                onClick={props.closeHandler}
            >
                <div
                    className={styles.modalContent}
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className={styles.modal_head}>
                        <h1>{props.title}</h1>
                        <Image
                            src="/events/close.svg"
                            alt="Close"
                            height={40}
                            width={40}
                            onClick={props.closeHandler}
                            style={{ cursor: "pointer" }}
                        />
                    </div>

                    <hr style={{ width: "100%", height: "2px", marginBottom: "35px" }} />

                    <div
                        style={{
                            display: "flex",
                            flexDirection: "row",
                            columnGap: "30px",
                            flexWrap: "wrap",
                            alignItems: "center",
                            justifyContent: "space-evenly",
                            overflowY: "scroll",
                            paddingBottom: "50px",
                        }}
                    >
                        <div className={styles.leftColumn}>
                            <img
                                src={props.body.poster || "/events/poster.png"}
                                alt="poster"
                                width={220}
                                height={220}
                                style={{ borderRadius: "15px" }}
                            />

                            {props.body.video && (
                                <a
                                    target="_blank"
                                    rel="noreferrer"
                                    className={styles.btn}
                                    href={props.body.video}
                                >
                                    Rulebook
                                </a>
                            )}

                            <button className={styles.btn} onClick={handleRagister}>
                                Register
                            </button>
                        </div>

                        <div className={styles.modal_body}>
                            <div className={styles.date_venue}>
                                <span className={styles.date_text}>Date:</span>
                                <span className={styles.date_value}>
                                    {new Date(props.body.start_time).toLocaleDateString()} -{" "}
                                    {new Date(props.body.end_time).toLocaleDateString()}
                                </span>
                                <br />
                                <span className={styles.date_text}>Venue:</span>
                                <span className={styles.date_value}>{props.body.venue}</span>
                            </div>

                            <p
                                className={styles.description}
                                dangerouslySetInnerHTML={{ __html: description }}
                            />

                            <div className={styles.team_pay}>
                                <div style={{ fontWeight: "600" }}>
                                    {props.body.max_team_size === 1
                                        ? "Individual Participation"
                                        : `${props.body.min_team_size} - ${props.body.max_team_size} members`}
                                </div>

                                {props.body.registration_fee &&
                                    (userData?.user?.user_type !== "iitp_student" ||
                                        props.body.id === "EVT49870" ||
                                        props.body.id === "EVT68cb3") && (
                                        <p>
                                            Registration Fee&nbsp;
                                            <span style={{ fontWeight: "600" }}>
                                                ₹{props.body.registration_fee}
                                            </span>
                                        </p>
                                    )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Modal;
