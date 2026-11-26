# Smart Campus - Node-RED (Practice 12)

Amantay Bekzat, 24B031646. Thursday 14:00-17:00.

This is the real Node-RED low-code implementation used in the comparison.
It checks Newton 101 using a fixed 09:00 clock and the original fictional
09:00-10:00 and 13:30-15:00 bookings. It does not create bookings.
The visual workflow uses 19 core nodes and no Function nodes.
The surrounding HTML/CSS form is hand-authored and calls the workflow API.

## Run

Use Node.js 24 LTS and npm. From this folder:

```sh
npm ci --ignore-scripts --no-fund
npm start
```

Open the app at http://127.0.0.1:1882/ and the Node-RED editor at
http://127.0.0.1:1882/red/. Select **Run 8 shared tests** in the app to run
the shared acceptance cases against the real HTTP workflow.
Stop with Ctrl+C.

## Files

- `flows.json`: actual workflow export, directly importable into Node-RED.
- `settings.cjs`: local runtime settings, routes and transport middleware.
- `public/`: application UI and common test cases.
- `package.json` and `package-lock.json`: pinned Node-RED dependency setup.

Upload this entire folder's contents to the GitHub repository. The workflow
file alone does not contain the HTML interface or runtime settings.
The dependency and local runtime directories are generated on first run.
