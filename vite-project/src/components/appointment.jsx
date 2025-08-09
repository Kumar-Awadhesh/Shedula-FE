import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import '../App.css'; //import App.css to apply styling.


const Appointment = () => {
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
    const [appointment, setAppointment] = useState(false);
    const [doctorName, setDoctorName] = useState("");
    const [doctorRole, setDoctorRole] = useState("");
    const [doctorPhone, setDoctorPhone] = useState("");
    const [doctorAddress, setDoctorAddress] = useState("");
    const [appointmentDate, setAppointmentDate] = useState("");
    const [appointmentTime, setAppointmentTime] = useState("");
    const [doctorImage, setDoctorImage] = useState("");
    const [doctoId, setDoctorId] = useState("");
    const [appointmentConfirmation, setAppointmentConfirmation] = useState(false);
    const [userName, setUserName] = useState("");
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
            setSignup_btn(false)
        }
        else {
            localStorage.removeItem("token"); // remove token from local storage.
            setProfile(false); //set profile as false.
            setSignup_btn(true);
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



    const userLogout = async () => {
        localStorage.removeItem("token");
        setProfile(false);
        setSignup_btn(true);
        setUserInfo(false);
        navigate('/')
    }


    const profileView = async () => {
        const getToken = localStorage.getItem("token"); //get token from local storage.
        if (getToken && !isTokenExpire(getToken)) {
            setProfile(true); //set profile as true.
            setSignup_btn(false); // set singnup button as false.
            navigate('/user');
        }
        else {
            alert("Session Expired, Login again !")
            localStorage.removeItem("token");
            setLoginToken("");
            setProfile(false);
            setSignup_btn(true);
            return
        }
    }

    const myAppointment = () => {

    }



    const fetchDoctor = async () => {
        try {
            const doctor = await axios.get("https://shedula.onrender.com/doctor/profile")
            setDoctorProfile(doctor.data.msg);
            setLoading(false);
        }
        catch (err) {
            console.log("catch error", err)
        }
    }

    useEffect(() => {
        fetchDoctor()
    }, [])

    const user = localStorage.getItem("user");
    console.log(user)
    const appointmentPrev = (doctor) =>{
        setDoctorName(doctor.name);
        setDoctorRole(doctor.designation);
        setDoctorId(doctor._id);
        setDoctorPhone(doctor.phone);
        setDoctorAddress(doctor.address);
        setDoctorImage(doctor.image)
        setUserName(user);
        setAppointment(true);
  
    }


    const confirmAppointment = async() => {
        setAppointment(false);
    

        const doctorInfo = {
            image: doctorImage,
            name: doctorName,
            patientName: user,
            designation: doctorRole,
            doctorId: doctoId,
            phone: doctorPhone,
            address: doctorAddress,
            date: appointmentDate,
            time: appointmentTime
        }

        if(!doctorInfo.image || !doctorInfo.name || !doctorInfo.designation || !doctorInfo.phone || !doctorInfo.address || 
            !doctorInfo.date || !doctorInfo.doctorId || !doctorInfo.time){
            alert("All fields required !")
            return

        }
        const loginToken = localStorage.getItem("token");
        if (!isTokenExpire(loginToken)) {
            setProfile(true); //set profile as true.
            setSignup_btn(false); // set singnup button as false.
        }
        else{
            alert("Session Expired !");
            navigate('/');
            return
        }

        setAppointmentConfirmation(true);

        if(appointmentConfirmation)
            try {
            const addAppointment = await axios.post("https://shedula.onrender.com/appointment/book", doctorInfo, {
                headers:{
                    Authorization: `Bearer ${loginToken}`
                }
            })
                alert(addAppointment.data.msg);
                setAppointmentDate("");
                setAppointmentTime("");
            } 
            catch (err) {
                console.log("catch error", err);
                setAppointmentDate("");
                setAppointmentTime("");
            }
       
    }

    const Bookappointment = () => {
        const getToken = localStorage.getItem("token"); //get token from local storage.
        if (isTokenExpire(getToken)) {
            setProfile(true); //set profile as true.
            setSignup_btn(false); // set singnup button as false.
            navigate('/appointment');
        }
        else{
            alert("Please Login to Book an Appointment");
            navigate('/');
        }
    }

    const reschedule = () => {
        setAppointmentConfirmation(false);
        setAppointment(true);
    }

    const saveAppointment = async() => {
        await confirmAppointment();
        setAppointmentConfirmation(false);
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
                <div className="doctor-heading"><h1>Book Appointment</h1></div>
                <div className="doctor-appointment-container">
                    {loading ? (<h2>Loading...</h2>) : (
                        doctorProfile.map((doctor, index) => (
                            <div className="doctor-profile-appointment" key={index}>
                                <div className="appointment-image-container"> <img src={`https://shedula.onrender.com${doctor.image}`} alt="" /></div>
                            
                                <div className="appointment-profile-card">
                                    <h2>Name:- {doctor.name}</h2>
                                    <h3>Designation:- {doctor.designation}</h3>
                                   
                                    <h4>Address:- {doctor.address}</h4>
                                    <p><b>Contact:- {doctor.phone}</b></p>
                                </div>
                                <div className="appointment-btn-container"><button onClick={()=>appointmentPrev(doctor)}>Book Appointment</button></div>
                            </div>
                        ))
                    )
                    }

                    {
                        appointment &&
                        <div className="overlay">
                            <div className="appointment-prev-container">
                                <h3>Schedule Appointment</h3>
                                <button onClick={()=>setAppointment(false)}>X</button> <br />
                                <input type="date" value={appointmentDate} onChange={(e)=>setAppointmentDate(e.target.value)}/> <br />
                                <input type="time" value={appointmentTime} onChange={(e)=>setAppointmentTime(e.target.value)}/> <br />
                                <button className="date-appointment-btn" onClick={confirmAppointment}>Book Appointment</button>
                            </div>
                        </div>
                    }

                    {
                        appointmentConfirmation &&
                        <div className="overlay">
                            <div className="appointment-confirmation-container">
                                <h3>Confirm Appointment</h3>
                                <div className="appointment-detail">
                                    <h4>Dr. :- {doctorName}</h4>
                                    <h4>Designation :- {doctorRole}</h4>
                                    <h4>Patient :- {userName}</h4>
                                    <h4>Date :- {appointmentDate}</h4>
                                    <h4>Time :- {appointmentTime}</h4>
                                    <div className="confirm&Reschedule-button-containerb">
                                        <button onClick={reschedule}>Reschedule</button>
                                        <button onClick={saveAppointment}>Confirm</button>
                                    </div>
                                </div>
                            </div>
                        </div>
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

export default Appointment;