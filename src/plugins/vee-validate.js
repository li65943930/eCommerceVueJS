import { required, email, min } from "vee-validate/dist/rules";
import { extend } from "vee-validate";

//provide a message for the rules
extend('required', {
    ...required,
    message: 'This field is required'
});

extend('email', {
    ...email,
    message: 'Must be a valid e-mail'
});

extend('min', {
    ...min,
    params: ['length'],
    message: 'Must have at least {length} characters'
});

extend('password', {
    params: ['target'],
    validate(value, { target }) {
      return value === target;
    },
    message: 'Password does not match'
});