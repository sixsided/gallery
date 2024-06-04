import { createRequestHandler } from "@remix-run/express";
import express from "express";
import { broadcastDevReady } from "@remix-run/node";

// notice that the result of `remix vite:build` is "just a module"
// import * as build from "./build/server/index.js";



const viteDevServer =
  process.env.NODE_ENV === "production" // per the docs: https://remix.run/docs/en/main/start/quickstart
  // import.meta.env.NODE_ENV === "production" // doesn't work
    ? null
    : await import("vite").then((vite) =>
        vite.createServer({
          server: { middlewareMode: true },
        })
      );


const app = express();

app.use(
  viteDevServer
    ? viteDevServer.middlewares			// dev
    : express.static("build/client")	// prod
);

const build = viteDevServer
  ? () => viteDevServer.ssrLoadModule("virtual:remix/server-build") // HMR x RHoDaRev
  : await import("./build/server/index.js");

// and your app is "just a request handler"
app.all("*", createRequestHandler({ build }));

// app.get('/', (req, res) => res.send('ok'));

// not needed?
// app.use(express.static("app/style")); 
// app.use(express.static("style"));

app.listen(3000, () => {
  console.log("App listening on http://localhost:3000", viteDevServer ? "dev" : "prod");

  if (process.env.NODE_ENV === "development") {
    broadcastDevReady(build);
  }  
});
