import React, { useEffect, useState } from "react";
import useWebSocket from "react-use-websocket";
import { XCircleIcon, PlusCircleIcon } from "@heroicons/react/24/solid";

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
  } = useWebSocket(`ws://157.230.202.57:4210/${sessionId}`, {
    share: true,
    onClose: () => sendJsonMessage({ type: "unregister" }),
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
        React Socket Table - session ID: {sessionId}
      </div>
      <div className="text-center">
        <div className="mb-2">
          Columns:
        </div>
        <div>
          <button onClick={deleteColumn}>-</button>
          <span className="mx-4">{tableSize}</span>
          <button onClick={addColumn}>+</button>
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
