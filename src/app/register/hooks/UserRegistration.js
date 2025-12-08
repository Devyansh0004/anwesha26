"use client";
import { useState } from "react";
import toast from "react-hot-toast";

export function useRegistration() {

    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({});
    const [anweshaId, setAnweshaId] = useState(null);

    const update = (data) => {
        setFormData(prev => ({ ...prev, ...data }));
    };

    const next = () => setStep(s => s + 1);

    const validateStep1 = ({email, password}) => {
        if (!email.match(/^\S+@\S+\.\S+$/)) {
            toast.error("Invalid Email");
            return false;
        }
        if (password.length < 6){
            toast.error("Weak Password");
            return false;
        }
        return true;
    };

    const validateStep2 = ({phone, firstName}) => {
        if (phone.length !== 10){
            toast.error("Phone must be 10 digits");
            return false;
        }
        if (!firstName || firstName.length < 3){
            toast.error("Name too short");
            return false;
        }
        return true;
    };

    const submitFinal = async () => {
        try {
            toast.loading("Registering...");
            const res = await fetch("/api/register", {
                method:"POST",
                headers:{ "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });

            const data = await res.json();
            toast.dismiss();

            if (!res.ok) throw new Error(data.message);

            toast.success("Registration Done!");
            setAnweshaId(data.anweshaId);
            next();
        } catch(err){
            toast.error(err.message);
        }
    };

    return {
        step,
        formData,
        next,
        update,
        validateStep1,
        validateStep2,
        submitFinal,
        anweshaId
    };
}
