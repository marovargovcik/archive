import { LocalizationProvider } from "@material-ui/pickers";
import DateFnsUtils from "@material-ui/pickers/adapter/date-fns";
import locale from "date-fns/locale/en-GB";
import React, { useCallback, useState } from "react";
import { render } from "react-dom";

import payload from "./payload";
import * as Autoform from "./renderers";

function renderFormElement(element) {
  switch (element.type) {
    case "checkbox": {
      return Autoform.Checkbox(element);
    }
    case "choices": {
      return Autoform.Choices(element);
    }
    case "date": {
      return Autoform.DateField(element);
    }
    case "datetime": {
      return Autoform.DateTimeField(element);
    }
    case "file": {
      return Autoform.FileField(element);
    }
    case "number": {
      return Autoform.NumberField(element);
    }
    case "radio": {
      return Autoform.Radio(element);
    }
    case "select": {
      return Autoform.Select(element);
    }
    case "switch": {
      return Autoform.Switch(element);
    }
    case "text": {
      return Autoform.TextField(element);
    }
    case "textarea": {
      return Autoform.Textarea(element);
    }
    case "time": {
      return Autoform.TimeField(element);
    }
    default:
      return null;
  }
}

function renderForm(payload, onChange, errors) {
  return payload
    .map((element) =>
      renderFormElement({
        ...element,
        error: errors[element.name],
        onChange,
      })
    )
    .filter(Boolean);
}

const App = () => {
  const [errors, setErrors] = useState({
    articleName: "No article with such name.",
    assignedWorkers: "Assign at least 2 workers.",
    category: "This category reached its capacity. Select different one.",
    gender: "You managed to not select anything.",
    languages: "To continue you have to be fluent in at least 2 languages.",
    note: "Note is too long! Max 512 characters.",
    notifications:
      "Your profile settings has bigger priority therefore we can not turn on notifications here.",
    numberOfEmployees:
      "To sign in your company has to employ at least 10 employees.",
    paintingDate: "Invalid date.",
    termsAndConditionsCheck: "You have to agree",
    manual: "File 'manual.pdf' exceeded maximum file size.",
  });

  const [state, setState] = useState(
    payload.reduce((acc, { name, value }) => {
      acc[name] = value;
      return acc;
    }, {})
  );

  const handleFormElementChange = useCallback((key, value) => {
    setState((s) => ({
      ...s,
      [key]: value,
    }));
  }, []);

  function handleSubmit() {
    console.log(state);
  }

  return (
    <LocalizationProvider dateAdapter={DateFnsUtils} locale={locale}>
      {renderForm(payload, handleFormElementChange, errors).map(
        (element, index) => (
          <div key={index} style={{ margin: "16px 0" }}>
            {element}
          </div>
        )
      )}
      <button onClick={handleSubmit} type="submit">
        Submit
      </button>
    </LocalizationProvider>
  );
};

render(<App />, document.getElementById("root"));
