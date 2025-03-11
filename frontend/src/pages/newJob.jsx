import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import "./newJob.css";

export default function NewJob() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        company: '',
        logoURL: 'https://img.freepik.com/free-vector/join-us-businessman-icon_1020-295.jpg?t=st=1741694048~exp=1741697648~hmac=ef605c88fde8125f18f4175785720dc40b6d727c8d60cb8727cb945d0729ee17&w=900',
        jobPosition: '',
        salary: '',
        location: '',
        description: '',
        aboutCompany: '',
        skills: '',
        additionalInfo: '',
        remote: 'Remote',
        type: 'Full-time'
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        setError("");

        // Retrieve the token from localStorage
        const token = localStorage.getItem('token');
        console.log('Token:', token); // Add this line to check if the token is retrieved correctly

        try {
            const url = id ? `${import.meta.env.VITE_API_URL}/jobs/${id}` : `${import.meta.env.VITE_API_URL}/jobs`;
            const skills = typeof formData.skills === 'string' ? formData.skills.split(',').map(skill => skill.trim()) : formData.skills;
            const res = await fetch(url, {
                method: id ? "PUT" : "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token ? `Bearer ${token}` : '' // Ensure the token is included correctly
                },
                body: JSON.stringify({ ...formData, skills }),
            });
            console.log(res);
            if (res.status === 200) {
                alert(`Job ${id ? 'updated' : 'created'} successfully`);
                navigate('/jobs'); // Navigate to jobs page after successful submission
            } else {
                const data = await res.json();
                setError(data.message || `Job ${id ? 'updating' : 'creation'} failed`);
            }
        } catch (error) {
            alert(error.message);
            console.log(error);
            setError(`Job ${id ? 'updating' : 'creation'} failed`);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (id) {
            fetch(`${import.meta.env.VITE_API_URL}/jobs/${id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `${localStorage.getItem('token')}`
                },
            })
                .then(res => res.json())
                .then(data => {
                    setFormData(f => ({
                        ...f,
                        company: data.company,
                        logoURL: data.logoURL,
                        jobPosition: data.jobPosition,
                        salary: data.salary,
                        location: data.location,
                        description: data.description,
                        aboutCompany: data.aboutCompany,
                        skills: Array.isArray(data.skills) ? data.skills.join(', ') : data.skills,
                        additionalInfo: data.additionalInfo,
                        remote: data.remote,
                        type: data.type,
                    }));
                })
                .catch(error => console.log(error));
        }
    }, [id]);

    return (
        <div className="container">
            <div className="form-container">
                <h1 className="title">Add Job Description</h1>
                <form id="jobForm" className="form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="label" htmlFor="companyName">Company Name</label>
                        <input 
                            type="text" 
                            id="companyName" 
                            className="input"
                            placeholder="Enter your company name here" 
                            value={formData.company} 
                            onChange={(e) => setFormData({ ...formData, company: e.target.value })} 
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="label" htmlFor="logoURL">Add Logo URL</label>
                        <input 
                            type="url" 
                            id="logoURL" 
                            className="input"
                            placeholder="Enter the link"
                            value={formData.logoURL}
                            onChange={(e)=> setFormData({ ...formData, logoURL: e.target.value })}
                        />
                    </div>

                    <div className="form-group">
                        <label className="label" htmlFor="jobPosition">Job Position</label>
                        <input 
                            type="text" 
                            id="jobPosition" 
                            className="input"
                            placeholder="Enter job position" 
                            value={formData.jobPosition} 
                            onChange={(e) => setFormData({ ...formData, jobPosition: e.target.value })}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="label" htmlFor="salary">Monthly Salary</label>
                        <input 
                            type="number" 
                            id="salary" 
                            className="input"
                            placeholder="Enter Amount in rupees" 
                            value={formData.salary} 
                            onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="label" htmlFor="jobType">Job Type</label>
                        <select 
                            id="jobType"
                            className="select"
                            value={formData.type}
                            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                        >
                            <option value="Full Time">Full Time</option>
                            <option value="Part Time">Part Time</option>
                            <option value="Internship">Internship</option>
                            <option value="Contract">Contract</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label className="label" htmlFor="remoteOffice">Remote/Office</label>
                        <select 
                            id="remoteOffice"
                            className="select"
                            value={formData.remote}
                            onChange={(e) => setFormData({ ...formData, remote: e.target.value })}
                        >
                            <option value="Remote">Remote</option>
                            <option value="Office">Office</option>
                            <option value="Hybrid">Hybrid</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label className="label" htmlFor="location">Location</label>
                        <input 
                            type="text" 
                            id="location" 
                            className="input"
                            placeholder="Enter Location"
                            value={formData.location}
                            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        />
                    </div>

                    <div className="form-group">
                        <label className="label" htmlFor="jobDescription">Job Description</label>
                        <textarea 
                            id="jobDescription" 
                            className="textarea"
                            placeholder="Type the job description"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        ></textarea>
                    </div>

                    <div className="form-group">
                        <label className="label" htmlFor="aboutCompany">About Company</label>
                        <textarea 
                            id="aboutCompany" 
                            className="textarea"
                            placeholder="Type about your company"
                            value={formData.aboutCompany}
                            onChange={(e) => setFormData({ ...formData, aboutCompany: e.target.value })}
                        ></textarea>
                    </div>

                    <div className="form-group">
                        <label className="label" htmlFor="skills">Skills Required</label>
                        <input 
                            type="text"     
                            id="skills" 
                            className="input"
                            placeholder="Enter the must-have skills (comma separated)"
                            value={formData.skills}
                            onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                        />
                    </div>

                    <div className="form-group">
                        <label className="label" htmlFor="additionalInfo">Information</label>
                        <input 
                            id="additionalInfo" 
                            className="input"
                            placeholder="Enter additional information"
                            value={formData.additionalInfo}
                            onChange={(e) => setFormData({ ...formData, additionalInfo: e.target.value })}
                        />
                    </div>

                    <div className="buttons">
                        <button type="button" className="cancel" onClick={() => navigate('/jobs')}>Cancel</button>
                        <button type="submit" className="submit">+ Add Job</button>
                    </div>
                    {loading && <p style= {{ color: 'blue'}}>Loading...</p> }
                    {error && <p style={{ color: 'red' }}>{error}</p>}
                </form>
            </div>
            <div className="image-container">
                <h2 className="title">Recruiter add job details here</h2>
            </div>
        </div>
    );
}