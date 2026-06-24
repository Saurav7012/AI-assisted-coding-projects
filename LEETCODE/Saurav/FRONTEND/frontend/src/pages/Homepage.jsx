import { useDispatch,useSelector } from "react-redux";
import { logoutUser } from "../store/authSlice"
import { NavLink, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { axiosClient } from "../utils/axiosClient";

export default function Homepage(){
 
    const [Allproblems,setAllproblems] = useState([]);
    const [solvedProblems,setSolvedProblems] = useState([]);
    const [filters, setFilters] = useState({
        difficulty: 'all',
        tag: 'all',
        status: 'all' 
    });


    

    const dispatch = useDispatch();
    const navigate = useNavigate();


    const {isAuthenticated,user} = useSelector((state) => state.user);
    console.log(isAuthenticated);
    console.log(user);

    

    useEffect(()=>{
        if(!isAuthenticated){
            navigate('/login'); 
        }
    },[isAuthenticated]);



    function handleClick(){
        dispatch(logoutUser());
    }


    async function getAllProblems() {
        try {
            const { data } = await axiosClient.get('/problem/getAllproblems');
            setAllproblems(data);
        } catch (err) {
            console.error(err?.response?.data);
        }
    }

    async function getsolvedProblems() {
        try {
            const {data} = await axiosClient.get('/problem/solvedAllproblemsByUser');
            setSolvedProblems(data);
        } catch (err) {
            console.error(err?.response?.data);
        }
    }


    useEffect(()=>{
        getAllProblems();
        getsolvedProblems();
    },[])



    const filteredProblems = Allproblems.filter( (problem) => {
    
        const statusMatch = filters.status==='all' || solvedProblems.find((sp)=>{
        return sp._id===problem._id;
        })

        const difficultyMatch = filters.difficulty==='all' || filters.difficulty===problem.difficulty;
        const tagMatch = filters.tag==='all' || filters.tag===problem.tags;
        
        return statusMatch && difficultyMatch && tagMatch;
    });


    const difficultyColors = {
        easy: "from-green-400 to-green-600",
        medium: "from-yellow-400 to-yellow-600",
        hard: "from-red-400 to-red-600",
    };


    return (

    <div>

        {/* header */}
        <div className="navbar bg-base-200 mb-5 px-6 shadow-md">
                <div className="flex-1">
                    <h1 className="text-xl font-bold text-white">LeetCode</h1>
                </div>

                <div className="flex-none">
                    <div className="dropdown dropdown-end">
                    <label tabIndex={0} className="cursor-pointer font-medium">
                        {user?.data?.firstName}
                    </label>

                    <ul
                        tabIndex={0}
                        className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-25 mt-1"
                    >
                        
                        {user?.data?.role==='admin' && (<li><NavLink to="/admin">Admin</NavLink></li>)}
                        <li>
                            <button onClick={handleClick}>Logout</button>
                        </li>
                    </ul>
                    </div>
                </div>
            
            
            
        </div>


        {/* 3 dropdowns */}
        <div className="flex flex-wrap gap-4 mb-6 scale-75">
            {/* Status Filter */}
            <select 
            className="select select-bordered text-sm"
            value={filters.status}
            onChange={(e) => setFilters({...filters, status: e.target.value})}
            >
                <option value="all">All Problems</option>
                <option value="solved">Solved Problems</option>
            </select>

            {/* Difficulty Filter */}
            <select 
            className="select select-bordered"
            value={filters.difficulty}
            onChange={(e) => setFilters({...filters, difficulty: e.target.value})}
            >
                <option value="all">All Difficulties</option>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
            </select>

            {/* Tag Filter */}
            <select 
            className="select select-bordered"
            value={filters.tag}
            onChange={(e) => setFilters({...filters, tag: e.target.value})}
            >
                <option value="all">All Tags</option>
                <option value="array">Array</option>
                <option value="linkedList">Linked List</option>
                <option value="graph">Graph</option>
                <option value="dp">DP</option>
            </select>
        </div>



        {/* problems*/}
        <div className="mt-10">
            {
                filteredProblems?.map((problem)=>(
        
                    <div key={problem._id} className="w-1/2 mx-auto my-4 p-6 bg-white/10 backdrop-blur-md rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-white/20">
                    {/* Title */}
                    <NavLink to={`/problem/${problem._id}`}>
                    <h2 className="text-xl font-bold mb-3 text-whiter cursor-pointer hover:text-blue-400">{problem.title}</h2>
                    </NavLink>

                        <div className="flex flex-wrap gap-3">
                            {/* Difficulty Badge */}
                            <span
                            className={`inline-block px-3 py-1 rounded-full text-sm font-medium text-white bg-gradient-to-r ${difficultyColors[problem.difficulty]}`}
                            >
                            {problem.difficulty}
                            </span>

                            {/* Tags */}
                            {problem.tags &&
                            problem.tags.split(",").map((tag) => (
                                <span
                                key={tag}
                                className="inline-block px-3 py-1 rounded-full text-sm text-white bg-purple-600/70 hover:bg-purple-700 transition-colors"
                                >
                                {tag.trim()}
                                </span>
                            ))}
                        </div>
                    </div>

                ))
            }
            </div>
        </div>
    )


    
}