import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginUser } from "../store/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
import { EyeOn, EyeOff} from "../icons/Eye";


const schema = z.object({
  emailId: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be 6 characters")
});

export default function Login() {

  console.log("render login");

  const [showPassword,setShowpassword] = useState(false);


  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { register, handleSubmit, formState:{errors} } = useForm({
    resolver: zodResolver(schema)
  });

  


  const {isAuthenticated,error,loading} = useSelector((state) => state.user);
  console.log(isAuthenticated);
  console.log(error);
  
  
  useEffect(()=>{
    if(isAuthenticated){
      navigate("/");
  }
  },[isAuthenticated])

  
  function onSubmit(data){
    console.log(data);
    dispatch(loginUser(data));
  }

  
  return (
    <div className="flex justify-center items-center min-h-screen bg-base-200">
  <form 
    onSubmit={handleSubmit(onSubmit)} 
    className="card w-96 bg-base-100 shadow-xl p-6 space-y-4"
  >

    <h2 className="text-2xl font-bold text-center">Login</h2>

    <input
      {...register("emailId") }
      placeholder="Enter email"
      className={`input input-bordered w-full ${errors.emailId && "input-error"}`}
    />
    {errors.emailId && <span className="text-red-500 text-xs">
                            {errors.emailId?.message}
                            </span>}
    

    <div className="relative w-full">

  <input
    type={ showPassword ? "text" : "password"}
    {...register("password")}
    placeholder="Enter password"
    className={`input input-bordered w-full pr-10 ${
      errors.password && "input-error"
    }`}
  />

  <button type="button" onClick={()=>{setShowpassword(!showPassword)}}>
    {showPassword ? <EyeOff/> : <EyeOn/>}
  </button>


</div>


    {errors.password && <span className="text-red-500 text-xs">
                            {errors.password?.message}
                            </span>}
                            

    <button
        type="submit"
        disabled={loading}
        className="btn btn-primary w-full 
                  disabled:bg-gray-400 
                  disabled: text-white
                  disabled:cursor-not-allowed 
                  disabled:opacity-50"
      >
        Submit
    </button>


    <p className="text-sm mx-auto">
        Don't have an account?{" "}
        <NavLink to="/signup" className="text-blue-500 hover:underline">
          Signup
        </NavLink>
    </p>

    {/* {error && <span className="text-red-500 text-sm mt-1 block">{error.message}</span>} */}

  </form>
</div>

  );
}