import { useState, useEffect } from "react";
import { BarLoader } from "react-spinners";
import MDEditor from "@uiw/react-md-editor";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Briefcase, DoorClosed, DoorOpen, IndianRupee, MapPinIcon } from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import config from "../../functions/config"; // Import your config file
import { Button } from "../ui/button";
import { Tooltip, TooltipProvider } from "../ui/tooltip";

const JobPage = () => {
  const { id } = useParams(); // Job ID from URL
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [profile, setProfile] = useState(null);
  const [username, setUsername] = useState("");
  const [photo, setPhoto] = useState("");
  const navigate = useNavigate();
  const token = sessionStorage.getItem("user_token");
  const user=sessionStorage.getItem("user_type")
  const [eligible,setEligible]=useState(false)
    // console.log(user)
  useEffect(() => {
    // Fetch user profile
    const fetchProfile = async () => {
      if (token) {
        try {
          const profileResponse = await axios.get(
            `${config.base_url}/api/v1/app/profile/`,
            {
              headers: { Authorization: `Token ${token}` },
            }
          );
          const data = profileResponse.data;
          setProfile(data);
          setUsername(data.first_name);
          setPhoto(`${config.base_url}${data.photo}`);
        } catch (error) {
          console.error("Error fetching profile:", error);
        }
      }
    };
    fetchProfile();
  }, [token]);

  useEffect(() => {
    // Fetch job details
    const fetchJobDetails = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${config.base_url}/api/v1/app/user/jobs/${id}/`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
          },
        });
        setJob(response.data);
        console.log(job)
      } catch (err) {
        setError("Error fetching job details");
      } finally {
        setLoading(false);
      }
    };
    fetchJobDetails();
  }, [id, token]);

  const handleStatusChange = async (value) => {
    const isOpen = value === "open";
    try {
      await axios.patch(`${config.base_url}/api/v1/app/user/jobs/${id}/`, { isOpen }, {
        headers: { Authorization: `Token ${token}` },
      });
      setJob((prevJob) => ({ ...prevJob, isOpen }));
    } catch (error) {
      console.error("Failed to update hiring status:", error);
    }
  };

  const handleApplyClick = async () => {
    if (!token) {
      navigate("/login");
      return;
    }

    if (!profile) {
      alert("Profile data is not available.");
      return;
    }

    try {
      const jobData = job;

      const {
        ug_cgpa_min,
        ug_cgpa_max,
        tenth_percentage_min,
        tenth_percentage_max,
        twelfth_percentage_min,
        twelfth_percentage_max,
      } = jobData;

      const userUGCGPA = parseFloat(profile.ug_cgpa);
      const userTenthPercentage = parseFloat(profile.tenth_percentage);
      const userTwelfthPercentage = parseFloat(profile.twelfth_percentage);

      if (
        !(userUGCGPA >= ug_cgpa_min && userUGCGPA <= ug_cgpa_max) ||
        !(userTenthPercentage >= tenth_percentage_min &&
          userTenthPercentage <= tenth_percentage_max) ||
        !(userTwelfthPercentage >= twelfth_percentage_min &&
          userTwelfthPercentage <= twelfth_percentage_max)
      ) {
        // setEligible(true);
        alert("Your academic qualifications do not meet the eligibility criteria for this job.");
        return;
      }

      navigate(`/application-form/${id}`);
    } catch (error) {
      console.error("Error validating qualifications:", error);
      alert("Error validating qualifications. Please try again.");
    }
  };

  useEffect(() => {
    // Fetch job details
    const fetchJobDetails = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${config.base_url}/api/v1/app/user/jobs/${id}/`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
          },
        });
        setJob(response.data);
        
        // Check eligibility right after fetching job details
        if (profile) {
          const {
            ug_cgpa_min,
            ug_cgpa_max,
            tenth_percentage_min,
            tenth_percentage_max,
            twelfth_percentage_min,
            twelfth_percentage_max,
          } = response.data;
  
          const userUGCGPA = parseFloat(profile.ug_cgpa);
          const userTenthPercentage = parseFloat(profile.tenth_percentage);
          const userTwelfthPercentage = parseFloat(profile.twelfth_percentage);
  
          if (
            !(userUGCGPA >= ug_cgpa_min && userUGCGPA <= ug_cgpa_max) ||
            !(userTenthPercentage >= tenth_percentage_min &&
              userTenthPercentage <= tenth_percentage_max) ||
            !(userTwelfthPercentage >= twelfth_percentage_min &&
              userTwelfthPercentage <= twelfth_percentage_max)
          ) {
            setEligible(true);
          } else {
            // setEligible(false);
            // alert("Your academic qualifications do not meet the eligibility criteria for this job.");
          }
        }
        
      } catch (err) {
        setError("Error fetching job details");
      } finally {
        setLoading(false);
      }
    };
    fetchJobDetails();
  }, [id, token, profile]); // Include profile in dependencies to check eligibility when it updates
  
  


  if (loading) return <BarLoader width={"100%"} color="#36d7b7" />;

  return (
    <div className="flex flex-col gap-8 mt-5">
      <div className="flex flex-col-reverse gap-6 md:flex-row justify-between items-center">
        <h1 className="gradient-title font-extrabold pb-3 text-4xl sm:text-6xl">
          {job?.title.toUpperCase()}
        </h1>
        <img src={`${config.base_url}${job.company_profile_photo}`} className="h-12" alt={job?.title} />
      </div>

      <div className="flex justify-between">
        <div className="flex gap-2">
          <MapPinIcon /> {job?.location}
        </div>
        <div className="flex gap-2">
          <Briefcase /> 
          {/* {job?.applications?.length} */}
           {/* Applicants */}
           {job.employment_type}
        </div>
        <div className="flex gap-2 text-yellow-200">
          {/* {job?.isOpen ? (
            <>
              <DoorOpen /> Open
            </>
          ) : (
            <>
              <DoorClosed /> Closed
            </>
          )} */}
          <IndianRupee />
          {job.salary}
        </div>
      </div>


      <h2 className="text-2xl sm:text-3xl font-bold">About the job</h2>
      <p className="sm:text-lg">{job?.description}</p>

      <h2 className="text-2xl sm:text-3xl font-bold">What we are looking for</h2>
      <MDEditor.Markdown source={job?.additional_details} className="bg-transparent sm:text-lg" />
      {/* <TooltipProvider> */}
        {user!=="company" ? 
        <div className="flex justify-center mt-4">
        <Button
          type="submit"
          variant="outline"
          size="xl"
          className="flex gap-6 justify-center bg-white text-black "
          disabled={eligible}
          onClick={handleApplyClick}
        >
          Apply Now
        </Button>
      </div>
      
      //       <Button variant="blue" size="xl" className="flex gap-6 justify-center w-10" disabled={eligible}  onClick={handleApplyClick}>
      // Apply Now
      //   </Button>
        :""}

      {job?.applications?.length > 0 && job?.recruiter_id === profile?.id && (
        <div className="flex flex-col gap-2">
          <h2 className="font-bold mb-4 text-xl ml-1">Applications</h2>
          {job?.applications.map((application) => (
            <div key={application.id}>{/* Render each application here */}</div>
          ))}
        </div>
      )}
    </div>
  );
};

export default JobPage;