import theory from "../../assets/questions/theory.json";
import { useEffect, useState } from "react";

const Questions = () => {
  const [controlledQuestions, setControlledQuestions] = useState(theory);
  const [selectedGroup, setSelectedGroup] = useState("all");

  console.log(
    JSON.stringify(
      controlledQuestions.map((item, index) => ({ ...item, id: index + 1 })),
    ),
  );

  const resetQuestions = () => {
    localStorage.removeItem("theory");
    setControlledQuestions(theory);
  };

  const restoreQuestions = () => {
    const restored = JSON.parse(localStorage.getItem("theory") || "[]");
    if (restored?.length) {
      setControlledQuestions(restored);
    }
  };

  const saveQuestions = () => {
    localStorage.setItem("theory", JSON.stringify(controlledQuestions));
  };

  const updateRate = (id: number, rate: string) => {
    const copied = [...controlledQuestions];
    const candidate = copied.find((item) => item.id === id);
    candidate.rate = rate;
    console.log({ candidate, id, rate });
    setControlledQuestions(copied);
    saveQuestions();
  };

  const getList = () => {
    if (selectedGroup === "all") {
      return Object.entries(
        Object.groupBy(controlledQuestions, ({ group }) => group),
      );
    }

    const filterByGroup = controlledQuestions.filter(
      (item) => item.group === selectedGroup,
    );

    return Object.entries(Object.groupBy(filterByGroup, ({ group }) => group));
  };
  const getRateColor = (rate: string) => {
    switch (rate) {
      case "default":
        return "bg-gray-500";
      case "pass":
        return "bg-red-500";
      case "bad":
        return "bg-pink-500";
      case "good":
        return "bg-yellow-500";
      case "great":
        return "bg-green-500";
    }
  };

  const getLvlColor = (lvl: string) => {
    switch (lvl) {
      case "senior":
        return "bg-red-700";
      case "middle":
        return "bg-yellow-700";
      case "junior":
        return "bg-green-700";
    }
  };

  const getGroupList = () => {
    return Array.from(new Set(theory.map((item) => item.group)));
  };

  const downloadResults = () => {
    const extractedData = controlledQuestions.map((item) => ({
      rate: item.rate,
      question: item.question,
    }));
    const dataStr =
      "data:text/json;charset=utf-8," +
      encodeURIComponent(JSON.stringify(extractedData));
    const downloadAnchorNode = document.createElement("a");
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "results.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  useEffect(restoreQuestions, []);
  return (
    <div>
      <div className="flex-col items-center text-base font-semibold text-gray-900 dark:text-white relative mb-8">
        <div className={"flex mb-4 justify-between"}>
          <button
            onClick={downloadResults}
            type="button"
            className="cursor-pointer text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
          >
            Download results
          </button>
          <button
            onClick={resetQuestions}
            type="button"
            className="cursor-pointer focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
          >
            Reset
          </button>
        </div>

        <select
          id="group"
          onChange={(e) => setSelectedGroup(e.target.value)}
          className={`bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500`}
        >
          <option value="all" selected>
            Все
          </option>
          {getGroupList().map((group) => (
            <option value={group}>{group}</option>
          ))}
        </select>
      </div>
      {getList().map(([group, questions]) => (
        <div className="mb-4">
          <h2 className="inline-block text-4xl font-bold gray-800 relative">
            {group} ({questions.length})
          </h2>
          <ul
            className={
              "divide-y divide-gray-200 dark:divide-gray-700 bg-gray-800 rounded-xl p-4"
            }
          >
            {questions.map((item, index) => (
              <li className="py-3 sm:pb-4">
                <div className="flex items-center space-x-4 rtl:space-x-reverse">
                  <span
                    className={`flex w-3 h-3 me-3 ${getRateColor(item.rate)} rounded-full`}
                  ></span>
                  <p className="text-sm font-bold text-gray-900 truncate dark:text-white">
                    {index + 1}
                  </p>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 truncate dark:text-white">
                      {item.question}
                    </p>
                    <span
                      className={`${getLvlColor(item.lvl)} text-white text-xs font-medium me-2 px-2.5 py-0.5 rounded-sm `}
                    >
                      {item.lvl}
                    </span>
                  </div>
                  <div className="flex-col items-center text-base font-semibold text-gray-900 dark:text-white relative">
                    <select
                      id="rate"
                      onChange={(e) => updateRate(item.id, e.target.value)}
                      className={`bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500`}
                    >
                      <option
                        value="default"
                        selected={item.rate === "default"}
                      >
                        Не задан
                      </option>
                      <option selected={item.rate === "pass"} value="pass">
                        Не ответил
                      </option>
                      <option selected={item.rate === "bad"} value="bad">
                        Плохо
                      </option>
                      <option selected={item.rate === "good"} value="good">
                        Хорошо
                      </option>
                      <option selected={item.rate === "great"} value="great">
                        Отлично
                      </option>
                    </select>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default Questions;
