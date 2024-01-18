"use client";
import React from "react";
import { createComponent } from "@lit/react";
import { TcLine, TcPie } from "@weblogin/trendchart-elements";

export const TcLineReact = createComponent({
  tagName: "tc-line",
  elementClass: TcLine,
  react: React,
});
export const TcPieReact = createComponent({
  tagName: "tc-pie",
  elementClass: TcPie,
  react: React,
});
