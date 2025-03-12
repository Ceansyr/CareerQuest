import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./App.css";

const App = () => {
  const [jobs, setJobs] = useState([]);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState([]);
  const [user, setUser] = useState(null);
  const [allSkills] = useState(["Frontend", "Backend", "JavaScript", "Python", "React", "Node.js"]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/jobs`,
          { params: { name: search, skills: filters.join(",") } }
        );
        if (res.data) {
          setJobs(res.data);
        } else {
          console.error("Fetched data is undefined");
        }
      } catch (error) {
        console.error("Error fetching jobs", error);
      }
    };
    fetchJobs();
  }, [search, filters]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const userData = localStorage.getItem("user");
      if (userData && userData !== "undefined") {
        setUser(JSON.parse(userData));
      } else {
        setUser(null);
      }
    } else {
      setUser(null);
    }
  }, []);

  const handleFilterChange = (e) => {
    const skill = e.target.value;
    if (skill && !filters.includes(skill)) {
      setFilters((prev) => [...prev, skill]);
    }
  };

  const removeFilter = (skill) => {
    setFilters((prev) => prev.filter((s) => s !== skill));
  };

  return (
    <div className="app-container">
      <div className="navbar">
        <h1 className="logo">CareerQuest</h1>
        {user ? (
          <p>Welcome, {user}</p>
        ) : (
          <div>
            <button onClick={() => navigate("/login")} className="login-button">Login</button>
            <button onClick={() => navigate("/register")} className="register-button">Register</button>
          </div>
        )}
      </div>

      <div className="search-container">
        <input 
          type="text" 
          placeholder="🔍 Type any job title" 
          value={search} 
          onChange={(e) => setSearch(e.target.value)}
          className="search-input"
        />
        <select onChange={handleFilterChange} className="skill-dropdown">
          <option value="">Select a skill</option>
          {allSkills.map((skill) => (
            <option key={skill} value={skill}>{skill}</option>
          ))}
        </select>
        <div className="filters">
          {filters.map((skill) => (
            <span key={skill} className="filter-tag">
              {skill} <button onClick={() => removeFilter(skill)} 
                className="remove-filter">✖</button>
            </span>
          ))}
        </div>
      </div>
      
      <div className="job-list">
        {jobs.map((job) => (
          <div key={job._id} className="job-card">
            <h2 className="job-title">{job.jobPosition}</h2>
            <p>{job.company} • {job.location}</p>
            <p className="job-details">{job.remote} • {job.type}</p>
            <div className="job-skills">
              {job.skills.map((skill) => (
                <span key={skill} className="skill-tag">{skill}</span>
              ))}
            </div>
            <button onClick={() => navigate(`/job/${job._id}`)} className="view-details">View Details</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;