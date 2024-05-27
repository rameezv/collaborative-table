import { WebSocketServer } from "ws";
import { readFileSync } from "fs";
import { createServer } from "http";
import { v4 as uuidv4 } from "uuid";

const server = createServer({
	cert: readFileSync("/etc/letsencrypt/live/collaborative-table-server.rameez.me/cert.pem"),
	key: readFileSync("/etc/letsencrypt/live/collaborative-table-server.rameez.me/privkey.pem"),
});
const webSocketServer = new WebSocketServer({ server });
const port = 4210;
server.listen(port, () => {
  console.log(`Webserver running`);
});

const sessions = {};

const handleMessage = (connection, message, sessionId) => {
  const parsedMessage = JSON.parse(message.toString());
  console.log(parsedMessage, sessionId);

  switch (parsedMessage.type) {
    case "register":
      if (!sessions[sessionId]) {
        sessions[sessionId] = {rows: [], connections: [connection], columnCount: 3};
      } else {
				sessions[sessionId].connections.push(connection);
      }
			sessions[sessionId].connections.map(c => c.send(
        JSON.stringify({ type: "registered", sessionId }),
			));
			break;
		case "unregister":
			onClose(connection, sessionId);
			break;
    case "addRow":
      if (sessionId) {
        const row = {
          id: uuidv4(),
          values: parsedMessage.values,
        };
        sessions[sessionId].rows.push(row);
				sessions[sessionId].connections.map(c => c.send(JSON.stringify({ type: "rowAdded", row })));
				sessions[sessionId].connections.map(c => c.send(JSON.stringify({ type: "rows", rows: sessions[sessionId].rows })));

      } else {
        console.error({ type: "error", message: "Session not registered" });
      }
      break;
    case "getRows":
      if (sessionId) {
				sessions[sessionId].connections.map(c => {
					c.send(JSON.stringify({ type: "rows", rows: sessions[sessionId].rows }));
					c.send(JSON.stringify({ type: "columnCount", columnCount: sessions[sessionId].columnCount }));
				});
      } else {
        console.error({ type: "error", message: "Session not registered" });
      }
			break;
		case "deleteRow":
			if (sessionId) {
				sessions[sessionId].rows = sessions[sessionId].rows.filter(row => row.id !== parsedMessage.rowId);
				sessions[sessionId].connections.map(c => {
					c.send(JSON.stringify({ type: "rowDeleted", rowId: parsedMessage.rowId }));
					c.send(JSON.stringify({ type: "rows", rows: sessions[sessionId].rows }));
					c.send(JSON.stringify({ type: "columnCount", columnCount: sessions[sessionId].columnCount }));
				});
			} else {
				console.error({ type: "error", message: "Session not registered" });
			}
			break;
		case "addColumn":
			if (sessionId) {
				if (sessions[sessionId].columnCount < 5) {
					sessions[sessionId].columnCount++;
				}
				sessions[sessionId].connections.map(c => c.send(JSON.stringify({ type: "columnCount", columnCount: sessions[sessionId].columnCount })));
			} else {
				console.error({ type: "error", message: "Session not registered" });
			}
			break;
		case "deleteColumn":
			if (sessionId) {
				if (sessions[sessionId].columnCount > 1) {
					sessions[sessionId].columnCount--;
				}
				sessions[sessionId].connections.map(c => c.send(JSON.stringify({ type: "columnCount", columnCount: sessions[sessionId].columnCount })));
			} else {
				console.error({ type: "error", message: "Session not registered" });
			}
			break;
    default:
      console.error("Unknown message type");
  }
};

const onClose = (connection, sessionId) => {
	const connectionIndex = sessions[sessionId].connections.indexOf(connection);
	const thisConnection = sessions[sessionId].connections.splice(connectionIndex, 1);
	thisConnection[0].close();
	if (sessions[sessionId].connections.length === 0) {
		delete sessions[sessionId];
		console.log(`${sessionId} deleted.`);
	}
	console.log(`${sessionId} disconnected.`);
}

webSocketServer.on("connection", function (connection, request) {
  const sessionId = request.url.split("/").pop();

  console.log("Received a new connection for session with id " + sessionId);

  console.log(`${sessionId} connected.`);
	connection.on("message", (message) => handleMessage(connection, message, sessionId));
	connection.on("close", () => onClose(connection, sessionId));
});
