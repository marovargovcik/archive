import {
  Checkbox as MuiCheckbox,
  FormControl as MuiFormControl,
  FormControlLabel as MuiFormControlLabel,
  FormGroup as MuiFormGroup,
  FormHelperText as MuiFormHelperText,
  FormLabel as MuiFormLabel,
  Grid as MuiGrid,
  IconButton as MuiIconButton,
  List as MuiList,
  ListItem as MuiListItem,
  ListItemSecondaryAction as MuiListItemSecondaryAction,
  ListItemText as MuiListItemText,
  Radio as MuiRadio,
  RadioGroup as MuiRadioGroup,
  Switch as MuiSwitch,
  TextField as MuiTextField,
  Typography as MuiTypography,
  makeStyles,
} from "@material-ui/core";
import {
  Delete as DeleteIcon,
  CloudUpload as UploadIcon,
} from "@material-ui/icons";
import { Autocomplete as MuiAutocomplete } from "@material-ui/lab";
import {
  DatePicker as MuiDatePicker,
  DateTimePicker as MuiDateTimePicker,
  TimePicker as MuiTimePicker,
} from "@material-ui/pickers";
import { format, isValid, setHours, setMinutes } from "date-fns";
import React, { useCallback, useEffect, useState, useMemo } from "react";
import { useDropzone } from "react-dropzone";

const commonProps = {
  fullWidth: true,
  size: "small",
  variant: "outlined",
};

export function Checkbox({
  error,
  label,
  name,
  onChange,
  value: defaultChecked,
}) {
  function handleChange({ target: { checked } }) {
    onChange(name, checked);
  }

  const checkboxProps = {
    color: "primary",
    defaultChecked,
    name,
    onChange: handleChange,
  };

  const formControlLabelProps = {
    control: <MuiCheckbox {...checkboxProps} />,
    label,
  };

  return (
    <MuiFormControl component="fieldset" error={Boolean(error)}>
      <MuiFormControlLabel {...formControlLabelProps} />
      {error && <MuiFormHelperText>{error}</MuiFormHelperText>}
    </MuiFormControl>
  );
}

export function Choices({
  error,
  label,
  name,
  onChange,
  options,
  value: defaultValue,
}) {
  const [state, setState] = useState(defaultValue);

  useEffect(() => onChange(name, state), [name, onChange, state]);

  function handleChange(value) {
    return function ({ target: { checked } }) {
      if (checked) {
        const newState = Array.from(new Set([...state, value]));
        return setState(newState);
      }
      setState(state.filter((i) => i !== value));
    };
  }

  return (
    <MuiFormControl component="fieldset" error={Boolean(error)}>
      <MuiFormLabel component="legend">{label}</MuiFormLabel>
      <MuiFormGroup>
        {options.map(([value, label]) => (
          <MuiFormControlLabel
            control={
              <MuiCheckbox
                color="primary"
                checked={state.includes(value)}
                onChange={handleChange(value)}
              />
            }
            key={value}
            label={label}
          />
        ))}
      </MuiFormGroup>
      {error && <MuiFormHelperText>{error}</MuiFormHelperText>}
    </MuiFormControl>
  );
}

export function NumberField({ error, label, name, onChange, value }) {
  function handleChange({ target: { value } }) {
    onChange(name, value);
  }

  const props = {
    ...commonProps,
    defaultValue: value,
    id: name,
    label,
    multiline: true,
    name,
    onChange: handleChange,
  };

  if (error) {
    props.error = true;
    props.helperText = error;
  }

  return <MuiTextField {...props} />;
}

export function Radio({
  error,
  label,
  name,
  onChange,
  options,
  value: defaultValue,
}) {
  function handleChange({ target: { value } }) {
    onChange(name, value);
  }

  const radioGroupProps = {
    defaultValue,
    name,
    onChange: handleChange,
  };

  return (
    <MuiFormControl component="fieldset" error={Boolean(error)}>
      <MuiFormLabel component="legend">{label}</MuiFormLabel>
      <MuiRadioGroup {...radioGroupProps}>
        {options.map(([value, label]) => (
          <MuiFormControlLabel
            control={<MuiRadio color="primary" />}
            key={value}
            label={label}
            value={value}
          />
        ))}
      </MuiRadioGroup>
      {error && <MuiFormHelperText>{error}</MuiFormHelperText>}
    </MuiFormControl>
  );
}

export function Select({
  error,
  label,
  multiple,
  name,
  onChange,
  options,
  value: defaultValue,
}) {
  const { labels, values } = useCallback(
    options.reduce(
      (acc, [value, label]) => {
        acc.labels.push(label);
        acc.values.push(value);
        return acc;
      },
      { labels: [], values: [] }
    ),
    [options]
  );

  function handleChange(e, value) {
    onChange(name, value);
  }

  const autocompleteProps = {
    defaultValue,
    getOptionLabel: (option) => labels[values.indexOf(option)],
    multiple,
    onChange: handleChange,
    options: values,
    renderInput: (params) => <MuiTextField {...textFieldProps} {...params} />,
    size: "small",
  };

  const textFieldProps = {
    ...commonProps,
    id: name,
    label,
    name,
  };

  if (error) {
    textFieldProps.error = true;
    textFieldProps.helperText = error;
  }

  return <MuiAutocomplete {...autocompleteProps} />;
}

export function Switch({
  error,
  label,
  name,
  onChange,
  value: defaultChecked,
}) {
  function handleChange({ target: { checked } }) {
    onChange(name, checked);
  }

  const switchProps = {
    color: "primary",
    defaultChecked,
    name,
    onChange: handleChange,
  };

  const formControlLabelProps = {
    control: <MuiSwitch {...switchProps} />,
    label,
  };

  return (
    <MuiFormControl component="fieldset" error={Boolean(error)}>
      <MuiFormControlLabel {...formControlLabelProps} />
      {error && <MuiFormHelperText>{error}</MuiFormHelperText>}
    </MuiFormControl>
  );
}

