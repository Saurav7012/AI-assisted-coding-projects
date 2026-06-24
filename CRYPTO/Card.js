import { Link } from "react-router"

export default function Card({id,name,image,current_price,market_cap_rank,total_supply}){
    return (

        <Link to={`/crypto/${id}`}>
        <div className="card">
            <p className="name">{name}</p>
            <img src={image}></img>
            <p className="price">${current_price}</p>
            <p className="rank">Rank {market_cap_rank}</p>
            <p className="supply">Available : {Math.floor(total_supply)} coins</p>
        </div>
        </Link>
    )
}