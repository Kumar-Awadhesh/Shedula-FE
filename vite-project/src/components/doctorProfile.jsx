import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import '../App.css'; //import App.css to apply styling.


const DoctorProfile = () => {
    const [loading, setLoading] = useState(true); // set loading untill data not fetched.
    const [loginLoading, setLoginLoading] = useState(false);
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
    const [doctorAppointments, setDoctorAppointments] = useState([]);
    const [appointmentComplete, setAppointmentComplete] = useState(false);
    const [prescriptionData, setPrescriptionData] = useState(false);
    const [medicineName, setMedicineName] = useState("");
    const [dose, setDose] = useState("");
    const [description, setDescription] = useState("");
    const [doctorPrescriptionData, setDoctorPrescriptionData] = useState([]);
    const navigate = useNavigate(); // intializing useNavigate.



    //userLogin funtion to make a login request.
    const userLogin = async () => {
        setLogin(false);
        setLoginLoading(true);
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
                localStorage.setItem("user", userLogin.data.user.name);
                setLoginConfirm(true);
                setLoginLoading(false);
            }
            else {
                setLoginLoading(false);
                alert(userLogin.data.msg);
                setEmail("");
                setPassword("");
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
            alert("Session Expired!");
            navigate('/')
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
        }
        catch (err) {
            console.log("failed to register", err)
        }
        setName("");
        setPhone("");
        setEmail("");
        setPassword("");
    }



    const userLogout = async () => {
        localStorage.removeItem("token");
        setProfile(false);
        setSignup_btn(true);
        setUserInfo(false);
        navigate('/');
    }

    const appointmentBook = () => {
        navigate('/appointment')
    }

    const fetchDoctor = async () => {
        const token = localStorage.getItem("token")
        try {
            const doctor = await axios.get("https://shedula.onrender.com/doctor/doctorProfile", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            setDoctorProfile([doctor.data.msg]);
            setLoading(false);

        }
        catch (err) {
            console.log("doctor catch error", err);
        }
    }

    useEffect(() => {
        fetchDoctor();
        fetctDoctorAppointment();
       getPrescriptionData();
    }, [])


    const profileView = () => {
        const getToken = localStorage.getItem("token"); //get token from local storage.
        const role = localStorage.getItem("user");
        if (!isTokenExpire(getToken)) {
            setProfile(true); //set profile as true.
            setSignup_btn(false); // set singnup button as false.

            if (role !== "doctor") {
                navigate('/user');
            }
            else if (role === "doctor") {
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

    const myAppointment = () => {
        const getToken = localStorage.getItem("token"); //get token from local storage.
        const role = localStorage.getItem("user");
        if (!isTokenExpire(getToken)) {
            setProfile(true); //set profile as true.
            setSignup_btn(false); // set singnup button as false.

            if (role !== "doctor") {
                navigate('/user');
            }
            else if (role === "doctor") {
                navigate('/doctorProfile')
            }
        }
        else {
            alert("Session Expired, Login again !")
            localStorage.removeItem("token");
            setLoginToken("");
            setProfile(false);
            setSignup_btn(true);
            alert("Session Expired!")
            navigate('/')
            return
        }
    }

    const fetctDoctorAppointment = async () => {
        const token = localStorage.getItem("token");
        const doctorAppointment = await axios.get("https://shedula.onrender.com/appointment/getAppointment", {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        setDoctorAppointments(doctorAppointment.data.msg);
    }

    const markAsComplete = (e) => {
        if (e.target.value === "complete") {
            setAppointmentComplete(true);
        }
        else {
            setAppointmentComplete(false);
        }
    }

    const addPrescription = async(user) => {
        const prescriptionData = {
            medicine: medicineName,
            dosage: dose,
            description: description,
            patientId: user._id
        }
       
        if(!prescriptionData.medicine || !prescriptionData.dosage || !prescriptionData.description){
            alert("All fields required!");
            return;
        }
        const token = localStorage.getItem("token");
        const prescriptionMsg = await axios.post("https://shedula.onrender.com/prescription/addPrescription", prescriptionData, {
            headers:{
                Authorization: `Bearer ${token}`
            }
        })
        
        
        alert(prescriptionMsg.data.msg);
        setMedicineName("");
        setDose("");
        setDescription("");
        setPrescriptionData(false);
    }

    const getPrescriptionData = async() => {
        const token = localStorage.getItem("token")
        const getPrescription = await axios.get("https://shedula.onrender.com/prescription/getPrescription", {
            headers:{
                Authorization: `Bearer ${token}`
            }
        })
        console.log(getPrescription.data.msg)
        setDoctorPrescriptionData(getPrescription.data.msg);
    }






    return (
        <>
            <main className="container">
                <nav className='title-container'>
                    <div className='logo-container' onClick={(() => { navigate('/') })}>
                        <img src="images/official-logo.png" alt="official-logo" />
                        <h1 className='title'>Healthcare</h1>
                    </div>


                    <div className="appointment-btn-container">
                        <h3 onClick={appointmentBook}>Book Appointment</h3>
                    </div>
                    <div className="about-contact-container">
                        <h4>About us</h4>
                        <a href="#contact-container"> <h4>Contact us</h4></a>
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
                                <img className="official-logo" src="images/official-logo.png" alt="official-logo" />
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
                                <img className="official-logo" src="images/official-logo.png" alt="official-logo" />
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

                    {
                        loginLoading &&
                        <div className="overlay">
                            <div className="loading-container">
                                <h3>Please Wait...</h3>
                            </div>
                        </div>
                    }
                </nav>
                <div className="doctor-page-container">
                    {loading ? (<h3>Loading...</h3>) : (
                        doctorProfile.map((doctor, index) => (
                            <div className="doctor-profile-card" key={index}>
                                <div className="doctor-heading"><h2>Doctor Section</h2></div>
                                <div className="personal-detail">
                                    <div className="doctor-image-container"><img src={`https://shedula.onrender.com${doctor.image}`} alt="" /></div>
                                    <hr />
                                    <div>
                                        <h3>Name:-</h3>
                                        <h3>Designation:-</h3>
                                        <h3>Phone:-</h3>
                                        <h3>Email:-</h3>
                                        <h3>Address:-</h3>
                                    </div>
                                    <div>
                                        <h3>{doctor.name}</h3>
                                        <h3>{doctor.designation}</h3>
                                        <h3>{doctor.phone}</h3>
                                        <h3>{doctor.email}</h3>
                                        <h3>{doctor.address}</h3>
                                    </div>
                                </div>
                            </div>
                        ))
                    )
                    }
                </div>
                <div className="doctor-appointment-container">
                    <h2 className="doctor-heading">Appointment Detail</h2>
                    {
                        doctorAppointments.map((app, index) => (
                            <div className="doctor-appointment-card" key={index}>
                                <div>
                                    <h3>Patient:-</h3>
                                    <h3>Date:-</h3>
                                    <h3>Time:-</h3>
                                </div>
                                <div>
                                    {
                                        app.user.map((user, index) => (
                                            <h3 key={index}>{user.name}</h3>
                                           
                                        ))
                                    }
                                    <h3>{app.date}</h3>
                                    <h3>{app.time}</h3>
                                </div>
                                <hr />
                                <div className="cancel-complete-prescription-btn-container">
                                    <button className="cancel-btn">Cancel Appointment</button>
                                    <select className="complete-btn" onChange={markAsComplete}>
                                        <option value="">Status</option>
                                        <option value="complete">Complete</option>
                                        <option value="incomplete">Incomplete</option>
                                    </select>
                                    {
                                        appointmentComplete &&
                                        <button className="prescription-btn" onClick={() => setPrescriptionData(true)}>Prescription</button>
                                    }
                                </div>
                            </div>
                        ))
                    }

                    {
                        prescriptionData &&
                        <div className="overlay">
                            <div className="prescription-container">
                                <div className="prescription-disable-btn"><button onClick={() => setPrescriptionData(false)}>X</button></div>
                                <div className='logo-container prescription-logo' onClick={(() => { navigate('/') })}>
                                    <img src="images/official-logo.png" alt="official-logo" />
                                    <h1 className='title'>Healthcare</h1>
                                </div>
                                <h1 className="prescription-form-heading">Prescription for Patient</h1>
                                <div className="prescription-form-container">
                                    <input type="text" placeholder="Enter Medicine" value={medicineName} onChange={(e) => setMedicineName(e.target.value)} /> <br />
                                    <input type="text" placeholder="Enter dosages" value={dose} onChange={(e) => setDose(e.target.value)} /> <br />
                                    <input type="text" placeholder="Enter instruction" value={description} onChange={(e) => setDescription(e.target.value)} /> <br />
                                    {
                                        doctorAppointments.map((app, index) => (
                                            <div key={index} className="userid-container">
                                                {app.user.map((user, index) => (
                                                    
                                                    <button key={index} className="prescription-add-btn" onClick={()=>addPrescription(user)}>Add Prescription</button>
                                                ))}
                                            </div>
                                        ))
                                    } <br />
                                    
                                </div>
                            </div>
                        </div>
                    }
                </div>
                
                <h2 className="prescription-data-heading">Prescription Detail</h2>
                {
                    <div className="prescription-data-container">
                    {
                        appointmentComplete &&
                        doctorPrescriptionData.map((pres, index) => (
                            <div className="doctor-prescription-card" key={index}>
                                <div>
                                    <h3>Medicine:- </h3>
                                    <h3>Dosage:- </h3>
                                    <h3>Instruction:- </h3>
                                </div>
                                <div>
                                    <h3>{pres.medicine}</h3>
                                    <h3>{pres.dosage}</h3>
                                    <h3>{pres.description}</h3>
                                </div>
                            </div>
                        ))
                    }
                    </div>
                }
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

export default DoctorProfile;