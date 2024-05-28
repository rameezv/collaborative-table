# Collaborative Table Project

This project, an anonymous realtime collaborative table, demonstrates how to embed a React component inside an Angular app seamlessly.
The React component also demonstrates how to interact with a Websocket server.

## Architecture

- Server: `collaborative-table-server`
    - Node.js server that starts an HTTPS server and uses the `ws` library to set up a simple Websocket server.
    - This server is deployed on a Digital Ocean droplet running nginx.
- Client: `collaborative-table-dashboard`
    - Angular app that embeds the React component.
    - This app is deployed on a Firebase and connects to the server securely
    - Styling was handled with Tailwind, as this allows me to use a singular styling paradigm across the Angular app and the React component as well.
    - The React component implementation is located in `collaborative-table-dashboard/src/app/react-socket-table`.
        - The wrapper Angular component uses the React renderer to render the React component.
        - The React component uses use the `useWebsocket` hook to connect to the Websocket server and handle reactivity and polling.

## Run locally

While the project is hosted online already, you can run this locally quite easily.

### Server

Enter the `collaborative-table-server` folder, run `npm install` to install dependencies, and run `npm run start` to start the server. It can be connected to at the address `localhost:4210`.

### Client

Enter the `collaborative-table-dashboard` folder, run `npm install` to install dependencies, and run `npm run start` to start the client. It can be visited at the address `localhost:4200`. If you want to use the local server,
change the URL in `socket-table.tsx` to `ws://localhost:4210`.

## Future work

As time was very limited, I stuck to the project requirements. However, this porject would be followed up with more features and code to handle the following:
    - Error handling on the client side
    - Better typescript integration between server and client
    - Unit and e2e tests to increase stability and confidence
    - Exporting table data to CSV and more
    - Improved documentation and code style
