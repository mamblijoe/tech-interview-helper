import theory from "../../assets/questions/theory.json";
import { useEffect, useState } from "react";

const Questions = () => {
  const [controlledQuestions, setControlledQuestions] = useState(theory);
  const [selectedGroup, setSelectedGroup] = useState<string[]>([]);
  const [open, setOpen] = useState(false);

  // console.log(
  //   JSON.stringify(theory.map((item, index) => ({ ...item, id: index + 1 }))),
  // );

  const resetData = () => {
    localStorage.removeItem("theory");
    localStorage.removeItem("group");
    setControlledQuestions(theory);
    setSelectedGroup([]);
  };

  const restoreData = () => {
    const restoredQuestions = JSON.parse(
      localStorage.getItem("theory") || "[]",
    );

    const restoredGroup = JSON.parse(localStorage.getItem("group") || "[]");

    if (restoredQuestions?.length) {
      setControlledQuestions(restoredQuestions);
    }
    if (restoredGroup?.length) {
      setSelectedGroup(restoredGroup);
    }
  };

  const saveData = () => {
    localStorage.setItem("theory", JSON.stringify(controlledQuestions));
    localStorage.setItem("group", JSON.stringify(selectedGroup));
  };

  const updateRate = (id: number, rate: string) => {
    const copied = [...controlledQuestions];
    const candidate = copied.find((item) => item.id === id);

    if (!candidate) {
      return;
    }

    candidate.rate = rate;
    setControlledQuestions(copied);
    saveData();
  };

  const selectQuestion = (id: number) => {
    const copied = [...controlledQuestions];
    const candidate = copied.find((item) => item.id === id);

    if (!candidate) {
      return;
    }

    candidate.selected = !candidate.selected;
    setControlledQuestions(copied);
    saveData();
  };

  const getList = () => {
    if (selectedGroup.length === 0) {
      return Object.entries(
        Object.groupBy(controlledQuestions, ({ group }) => group),
      );
    }

    const filterByGroup = controlledQuestions.filter((item) =>
      selectedGroup.includes(item.group),
    );

    return Object.entries(Object.groupBy(filterByGroup, ({ group }) => group));
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

  const toJsonAndDownload = (name: string, data: unknown) => {
    const dataStr =
      "data:text/json;charset=utf-8," +
      encodeURIComponent(JSON.stringify(data));
    const downloadAnchorNode = document.createElement("a");
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `${name}.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const downloadResults = () => {
    const extractedData = controlledQuestions
      .filter((item) => item.rate !== "default")
      .map((item) => ({
        rate: item.rate,
        question: item.question,
      }));

    if (extractedData.length > 0) {
      toJsonAndDownload("result", extractedData);
    }
  };

  const downloadPreset = () => {
    const extractedData = controlledQuestions.filter((item) => item.selected);
    if (extractedData.length > 0) {
      toJsonAndDownload("preset", extractedData);
    }
  };

  const selectGroup = (checked: boolean, group: string) => {
    console.log({ checked, group });
    if (checked) {
      setSelectedGroup((prev) => [...prev, group]);
    } else {
      setSelectedGroup((prev) => prev.filter((item) => item !== group));
    }
  };

  useEffect(restoreData, []);
  return (
    <div>
      <div className="flex-col items-center text-base font-semibold text-gray-900 dark:text-white relative mb-8">
        <div className={"flex mb-4 justify-between"}>
          <button
            onClick={downloadPreset}
            type="button"
            className="cursor-pointer text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
          >
            Выгрузить пресет
          </button>
          <button
            onClick={downloadResults}
            type="button"
            className="cursor-pointer text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
          >
            Выгрузить ответы
          </button>
          <button
            onClick={resetData}
            type="button"
            className="cursor-pointer focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
          >
            Сбросить
          </button>
        </div>

        <div className={"mb-6"}>
          <button
            id="dropdownCheckboxButton"
            data-dropdown-toggle="dropdownDefaultCheckbox"
            className="text-white bg-gray-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center"
            type="button"
            onClick={() => setOpen((prev) => !prev)}
          >
            Темы
            <svg
              className="w-2.5 h-2.5 ms-3"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 10 6"
            >
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="m1 1 4 4 4-4"
              />
            </svg>
          </button>

          <div
            id="dropdownDefaultCheckbox"
            className={`${open ? "" : "hidden"} z-10 w-48 bg-white divide-y divide-gray-100 rounded-lg shadow-sm dark:bg-gray-700 dark:divide-gray-600`}
          >
            <ul
              className="p-3 space-y-3 text-sm text-gray-700 dark:text-gray-200"
              aria-labelledby="dropdownCheckboxButton"
            >
              {getGroupList().map((group) => (
                <li>
                  <div className="flex items-center">
                    <input
                      onChange={(event) =>
                        selectGroup(event.target.checked, group)
                      }
                      id={`checkbox-item-${group}`}
                      type="checkbox"
                      checked={selectedGroup.includes(group)}
                      name={`checkbox-item-${group}`}
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                    />
                    <label
                      htmlFor={`checkbox-item-${group}`}
                      className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                    >
                      {group}
                    </label>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
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
            {questions
              .sort((a, b) => b.selected - a.selected)
              .map((item, index) => (
                <li
                  className={`py-1 sm:pb-4 cursor-pointer group ${item.selected ? "opacity-100" : "opacity-50"}`}
                  onClick={() => selectQuestion(item.id)}
                >
                  <div className="flex items-center space-x-4 rtl:space-x-reverse">
                    <div className="flex items-center mb-4">
                      <input
                        name={`selected-${item.id}`}
                        type="checkbox"
                        checked={item.selected}
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                      />
                    </div>
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
                        value={item?.rate}
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
