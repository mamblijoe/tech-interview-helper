import questionsList from "../../assets/questions/index.json";
import { useState } from "react";

const Questions = () => {
  const [controlledQuestions, setControlledQuestions] = useState(questionsList);
  const [selectedGroup, setSelectedGroup] = useState("all");

  console.log(
    JSON.stringify(
      controlledQuestions.map((item, index) => ({ ...item, id: index + 1 })),
    ),
  );

  const updateRate = (id: number, rate: string) => {
    const copied = [...controlledQuestions];
    const candidate = copied.find((item) => item.id === id);
    candidate.rate = rate;
    console.log({ candidate, id, rate });
    setControlledQuestions(copied);
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
    return Array.from(new Set(questionsList.map((item) => item.group)));
  };

  return (
    <div>
      <div className="flex-col items-center text-base font-semibold text-gray-900 dark:text-white relative mb-8">
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
                      <option value="default" selected>
                        Не задан
                      </option>
                      <option value="pass">Не ответил</option>
                      <option value="bad">Плохо</option>
                      <option value="good">Хорошо</option>
                      <option value="great">Отлично</option>
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
