import React, { useEffect, useState } from "react";
import useWebSocket from "react-use-websocket";
import { XCircleIcon, PlusCircleIcon, MinusCircleIcon } from "@heroicons/react/24/solid";

interface ReactSocketTableProps {
  sessionId: string;
}

interface MessageFromServer {
  type: string;
  rows: Array<{ id: string; values: string[] }>;
  columnCount: number;
}

const tdStyles = "min-h-8 p-2 break-all bg-slate-950";
const tableBorderSize = "border-yellow-400 border border-collapse";

const ReactSocketTable = ({
  sessionId,
}: ReactSocketTableProps): JSX.Element => {
  const [rows, setRows] = useState<MessageFromServer["rows"]>([]);
  const [tableSize, setTableSize] = useState(3);

  const {
    lastJsonMessage,
    sendJsonMessage,
  }: {
    lastJsonMessage: MessageFromServer;
    sendJsonMessage: (message: any) => void;
  } = useWebSocket(`wss://collaborative-table-server.rameez.me:4210/${sessionId}`, {
    share: true,
    onClose: () => sendJsonMessage({ type: "unregister" }),
    shouldReconnect: () => true,
  });

  useEffect(() => {
    sendJsonMessage({ type: "register" });
    sendJsonMessage({ type: "getRows" });
  }, []);

  useEffect(() => {
    if (lastJsonMessage?.type === "rows") {
      setRows(lastJsonMessage.rows);
    }

    if (lastJsonMessage?.type === "columnCount") {
      setTableSize(lastJsonMessage.columnCount);
    }
  }, [lastJsonMessage]);

  useEffect(() => {
    const interval = setInterval(() => {
      sendJsonMessage({ type: "getRows" });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const submitNewRow = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const values = [];
    for (let [_, value] of formData.entries()) {
      values.push(value);
    }
    form.reset();
    sendJsonMessage({ type: "addRow", values });
  };

  const deleteRow = (rowId: string) => {
    sendJsonMessage({ type: "deleteRow", rowId });
  };

  const addColumn = () => {
    sendJsonMessage({ type: "addColumn" });
  };

  const deleteColumn = () => {
    sendJsonMessage({ type: "deleteColumn" });
  };

  return (
    <div>
      <div className="text-center">
        <div className="my-4">
          Share this link to collaborate with others:
        </div>
          <input className="w-full max-w-2xl bg-slate-800 p-2 rounded-full text-yellow-400 text-center" value={`https://collaborative-table.rameez.me/${sessionId}`} readOnly />
      </div>
      <div className="text-center">
        <div className="mt-4">
          Columns:
        </div>
        <div className="flex justify-center">
          <button onClick={deleteColumn}><MinusCircleIcon className="text-white h-4 w-4 hover:text-yellow-400" /></button>
          <span className="mx-4 text-2xl">{tableSize}</span>
          <button onClick={addColumn}><PlusCircleIcon className="text-white h-4 w-4 hover:text-yellow-400" /></button>
        </div>
      </div>
      <div className="m-auto my-4 min-w-80 overflow-x-scroll">
        <form onSubmit={submitNewRow}>
          <table className="max-w-4xl mx-auto table-fixed border-separate border-spacing-0">
            <thead>
              <tr>
                {Array.from({ length: tableSize }).map((_, i) => (
                  <th
                    key={i}
                    className={`bg-yellow-400 text-black ${tableBorderSize} ${i === 0 ? "rounded-tl-lg" : ""} ${i === tableSize - 1 ? "rounded-tr-lg" : ""}`}
                  >
                    Column {i + 1}
                  </th>
                ))}
                <th className={`${tdStyles} w-8`}></th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id}>
                  {Array.from({ length: tableSize }).map((_, i) => (
                    <td
                      className={`${tdStyles} ${tableBorderSize}`}
                      key={`${row.id}-${i}-${row.values[i]}`}
                    >
                      {row.values[i] || ""}
                    </td>
                  ))}
                  <td className={`${tdStyles} w-8`}>
                    <button type="button" onClick={() => deleteRow(row.id)}>
                      <XCircleIcon className="w-6 h-6 text-red-400" />
                    </button>
                  </td>
                </tr>
              ))}
              <tr>
                {Array.from({ length: tableSize }).map((_, i) => (
                  <td
                    key={i}
                    className={`overflow-hidden ${tableBorderSize} ${i === 0 ? "rounded-bl-lg" : ""} ${i === tableSize - 1 ? "rounded-br-lg" : ""}`}
                  >
                    <input
                      name={i.toString()}
                      className="text-yellow-200 bg-slate-800 bg- w-full p-2"
                      type="text"
                    />
                  </td>
                ))}
                <td className="w-8 px-2">
                  <button type="submit" key={rows[rows.length - 1]?.id || "0"}>
                    <PlusCircleIcon className="w-6 h-6 text-green-400" />
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </form>
      </div>
    </div>
  );
};

export { ReactSocketTable };