export function Textarea({ error, label, name, onChange, value }) {
  function handleChange({ target: { value } }) {
    onChange(name, value);
  }

  const props = {
    ...commonProps,
    defaultValue: value,
    id: name,
    label,
    multiline: true,
    name,
    onChange: handleChange,
  };

  if (error) {
    props.error = true;
    props.helperText = error;
  }

  return <MuiTextField {...props} />;
}

export function TextField({ error, label, name, onChange, value }) {
  function handleChange({ target: { value } }) {
    onChange(name, value);
  }

  const props = {
    ...commonProps,
    defaultValue: value,
    id: name,
    label,
    name,
    onChange: handleChange,
  };

  if (error) {
    props.error = true;
    props.helperText = error;
  }

  return <MuiTextField {...props} />;
}

export function DateField({
  error,
  label,
  name,
  onChange,
  value: defaultValue,
}) {
  const [value, setValue] = useState(new Date(defaultValue));

  function handleChange(value) {
    setValue(value);
    onChange(name, isValid(value) ? format(value, "yyyy-MM-dd") : null);
  }

  const textFieldProps = {
    ...commonProps,
    id: name,
    name,
  };

  if (error) {
    textFieldProps.error = true;
    textFieldProps.helperText = error;
  }

  const datePickerProps = {
    mask: null,
    label,
    onChange: handleChange,
    renderInput: (props) => <MuiTextField {...props} {...textFieldProps} />,
    value: value,
  };

  return <MuiDatePicker {...datePickerProps} />;
}

export function DateTimeField({
  error,
  label,
  name,
  onChange,
  value: defaultValue,
}) {
  const [value, setValue] = useState(new Date(defaultValue));

  function handleChange(value) {
    setValue(value);
    onChange(name, isValid(value) ? value.toISOString() : null);
  }

  const textFieldProps = {
    ...commonProps,
    id: name,
    name,
  };

  if (error) {
    textFieldProps.error = true;
    textFieldProps.helperText = error;
  }

  const dateTimePickerProps = {
    mask: null,
    label,
    onChange: handleChange,
    renderInput: (props) => <MuiTextField {...props} {...textFieldProps} />,
    value: value,
  };

  return <MuiDateTimePicker {...dateTimePickerProps} />;
}

export function TimeField({
  error,
  label,
  name,
  onChange,
  value: defaultValue,
}) {
  const [hours, minutes] = useMemo(() => defaultValue.split(":"), [
    defaultValue,
  ]);
  const [value, setValue] = useState(
    setHours(setMinutes(new Date(), minutes), hours)
  );

  function handleChange(value) {
    setValue(value);
    onChange(name, isValid(value) ? format(value, "HH:mm") : null);
  }

  const textFieldProps = {
    ...commonProps,
    id: name,
    name,
  };

  if (error) {
    textFieldProps.error = true;
    textFieldProps.helperText = error;
  }

  const timePickerProps = {
    allowKeyboardControl: false,
    label,
    onChange: handleChange,
    renderInput: (props) => <MuiTextField {...props} {...textFieldProps} />,
    value: value,
  };

  return <MuiTimePicker {...timePickerProps} />;
}

const useFileFieldStyles = makeStyles((theme) => ({
  root: {
    border: `1px dashed ${theme.palette.divider}`,
    borderRadius: theme.shape.borderRadius,
    marginTop: theme.spacing(1.5),
    minHeight: 64,
    padding: theme.spacing(2),
    textAlign: "center",
    width: "100%",
  },
}));

export function FileField({
  accept,
  error,
  existingFiles,
  label,
  multiple,
  name,
  onChange,
}) {
  const classes = useFileFieldStyles();
  const [files, setFiles] = useState([]);
  const { getInputProps, getRootProps } = useDropzone({
    accept: [...accept, ".bak"],
    multiple,
    onDrop: useCallback(
      (acceptedFiles) => {
        setFiles(acceptedFiles);
        onChange(name, acceptedFiles);
      },
      [name, onChange]
    ),
  });

  return (
    <MuiFormControl error={Boolean(error)} fullWidth>
      <MuiFormLabel>{label}</MuiFormLabel>
      <MuiGrid
        alignItems="center"
        classes={{
          root: classes.root,
        }}
        container
        direction="column"
        justify="center"
        {...getRootProps()}
      >
        <input {...getInputProps()} />
        <UploadIcon color="primary" fontSize="large" />
        {files.length > 0 && (
          <MuiTypography display="block" variant="subtitle2">
            {files.map(({ name }) => name).join(", ")}
          </MuiTypography>
        )}
      </MuiGrid>
      {error && <MuiFormHelperText>{error}</MuiFormHelperText>}
      <MuiList dense>
        {existingFiles.map(({ filename, deleteURL, openURL }) => (
          <MuiListItem
            button
            component="a"
            href={openURL}
            key={openURL}
            target="_blank"
            rel="noopener noreferrer"
          >
            <MuiListItemText>{filename}</MuiListItemText>
            <MuiListItemSecondaryAction>
              <MuiIconButton
                component="a"
                href={deleteURL}
                target="_blank"
                rel="noopener noreferrer"
                size="small"
              >
                <DeleteIcon fontSize="small" />
              </MuiIconButton>
            </MuiListItemSecondaryAction>
          </MuiListItem>
        ))}
      </MuiList>
    </MuiFormControl>
  );
}
