import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerFooter } from "../ui/Drawer";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "../ui/select";
import { ScrollArea } from "../ui/scroll-area";
import { Textarea } from "../ui/textarea";
import { BarLoader } from "react-spinners";
import config from "../../functions/config";
import MDEditor from "@uiw/react-md-editor";

const PostJob = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [salary, setSalary] = useState(50000.0);
  const [employmentType, setEmploymentType] = useState("");
  const [ugCgpaMin, setUgCgpaMin] = useState("");
  const [tenthPercentageMin, setTenthPercentageMin] = useState("");
  const [twelfthPercentageMin, setTwelfthPercentageMin] = useState("");
  const [companyPhoto, setCompanyPhoto] = useState(null);
  const [isOpen, setIsOpen] = useState(true);
  const [loading, setLoading] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState(null);
  const [additionalDetails, setAdditionalDetails] = useState(""); 
  const [photo, setPhoto] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false); // Drawer state for additional details
  const token = sessionStorage.getItem("user_token");
  const navigate = useNavigate();
  const [profile, setProfile] = useState({
    company_name: '',
    company_photo: null,
    id: null
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        if (token) {
          const response = await axios.get(`${config.base_url}/api/v1/app/manage-company-profile/`, {
            headers: {
              'Authorization': `Token ${token}`,
            }
          });

          const fetchedProfile = response.data;
          const profilePhotoUrl = `${config.base_url}${fetchedProfile.company_photo}`;
          setPhoto(profilePhotoUrl);
          setCompanyPhoto(profilePhotoUrl);
          setProfile({ ...fetchedProfile, id: fetchedProfile.id });
          console.log(fetchedProfile)
        }
      } catch (error) {
        console.error('Error fetching company profile:', error);
      }
    };

    fetchProfile();
  }, [token]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCompanyPhoto(file);
    }
  };

  const handleJobPost = async (e) => {
    e.preventDefault();
    setLoading(true);

    const jobData = new FormData();
    jobData.append("title", title);
    jobData.append("description", description);
    jobData.append("company", profile.company_name);
    jobData.append("location", location);
    jobData.append("salary", parseFloat(salary));
    jobData.append("employment_type", employmentType);
    jobData.append("ug_cgpa_min", parseFloat(ugCgpaMin));
    jobData.append("ug_cgpa_max", 10); // Default value for UG CGPA max
    jobData.append("tenth_percentage_min", parseFloat(tenthPercentageMin));
    jobData.append("tenth_percentage_max", 100); // Default value for 10th %
    jobData.append("twelfth_percentage_min", parseFloat(twelfthPercentageMin));
    jobData.append("twelfth_percentage_max", 100); // Default value for 12th %
    if (companyPhoto || profile.company_photo) {
      jobData.append("company_profile_photo", companyPhoto || profile.company_photo);
    }
    if (additionalDetails) jobData.append("additional_details", additionalDetails);

    try {
      const response = await axios.post(`${config.base_url}/api/v1/app/jobs/create/`, jobData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Token ${token}`,
        }
      });

      if (response.status === 201) {
        setSubmissionStatus("Job posted successfully.");
        localStorage.setItem('job_posted', new Date().toISOString());
        localStorage.setItem('show_notification', 'true');
        navigate('/recruiter');
      } else {
        setSubmissionStatus("Failed to post job. Please try again.");
      }
    } catch (error) {
      setSubmissionStatus(`Error: ${error.response?.data?.detail || "An error occurred."}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDrawerClose = (isDrawerOpen) => {
    setIsOpen(isDrawerOpen);
    if (!isDrawerOpen) navigate("/recruiter");
  };

  if (loading) {
    return <BarLoader className="mb-4" width={"100%"} color="#36d7b7" />;
  }

  return (
    <Drawer open={isOpen} onOpenChange={handleDrawerClose}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Post a Job</DrawerTitle>
        </DrawerHeader>
        
        <ScrollArea className="h-[calc(100vh-150px)] overflow-y-auto">
          <form onSubmit={handleJobPost} className="space-y-4 p-4">
            <Input placeholder="Job Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
            <Textarea placeholder="Job Description" value={description} onChange={(e) => setDescription(e.target.value)} required />
            <Input placeholder="Location (Enter City Name)" value={location} onChange={(e) => setLocation(e.target.value)} required />
            <Input type="number" placeholder="Salary" value={salary} onChange={(e) => setSalary(e.target.value)} required />
            <Input type="file" accept="image/*" onChange={handleFileChange} className="w-full p-2" />
            {/* {photo && (
              <img
                src={profile.company_photo}
                alt="Company"
                style={{ width: '100px', height: '100px', borderRadius: '5px' }}
              />
            )} */}
            <Select onValueChange={setEmploymentType} value={employmentType} required>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Employment Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Full Time">Full-time</SelectItem>
                <SelectItem value="Part Time">Part-time</SelectItem>
                <SelectItem value="Contract">Contract</SelectItem>
                <SelectItem value="Internship">Internship</SelectItem>
              </SelectContent>
            </Select>
<div className="space-y-4">
  <h2>Academic Requirements:</h2>
  <Input 
    type="number" 
    placeholder="UG CGPA (Ranges From 1 to 10)" 
    value={ugCgpaMin} 
    onChange={(e) => setUgCgpaMin(e.target.value)} 
    className="w-full"
  />
  <Input 
    type="number" 
    placeholder="10th % Min (Ranges From 10 to 100)" 
    value={tenthPercentageMin} 
    onChange={(e) => setTenthPercentageMin(e.target.value)} 
    min="0" 
    max="100" 
    className="w-full"
  />
  <Input 
    type="number" 
    placeholder="12th % Min (Ranges From 10 to 100)" 
    value={twelfthPercentageMin} 
    onChange={(e) => setTwelfthPercentageMin(e.target.value)} 
    min="0" 
    max="100" 
    className="w-full"
  />
</div>



            {submissionStatus && <p className="text-center text-red-500">{submissionStatus}</p>}

            <Button type="button" onClick={() => setIsModalOpen(true)} className="w-full">
              Additional Details
            </Button>

            {isModalOpen && (
              <Drawer open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DrawerContent>
                  <DrawerHeader>
                    <DrawerTitle>Additional Job Details</DrawerTitle>
                  </DrawerHeader>
                  <div className="p-4">
                    <MDEditor value={additionalDetails} onChange={setAdditionalDetails} />
                    <Button variant="outline" onClick={() => setIsModalOpen(false)} className="mt-4">Close</Button>
                  </div>
                </DrawerContent>
              </Drawer>
            )}

            <DrawerFooter>
              <Button type="submit" className="w-full">
                Post Job
              </Button>
              <Button variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
            </DrawerFooter>
          </form>
        </ScrollArea>
      </DrawerContent>
    </Drawer>
  );
};

export default PostJob;
