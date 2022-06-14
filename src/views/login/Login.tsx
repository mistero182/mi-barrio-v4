import React, {  } from 'react';
import axios from 'axios';


import './Login.css'

export const Login = (() => {

    const signUpHandler = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        console.log(event);

        const target = event.target as typeof event.target & {
            email: { value: string };
            password: { value: string };
        };

        const email = target.email.value; // typechecks!
        const password = target.password.value; // typechecks!

        console.log(email);
        console.log(password);

        // axios.post(`http://localhost:3000/auth`)
        axios.post(`https://auth.api.ocuba.net/`)
        .then(res => {
            console.log(res)
            
        })
    }
    
    return (
        <>
            <form
                style={{width: '200px', margin: '0 auto' }} action="" id="sign-up-form"
                onSubmit={(event) => { signUpHandler(event) }}
            >
                <h2>Sign Up</h2>
                 <p>Name</p>
                <input type="text" name="name"/>
                <p>Email</p>
                <input type="text" name="email"/>
                <p>Password</p>
                <input type="password" name="password"/>
                <br/>
                <button type="submit">
                    Sign up
                </button>
            </form>
        </>
    );
});
