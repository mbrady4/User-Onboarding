import React, { useState, useEffect } from 'react';
import * as yup from 'yup';
import axios from 'axios';
import './form.css';

const Form = props => {
    const [formValues, setFormValues] = useState({
        name: '',
        email: '',
        password: '',
        terms: ''
    });

    const [isButtonDisabled, setIsButtonDisabled] = useState(true);

    const [errors, setErrors] = useState({
        name: '',
        email: '',
        password: '',
        terms: ''
    });

    const [users, setUsers] = useState([])

    const formSchema = yup.object().shape({
        name: yup.string().required("Name is a required field."),
        email: yup.string().email("Must be a valid email address").required(),
        terms: yup.boolean().oneOf([true, "Please agree to the terms"]),
        password: yup.string().min(6, "Must be at least 6 characters")
    });

    const validateChange = event => {
        yup
            .reach(formSchema, event.target.name)
            .validate(event.target.value)
            .then( valid => {
                setErrors({...errors, [event.target.name]: ''})
            })
            .catch( err => {
                setErrors({...errors, [event.target.name]: err.errors[0]})
            });
    };

    useEffect( () => {
        formSchema.isValid(formValues).then(valid => {
            setIsButtonDisabled(!valid);
        });
    }, [formValues]);

    const inputChange = event => {
        console.log('Input Changed:', event.target.name, event.target.value);
        event.persist();
        const newFormData = {
            ...formValues,
            [event.target.name]: event.target.type === 'checkbox' ?
                                 event.target.checked :
                                 event.target.value
        }
        validateChange(event);
        setFormValues(newFormData);
    };

    const formSubmit = event => {
        event.preventDefault();
        axios.post('https://reqres.in/api/users', formValues)
            .then(response => {
                console.log('Resposne', response.data);
                setUsers([...users, response.data]);
                setFormValues({
                    name: '',
                    email: '',
                    password: '',
                    terms: ''
                });
            })
            .catch(error => console.log(error.response));
    };

    return (
        <form onSubmit={formSubmit}>
            <label htmlFor='name'>
                name
                <input type='text' 
                       name='name'
                       value={formValues.name}
                       onChange={inputChange}/>
                {errors.name.length > 0 ? <p>{errors.name}</p> : null }
            </label>
            <label htmlFor='email'>
                email
                <input type='email' 
                       name='email'
                       value={formValues.email}
                       onChange={inputChange}/>
                {errors.email.length > 0 ? <p>{errors.email}</p> : null }
            </label>
            <label htmlFor='password'>
                password
                <input type='password' 
                       name='password'
                       value={formValues.password}
                       onChange={inputChange}/>
                {errors.password.length > 0 ? <p>{errors.password}</p> : null}
            </label>
            <label htmlFor='terms'>
                terms
                <input type='checkbox' 
                       name='terms'
                       checked={formValues.terms}
                       onChange={inputChange}/>
            </label>
            <button disabled={isButtonDisabled} type='submit'>Submit</button>
            {users.map((user, key) => <pre>{ JSON.stringify(user, null, key) }</pre>)}
        </form>
    )
}
export default Form;