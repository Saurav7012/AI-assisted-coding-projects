import { useState, useEffect} from "react";
import Card from "./Card";



export default function Crypto(){

    const [coinData,setCoinData] = useState([]);
    const [AllcoinData,setAllCoinData] = useState([]);
    const [value,setValue] = useState("");
    const [number,setNumber] = useState("");

    
    async function fetchCoins(number){

        try{
            const response = await fetch(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${number}&page=1`);
            const data = await response.json();
            setAllCoinData(data);
            setCoinData(data);
        }catch(err){
            console.log("error occured");
        }
    }

    useEffect(()=>{
        fetchCoins(number);
    },[])

    function handleKeyDown(e){
        if(e.key==="Enter" || e.type==='click'){
            setCoinData(AllcoinData.filter((obj)=>(
                obj.id.startsWith(value.trim().toLowerCase())
            )))
            setValue("");
            document.querySelector(".container .textbox").blur();
        }
    }
    
    function sortArray(val,order){
        const newArr = [...coinData].sort((obj1,obj2)=>{

            if(order==='desc')
            return obj2[val]-obj1[val];
            else if(order==='asc')
            return obj1[val]-obj2[val];
            else if(order==='rank')
            return obj2[val]-obj1[val];

        })
        setCoinData(newArr);
    }

    function refreshArray(){
        setCoinData(AllcoinData);
    }

    return (
        <div className="container">
            <input className="textbox" type="text" value={value.toUpperCase()} onKeyDown={handleKeyDown} onChange={(e)=>setValue(e.target.value)}></input>
            <button className="search btn" onClick={handleKeyDown}>SEARCH</button>
            <button className="search" onClick={()=>sortArray("current_price","asc")}>PRICE SORT ASC</button>
            <button className="search" onClick={()=>sortArray("current_price","desc")}>PRICE SORT DESC</button>
            <button className="search" onClick={()=>sortArray("market_cap_rank","rank")}>RANK SORT</button>
            <button className="search" onClick={refreshArray}>REFRESH</button>

            <input className="textbox" type="number" value={number} onChange={(e)=>{
                setNumber(e.target.value)
            }}></input>
            <button className="search btn" onClick={()=>{
                fetchCoins(number)
                setNumber("");
            }}>DO</button>
            {
                coinData.map((coin)=>(
                    <Card
                        key = {coin.id}
                        id = {coin.id}
                        name = {coin.name}
                        image = {coin.image}
                        current_price = {coin.current_price} 
                        market_cap_rank = {coin.market_cap_rank}
                        total_supply = {coin.total_supply}
                    />
                ))
            }
        </div>
    )
}