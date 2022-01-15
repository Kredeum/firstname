import svelte from "rollup-plugin-svelte";
import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import livereload from "rollup-plugin-livereload";
import { terser } from "rollup-plugin-terser";
import css from "rollup-plugin-css-only";
import json from "@rollup/plugin-json";

import typescript from "@rollup/plugin-typescript";
import sveltePreprocess from "svelte-preprocess";

import replace from "@rollup/plugin-replace";
import dotenv from "dotenv";
import findupSync from "findup-sync";

if (!process.env.ENVIR) {
  dotenv.config({ path: findupSync(".env") || "" });
  if (!process.env.ENVIR) {
    throw new Error("HARDHAT : ENV variable ENVIR not set!");
  }
}

const production = process.env.ENVIR == "PROD";
console.log("production", production);

const envKeys = () => {
  return Object.keys(process.env).reduce(
    (envValues, envValue) => ({
      ...envValues,
      [`process.env.${envValue}`]: JSON.stringify(process.env[envValue])
    }),
    {}
  );
};
// console.log("envKeys ~ envKeys", envKeys());

function serve() {
  let server;

  function toExit() {
    if (server) server.kill(0);
  }

  return {
    writeBundle() {
      if (server) return;
      server = require("child_process").spawn("npm", ["run", "start", "--", "--dev"], {
        stdio: ["ignore", "inherit", "inherit"],
        shell: true
      });

      process.on("SIGTERM", toExit);
      process.on("exit", toExit);
    }
  };
}

const toRollupConfig = function () {
  return {
    input: "./svelte/main.ts",
    output: {
      sourcemap: !production,
      format: "iife",
      name: "app",
      file: "dapp/build/bundle.js"
    },
    plugins: [
      svelte({
        preprocess: sveltePreprocess({ sourceMap: !production }),
        compilerOptions: {
          dev: !production
        }
      }),

      css({ output: "bundle.css" }),

      replace({
        preventAssignment: true,
        values: envKeys()
      }),

      typescript({
        sourceMap: !production,
        inlineSources: !production
      }),

      resolve({
        browser: true,
        dedupe: ["svelte"]
      }),
      json(),
      commonjs(),

      !production && serve(),

      !production && livereload("dapp"),

      production && terser()
    ],
    watch: {
      clearScreen: false
    },
    onwarn: function (warning) {
      if (warning.code === "THIS_IS_UNDEFINED" || warning.code === "CIRCULAR_DEPENDENCY") {
        return;
      }
      console.warn(warning.message);
    }
  };
};

export default [toRollupConfig()];
