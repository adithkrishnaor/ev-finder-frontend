import axios from 'axios'
import React, { useState } from 'react'

const SignUp = () => {

    const [data, setData] = new useState(
        {
            "name": "",
            "email": "",
            "phone": "",
            "dob": "",
            "gender": "",
            "password": "",
            "cpass": ""
        }
    )

    const inputHandler = (event) => {
        setData({ ...data, [event.target.name]: event.target.value })
    }

    const readValue = () => {

        if (!data.name || !data.email || !data.phone || !data.dob || !data.gender || !data.password || !data.cpass) {
            alert('Please fill in all fields.');
            return;
        }

        if (data.password == data.cpass) {

            let newdata = {
                "name": data.name,
                "email": data.email,
                "phone": data.phone,
                "dob": data.dob,
                "gender": data.gender,
                "password": data.password
            }

            axios.post("http://localhost:8080/signup", newdata).then(
                (response) => {
                    console.log(response.data)

                    if (response.data.status == "success") {
                        alert("Registration Success")
                        setData(
                            { "name": "", "email": "", "phone": "", "dob": "", "gender": "", "password": "", "cpass": "" }
                        )
                    }
                    else {
                        alert("User already exist")
                        setData(
                            { "name": "", "email": "", "phone": "", "dob": "", "gender": "", "password": "", "cpass": "" }
                        )
                    }
                }
            ).catch(
                (error) => {
                    console.log(error)
                }
            )
        }
        else {
            alert("Password and Confirm Password should be same")
        }

    }
    return (
        <div>
            <div className="container-fluid bg-light min-vh-100 d-flex align-items-center">
                <div className="row justify-content-center">
                    <div className="col col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 col-xxl-12 d-flex justify-content-center">
                        <div className="card w-50 border-rounded border-secondary shadow-sm">
                            <div className="card-body p-4">
                                <h2 className="card-title text-center mb-4">Sign Up</h2>
                                <div className="row g-3">
                                    <div className="col col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 col-xxl-12">
                                        <label htmlFor="" className="form-label">Full Name</label>
                                        <input type="text" className="form-control" name='name' value={data.name} onChange={inputHandler} />
                                    </div>
                                    <div className="col col-12 col-sm-12 col-md-6 col-lg-6 col-xl-6 col-xxl-6">
                                        <label htmlFor="" className="form-label">Email</label>
                                        <input type="text" className="form-control" name='email' value={data.email} onChange={inputHandler} />
                                    </div>
                                    <div className="col col-12 col-sm-12 col-md-6 col-lg-6 col-xl-6 col-xxl-6">
                                        <label htmlFor="" className="form-label">Phone Number</label>
                                        <input type="number" className="form-control" name='phone' value={data.phone} onChange={inputHandler} />
                                    </div>
                                    <div className="col col-12 col-sm-12 col-md-6 col-lg-6 col-xl-6 col-xxl-6">
                                        <label htmlFor="" className="form-label">Date of Birth</label>
                                        <input type="date" className="form-control" name='dob' value={data.dob} onChange={inputHandler} />
                                    </div>
                                    <div className="col col-12 col-sm-12 col-md-6 col-lg-6 col-xl-6 col-xxl-6">
                                        <label htmlFor="" className="form-label">Gender</label>
                                        <select className="form-control" name='gender' value={data.gender} onChange={inputHandler}>
                                            <option value="">Select Gender</option>
                                            <option value="male">Male</option>
                                            <option value="female">Female</option>
                                            <option value="other">Other</option>
                                        </select>
                                    </div>
                                    <div className="col col-12 col-sm-12 col-md-6 col-lg-6 col-xl-6 col-xxl-6">
                                        <label htmlFor="" className="form-label">Password</label>
                                        <input type="password" className="form-control" name='password' value={data.password} onChange={inputHandler} />
                                    </div>
                                    <div className="col col-12 col-sm-12 col-md-6 col-lg-6 col-xl-6 col-xxl-6">
                                        <label htmlFor="" className="form-label">Confirm Password</label>
                                        <input type="password" className="form-control" name='cpass' value={data.cpass} onChange={inputHandler} />
                                    </div>
                                    <div className="col col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 col-xxl-12">
                                        <center>
                                            <button className="btn btn-primary" onClick={readValue}>Signup</button>
                                        </center>
                                    </div>
                                    <div className="col col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 col-xxl-12">
                                        <center>
                                            <a href="/">Existing user Login Page</a>
                                        </center>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SignUp