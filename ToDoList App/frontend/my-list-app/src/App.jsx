import { useEffect, useState, useRef  } from "react";
import axiosClient from "../utils/axiosClient"


export default function App(){

  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editingText, setEditingText] = useState("");
  const [tasks,setTasks] = useState([]);
  const inputRef = useRef();

  
  
  

  async function fetchTasks(){
    try{
    const response = await axiosClient.get('/task/getAlltasks');
    setTasks(response?.data);
    }catch(err){
      console.log(err?.response?.data);
    }
  }

  useEffect(()=>{
    fetchTasks();
  },[]);

  async function handleAddTask(){

    if(inputRef.current.value.trim()==='') return;

    const response = await axiosClient.post('/task/add',{content: inputRef.current.value.trim()});
    setTasks([...tasks,response?.data]);
    inputRef.current.value = "";
  }

  async function handleDeleteTask(taskId){
    const response = await axiosClient.delete(`/task/${taskId}`);
    setTasks([...tasks].filter((task)=>(
      task?._id!=response?.data?._id
    )))
  }

  function handleKeyPress(e){
    if(e.key==='Enter')
      handleAddTask();
  }

  async function handleEditTask(taskId){
    const response = await axiosClient.patch(`/task/${taskId}`, {content: editingText })
    const task = tasks.find((task)=>(
      task._id===response?.data?._id
    ))
    task.content = response?.data?.content;
    setTasks([...tasks]);
    setEditingTaskId(null);
  }


  

  return (
    <div className="flex flex-col justify-center h-screen items-center ">
      <div className="flex gap-1 mb-10">
        <input ref={inputRef} placeholder="Enter task..." className="input w-70" onKeyDown={(e)=>{handleKeyPress(e)}}></input>
        <button className="btn btn-info" onClick={handleAddTask}>ADD</button>
      </div>

      <div className="flex flex-col gap-3">
          {
            tasks.map((task)=>(
                <div key={task?._id} className="flex gap-1">


                  

                  { editingTaskId === task._id ? (
                    <>
                      <input 
                        className="input w-70"
                        value={editingText}
                        onChange={(e)=>setEditingText(e.target.value)}
                      />
                      <button className="btn btn-warning btn-sm relative top-1" onClick={()=>handleEditTask(task._id)}>SAVE</button>
                      <button className="btn btn-sm btn-error relative top-1" onClick={()=>setEditingTaskId(null)}>CANCEL</button>
                    </>) :

                    <>
                    <p className="input w-70">{task?.content}</p>
                    <button className="btn btn-success btn-sm relative top-1" onClick={()=>handleDeleteTask(task._id)}>DONE</button>
                    <button className="btn btn-sm btn-soft relative top-1" onClick={()=>{
                      setEditingTaskId(task._id)
                      setEditingText(task.content)
                    }}>EDIT</button>
                    </>
                  } 

                </div>
            ))
          }
      </div>
    </div>
  )
}