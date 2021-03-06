import React from 'react';
import Form from './common/Form';
import Joi from 'joi-browser';
import * as userService from '../services/userService';

class RegisterForm extends Form {
  state = {
    data: { username: '', password: '', name: '' },
    errors: {}
  };

  schema = {
    username: Joi.string()
      .required()
      .email()
      .label('Username'),
    password: Joi.string()
      .required()
      .label('Password')
      .min(5),
    name: Joi.string()
      .required()
      .label('Name')
  };

  doSubmit = async () => {
    try {
      const response = await userService.Register(this.state.data);
      localStorage.setItem('token', response.headers['x-auth-token']);
      this.props.history.push('/');
    } catch (ex) {
      if (ex.response && ex.response.status === 400) {
        const errors = { ...this.state.errors };
        errors.username = ex.response.data;
        this.setState({ errors });
      }
    }
  };

  render() {
    return (
      <div>
        <h1>Register</h1>
        <form onSubmit={this.handleSubmit}>
          {this.renderInput('username', 'Username', 'email')}
          {this.renderInput('password', 'Password', 'password')}
          {this.renderInput('name', 'Name')}
          {this.renderButton('Register')}
        </form>
      </div>
    );
  }
}

export default RegisterForm;
