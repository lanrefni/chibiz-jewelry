import { Component } from "react";
import Input from "./input";
import Joi from "joi-browser";

class Form extends Component {
  state = {};

  /* Validate the name from the schema on the model */
  validateProperty = (name, value) => {
    const propertyObj = { [name]: value };
    const propertySchema = { [name]: this.schema[name] };
    const { error } = Joi.validate(propertyObj, propertySchema);
    return error && error.details[0].message;
  };
  /* Validate the data we are getting from the user */
  validate = () => {
    const {
      schema,
      state: { data },
    } = this;
    const { error } = Joi.validate(data, schema, { abortEarly: false });
    if (!error) {
      return null;
    }
    const errors = {};
    for (const detailsItem of error.details) {
      errors[detailsItem.path[0]] = detailsItem.message;
    }
    return errors;
  };

  /* Handle the submit button */
  handleSubmit = (e) => {
    e.preventDefault();
    const errors = this.validate();
    this.setState({ errors: errors || {} });
    if (errors) {
      return;
    }
    this.doSubmit();
  };

  /* Handle the change on form */
  handleChange = ({ target: { name, value } }) => {
    const { data, errors } = this.state;
    const updatedErrors = { ...errors };
    const errorMessage = this.validateProperty(name, value);
    updatedErrors[name] = errorMessage;
    const updatedData = { ...data };
    updatedData[name] = value;

    this.setState({ data: updatedData, errors: updatedErrors });
  };

  /* Custom Input */
  renderInput(name, label, type = "text", min) {
    const { data, errors } = this.state;
    return (
      <Input
        type={type}
        label={label}
        name={name}
        min={min}
        onChange={this.handleChange}
        error={errors[name]}
        value={data[name]}
      />
    );
  }

  /* Custom Button */
  renderButton(label, className) {
    return (
      <button disabled={this.validate()} className={className}>
        {label}
      </button>
    );
  }
}

export default Form;
