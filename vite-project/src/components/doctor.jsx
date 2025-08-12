import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import '../App.css'; //import App.css to apply styling.


const Doctor = () => {
    const [loading, setLoading] = useState(true); // set loading untill data not fetched.
    const [signup_btn, setSignup_btn] = useState(true);
    const [login, setLogin] = useState(false); //set login page false at first.
    const [loginConfirm, setLoginConfirm] = useState(false); // set login confirm as false.
    const [registerConfirm, setRegisterConfirm] = useState(false); // set register confirmation page false.
    const [register, setRegister] = useState(false); //set user register page false at first.
    const [name, setName] = useState("") // set name as false.
    const [phone, setPhone] = useState(""); // set phone as false.
    const [email, setEmail] = useState(""); //set email as empty.
    const [password, setPassword] = useState(""); //set password as empty.
    const [profile, setProfile] = useState(false); // set profile as false.
    const [userInfo, setUserInfo] = useState(false); // set user info as false;
    const [doctorProfile, setDoctorProfile] = useState([]); // set user profile as an empty array.
    const [doctorId, setDoctorId] = useState("");
    const navigate = useNavigate(); // intializing useNavigate.



    //userLogin funtion to make a login request.
    const userLogin = async () => {

        //variable initialize to get user's credential.
        const userdata = {
            email: email,
            password: password
        }
        try {
            //post request with axios/
            const userLogin = await axios.post("https://shedula.onrender.com/login/userLogin", userdata)
            if (userLogin.data.token) {
                localStorage.setItem("token", userLogin.data.token) // seeting the token to local storage.
                setProfile(true) // set profile as true after getting token.
                setSignup_btn(false); //set signup button as false after successful login.
                setLogin(false);
                localStorage.setItem("user", userLogin.data.user.name);
                setLoginConfirm(true);
            }
            else {
                alert(userLogin.data.msg);
                return;
            }
        }
        catch (err) {
            console.log("failed to login", err)
        }
        setEmail("");
        setPassword("");
    }

    // function to check if token expire or not. 
    function isTokenExpire(token) {
        try {
            const decode = jwtDecode(token); //get token to variable decode
            const current_time = Date.now() / 1000; //set time to seconds
            return decode.exp < current_time; // check and return if current time greater then expiration time.
        }
        catch (err) {
            return true;
        }
    }

    // function to check if token is expired or not.
    function isTokenExpire(token) {
        try {
            const decode = jwtDecode(token);
            const current_time = Date.now() / 1000;
            return decode.exp < current_time;
        }
        catch (err) {
            return true;
        }
    }

    //useEffect functionality to set profile as false and user logout.
    useEffect(() => {
        const getToken = localStorage.getItem("token"); //get token from local storage.
        if (!isTokenExpire(getToken)) {
            setProfile(true); //set profile as true.
            setSignup_btn(false);
        }
        else {
            localStorage.removeItem("token"); // remove token from local storage.
            setProfile(false); //set profile as false.
            setSignup_btn(true);
        }
    }, [])


    //useEffect functionality to disable login confirmaion container.
    useEffect(() => {
        const timer = setTimeout(() => {
            setLoginConfirm(false);
            setRegisterConfirm(false);
        }, 2000)
        return () => clearTimeout(timer)

    }, [loginConfirm, registerConfirm])

    //useEffect functionality to disable scrolling when one of the parameter is true.
    useEffect(() => {
        if (login || register || loginConfirm || registerConfirm) {
            document.body.style.overflow = "hidden"; // disable scrolling.
        }
        else {
            document.body.style.overflow = "auto"; //enable scrolling.
        }
        return () => document.body.style.overflow = "auto"; // set scrolling to default.
    }, [login, register, loginConfirm, registerConfirm])

    //user register function to register user.
    const registerUser = async () => {
        const userData = {
            name: name,
            phone: phone,
            email: email,
            password: password
        }
        if (!name || !phone || !email || !password) {
            alert("all fields are requiured !"); // alert if given parameter is false.
            return
        }

        try {
            //post request to register user to data base.
            const userRegister = await axios.post("https://shedula.onrender.com/user/register", userData)
            if (userRegister.data.msg.includes("already")) {
                alert("User already Registered !");
                setName("");
                setPhone("");
                setEmail("");
                setPassword("");
                return;
            }
            setRegister(false);
            setRegisterConfirm(true);
            console.log(userRegister.data.msg)
        }
        catch (err) {
            console.log("failed to register", err)
        }
        setName("");
        setPhone("");
        setEmail("");
        setPassword("");
    }

    const myAppointment = () => {
        const getToken = localStorage.getItem("token"); //get token from local storage.
        const role = localStorage.getItem("user");
        if (!isTokenExpire(getToken)) {
            setProfile(true); //set profile as true.
            setSignup_btn(false); // set singnup button as false.
            
            if(role !== "doctor"){
                navigate('/user');
            }
            else if(role === "doctor"){
                navigate('/doctorProfile')
            }
        }
        else {
            alert("Session Expired, Login again !")
            localStorage.removeItem("token");
            setLoginToken("");
            setProfile(false);
            setSignup_btn(true);
            navigate('/')
            return
        }
    }



    const userLogout = async () => {
        localStorage.removeItem("token");
        setProfile(false);
        setSignup_btn(true);
        setUserInfo(false);
        navigate('/');
    }


    const profileView = async () => {
        const getToken = localStorage.getItem("token"); //get token from local storage.
        const role = localStorage.getItem("user");
        if (!isTokenExpire(getToken)) {
            setProfile(true); //set profile as true.
            setSignup_btn(false); // set singnup button as false.
            
            if(role !== "doctor"){
                navigate('/user');
            }
            else if(role === "doctor"){
                navigate('/doctorProfile')
            }
        }
        else {
            alert("Session Expired, Login again !")
            localStorage.removeItem("token");
            setLoginToken("");
            setProfile(false);
            setSignup_btn(true);
            navigate('/')
            return
        }
    }



    const fetchDoctor = async () => {
        try {
            const doctor = await axios.get("https://shedula.onrender.com/doctor/profile")
            setDoctorProfile(doctor.data.msg);
            setLoading(false);
            const doctorid = localStorage.getItem("doctorId");
            setDoctorId(doctorid);
        }
        catch (err) {
            console.log("catch error", err)
        }
    }

    useEffect(() => {
        fetchDoctor()
    }, [])


    const Bookappointment = () => {
        const getToken = localStorage.getItem("token"); //get token from local storage.
        if (getToken && !isTokenExpire(getToken)) {
            setProfile(true); //set profile as true.
            setSignup_btn(false); // set singnup button as false.
            navigate('/appointment');
        }
        else {
            alert("Please Login to Book an Appointment");
            return;
        }
    }




    return (
        <>
            <main className="container">
                <nav className='title-container'>
                    <div className='logo-container' onClick={(() => { navigate('/') })}>
                        <h1 className='title'>Healthcare</h1>
                    </div>


                    <div className="appointment-btn-container">
                        <h3 onClick={Bookappointment}>Book Appointment</h3>
                    </div>
                    <div className="about-contact-container">
                        <h4>About Us</h4>
                        <a href="#contact-container"> <h4>Contact Us</h4></a>
                    </div>


                    {/*-------------------------------------------------------Login ang sign up button section-------------------------------------------------------*/}

                    {
                        signup_btn &&
                        <div className='btn-container'>
                            <button onClick={(() => setLogin(true))} className='login-btn'>Login</button>||
                            <button onClick={(() => { setRegister(true) })} className='signup-btn'>Signup</button>
                        </div>
                    }


                    {/*----------------------------------------------------------- user profile section---------------------------------------------------------- */}


                    {
                        profile &&
                        <div className='profile-container'>
                            <img onClick={(() => { setUserInfo(true) })} src="/images/profile-icon.png" alt="profile-icon" />
                        </div>
                    }


                    {/*-------------------------------------------------------User Profile Info Section----------------------------------------------------------------*/}

                    {
                        userInfo &&
                        <div className='user-info'>
                            <div><button onClick={(() => { setUserInfo(false) })}>X</button></div>
                            <h4 onClick={profileView}>My Profile</h4>
                            <h4 onClick={myAppointment}>My Appointments</h4>
                            <h4 onClick={userLogout}>Logout</h4>
                        </div>
                    }

                    {/*--------------------------------------------------------------login section--------------------------------------------------------------- */}

                    {
                        login &&
                        <div className='overlay'>
                            <div className='login-container'>
                                <button className='login-close-btn' onClick={(() => setLogin(false))}>X</button>
                                <h1>Login to Healthcare</h1>
                                <input type="text" placeholder='Enter your email' value={email} onChange={(e) => setEmail(e.target.value)} /> <br />
                                <input type="password" placeholder='Enter your password' value={password} onChange={(e) => setPassword(e.target.value)} /> <br />
                                <button className='submit-btn' onClick={userLogin}>Login</button>
                            </div>
                        </div>
                    }

                    {
                        loginConfirm &&
                        <div className='overlay'>
                            <div className='confirmation-container'>
                                <img src="/images/success-icon.png" alt="success-icon" />
                                <h2>Login Successfully !</h2>
                            </div>
                        </div>
                    }

                    {/* ----------------------------------------------------------------sign up section---------------------------------------------------------- */}

                    {
                        register &&
                        <div className='overlay'>
                            <div className='register-container'>
                                <button className='register-close-btn' onClick={(() => setRegister(false))}>X</button>
                                <h1>Register to Healthcare</h1>
                                <input type="text" placeholder='Enter your name' value={name} onChange={(e) => setName(e.target.value)} /> <br />
                                <input type="email" placeholder='Enter your email' value={email} onChange={(e) => setEmail(e.target.value)} /> <br />
                                <input type="text" placeholder='Enter your phone number' value={phone} onChange={(e) => setPhone(e.target.value)} /> <br />
                                <input type="password" placeholder='Enter your password' value={password} onChange={(e) => setPassword(e.target.value)} /> <br />
                                <button className='submit-btn' onClick={registerUser}>Register</button>
                            </div>
                        </div>
                    }

                    {
                        registerConfirm &&
                        <div className='overlay'>
                            <div className='confirmation-container'>
                                <img src="/images/success-icon.png" alt="success-icon" />
                                <h2>Registered Successfully !</h2>
                            </div>
                        </div>
                    }
                </nav>
                <div className="doctor-heading"><h1>Doctor's Profile</h1></div>
                <div className="doctor-container">
                    {loading ? (<h2>Loading...</h2>) : (
                        doctorProfile.filter(doctor => doctor._id === doctorId)
                            .map((doctor, index) => (
                                <div className="doctor-profile-container" key={index}>
                                    <div className="image-container"> <img src={`https://shedula.onrender.com${doctor.image}`} alt="" /></div>
                                    <hr />
                                    <div className="profile-card">
                                        <div>
                                            <h2>Name:-</h2>
                                            <h3>Designation:-</h3>
                                            <h3>Address:-</h3>
                                            <h3>Contact:-</h3>
                                        </div>
                                        <div>
                                            <h2>{doctor.name}</h2>
                                            <h3>{doctor.designation}</h3>
                                            <h3>{doctor.address}</h3>
                                            <h3>{doctor.phone}</h3>
                                        </div>
                                    </div>
                                </div>
                            ))
                    )
                    }
                </div>
                <footer className="footer">
                    <div className="contact-container" id="contact-container">
                        <h4>Reach out to us:-</h4>
                        <h4>Call:- 9097745573</h4>
                        <h4>Email:- awadhesh0506kumar@gmail.com</h4>
                    </div>
                    <hr />
                    <p>This Website is Developed and Maintained by Awadhesh Kumar <br />
                        All the Copy Rights Reserved to Awadhesh Kumar
                    </p>
                </footer>
            </main>
        </>
    )
}

export default Doctor;