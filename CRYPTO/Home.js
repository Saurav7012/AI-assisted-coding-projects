import { Link } from "react-router";
import "./Home.css";

export default function Home() {
  return (
    <div className="home2">

      <div className="home2-container">

        <div className="left">
          <h1>
            The Future of <span>Crypto Intelligence</span>
          </h1>

          <p>
            A modern crypto tracking platform built for speed,
            clarity, and precision. Monitor market trends,
            analyze rankings, and explore digital assets in real-time.
          </p>

          <div className="btn-group">
            <Link to="/crypto" className="btn-main">
              Launch Dashboard →
            </Link>
          </div>
        </div>

        <div className="right">
          <div className="stat-card">
            <h2>250+</h2>
            <p>Coins Tracked</p>
          </div>

          <div className="stat-card">
            <h2>Live</h2>
            <p>Market Updates</p>
          </div>

          <div className="stat-card">
            <h2>Smart</h2>
            <p>Sorting Engine</p>
          </div>

          <div className="stat-card">
            <h2>Secure</h2>
            <p>API Integration</p>
          </div>
        </div>
      </div>

    </div>
  );
}
