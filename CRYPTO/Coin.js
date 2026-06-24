import { useEffect, useState } from "react";
import { useParams } from "react-router"

export default function Coin(){

    const {name} = useParams();
    const [coin,setCoin] = useState({});

    async function fetchCoin(){
        const response = await fetch(`https://api.coingecko.com/api/v3/coins/${name}`)
        const data = await response.json();
        setCoin(data);
    }

    useEffect(()=>{
        fetchCoin()
    },[])

    return (
        <div className="coinRoute">
            <h1>{coin?.name}</h1>
            <img src={coin?.image?.large}></img>
            <p>{coin?.description?.en}</p>
        </div>
    )
}