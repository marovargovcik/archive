export default [
  // text field
  {
    type: "text",
    name: "articleName",
    value: "XY100", // or null
    label: "Article's name",
  },
  // textarea
  {
    type: "textarea",
    name: "note",
    value: "long text long text", // or null
    label: "Note",
  },
  // number
  {
    type: "number",
    name: "numberOfEmployees",
    value: 5, // or null
    label: "Number of employees",
  },
  // select
  {
    type: "select",
    name: "category",
    value: "option1", // multiple == false ? String || null : Array<String>
    label: "Category",
    multiple: false, // or true
    options: [
      ["option1", "Option 1"], // 1. value, 2. user friendly label
      ["option2", "Option 2"],
    ],
  },
  // select multiple
  {
    type: "select",
    name: "languages",
    value: ["language1"], // multiple == false ? String || null : Array<String>
    label: "Languages",
    multiple: true, // or false
    options: [
      ["language1", "Language 1"], // 1. value, 2. user friendly label
      ["language2", "Language 2"],
    ],
  },
  // radio
  {
    type: "radio",
    name: "gender",
    value: "male", // or null
    label: "Gender",
    options: [
      ["male", "Male"], // 1. value, 2. user friendly label
      ["female", "Female"],
      ["preferNotToSay", "Prefer to not say"],
    ],
  },
  // checkbox
  {
    type: "checkbox",
    name: "termsAndConditionsCheck",
    value: true, // or false
    label: "I agree with terms and conditions",
  },
  // choices
  {
    type: "choices",
    name: "assignedWorkers",
    value: ["worker1", "worker2"], // or empty array
    label: "Assign workers",
    options: [
      ["worker1", "Worker 1"],
      ["worker2", "Worker 2"],
      ["worker3", "Worker 3"],
    ],
  },
  // switch
  {
    type: "switch",
    name: "notifications",
    value: true, // or false,
    label: "Turn on notifications",
  },
  // date
  {
    type: "date",
    name: "paintingDate",
    value: "2020-08-01", // or null | format: YYYY-MM-DD
    label: "Painting date",
  },
  // datetime
  {
    type: "datetime",
    name: "wasPainted",
    value: "2020-08-01T18:10:03+0000", // or null | format: ISO 8601
    label: "Was painted at",
  },
  // time
  {
    type: "time",
    name: "dailyCheckAt",
    value: "18:04", // or null | format: HH:mm
    label: "Daily check at",
  },
  // file
  {
    type: "file",
    name: "manual",
    value: [], // always empty array
    existingFiles: [
      {
        deleteURL: "https://google.com",
        filename: "Manual.pdf",
        openURL: "https://google.com",
      },
    ],
    multiple: true,
    accept: [".jpg", ".png"],
    label: "Manual file",
  },
];
