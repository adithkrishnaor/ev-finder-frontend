import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SignIn = () => {

    const [data, setData] = new useState(
        {
            "email": "",
            "password": ""
        }
    )

    const inputHandler = (event) => {
        setData({ ...data, [event.target.name]: event.target.value });
    };

    const navigate = useNavigate()
    
    const readValue = () => {

        axios.post("http://localhost:8080/signin", data).then(
            (response) => {
                console.log(response.data)
                if (response.data.status == "Invalid Email") {
                    alert("Invalid Email")
                }
                else if (response.data.status == "Invalid Password") {
                    alert("Invalid Password")
                }
                else {

                    let token = response.data.token
                    let userId = response.data.userId

                    console.log(token)
                    console.log(userId)

                    sessionStorage.setItem("token", token)
                    sessionStorage.setItem("userId", userId)

                    navigate('/home')
                }
            }
        ).catch(
            (error) => {
                console.log(error)
            }
        )

        console.log(data)
    }

    return (
        <div>
            <div className="container">
                <div className="row">
                    <div className="col col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 col-xxl-12">
                        <div className="row g-3">
                            <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 col-xxl-12">
                                <label htmlFor="" className="form-label">Email</label>
                                <input type="text" className="form-control" name='email' value={data.email} onChange={inputHandler} />
                            </div>
                            <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 col-xxl-12">
                                <label htmlFor="" className="form-label">Password</label>
                                <input type="password" className="form-control" name='password' value={data.password} onChange={inputHandler} />
                            </div>
                            <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 col-xxl-12">
                                <button className="btn btn-primary" onClick={readValue}>Login</button>
                            </div>
                            <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 col-xxl-12">
                                <a href="/signup" className="btn btn-secondary">new user, SignUP</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignIn;