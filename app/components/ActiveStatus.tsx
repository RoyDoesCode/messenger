"use client";

import React from "react";
import useActiveChannel from "../hooks/useActiveChannel";

export default function ActiveStatus() {
    useActiveChannel();

    return null;
}
