import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerUser } from "../store/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
import { EyeOn, EyeOff} from "../icons/Eye";


const schema = z.object({
  firstName: z.string().min(2, "Name too short"),
  emailId: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be 6 characters")
});

export default function Signup() {

  console.log("render signup");

  const [showPassword,setShowpassword] = useState(false);


  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { register, handleSubmit, formState:{errors} } = useForm({
    resolver: zodResolver(schema),
  });


  const {isAuthenticated,loading} = useSelector((state) => state.user);
  console.log(isAuthenticated);
  
  
  useEffect(()=>{
    if(isAuthenticated){
      navigate("/");
  }
  },[isAuthenticated])







  function onSubmit(data){
    dispatch(registerUser(data));
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-base-200">
  <form 
    onSubmit={handleSubmit(onSubmit)} 
    className="card w-96 bg-base-100 shadow-xl p-6 space-y-4"
  >

    <h2 className="text-2xl font-bold text-center">Signup</h2>

    <input
      {...register("firstName")}
      placeholder="Enter name"
      className={`input input-bordered w-full ${errors.firstName && "input-error"}`}
    />
    {errors.firstName && <span className="text-red-500 text-xs">
                            {errors.firstName?.message}
                            </span>}

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
        {...register("password") }
        placeholder="Enter password"
        className={`input input-bordered w-full ${errors.password && "input-error"}`}
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
      Already have an account?{" "}
      <NavLink to="/login" className="text-blue-500 hover:underline">
        Login
      </NavLink>
    </p>

  </form>
</div>

  );
}