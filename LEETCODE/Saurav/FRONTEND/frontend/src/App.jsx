import Signup from "./pages/Signup"
import Login from "./pages/Login";
import Homepage from "./pages/Homepage"
import { Routes, Route, Navigate, Link } from "react-router-dom";
import { checkAuth } from "./store/authSlice";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Admin from "./pages/Admin";
import AdminPanel from "./components/AdminPanel";
import ProblemPage from "./pages/ProblemPage";




export default function App(){

  console.log("render app");

  const dispatch = useDispatch();

  const {isAuthenticated,user,error} = useSelector((state) => state.user);
  console.log(isAuthenticated);
  console.log(user);


  useEffect(()=>{
    dispatch(checkAuth());
  },[]);

  

  return (

      <>

      <Routes>
        {/* <Route path="/" element={<Homepage/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/signup" element={<Signup/>}/> */}


        
        <Route path="/" element={isAuthenticated? <Homepage/> : <Navigate to="/login"/>} />
        <Route path="/login" element={isAuthenticated ? <Navigate to="/"/> : <Login/>} />
        <Route path="/signup" element={isAuthenticated ? <Navigate to="/"/> : <Signup/>} />
        <Route path="/admin" element={isAuthenticated ? <Admin/> : <Navigate to="/" />}></Route>
        <Route path="/admin/create-problem" element={<AdminPanel/>}></Route>

        <Route path="/problem/:problemId" element={<ProblemPage/>}></Route>
  
      </Routes>
      </>
  )
}