import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom"; // Import useNavigate
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerFooter } from "../ui/Drawer";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { ScrollArea } from "../ui/scroll-area"; 
import { Textarea } from "../ui/textarea"; 
import { BarLoader } from "react-spinners";
import config from "../../functions/config";

const ApplicationForm = () => {
  const { id } = useParams();
  const navigate = useNavigate(); // Initialize useNavigate
  const [profile, setProfile] = useState({
    resume: null,
    skills: [],
    experience: "",
    education: "",
  });
  const [resume, setResume] = useState(null);
  const [coverLetter, setCoverLetter] = useState("");
  const [submissionStatus, setSubmissionStatus] = useState(null);
  const [isOpen, setIsOpen] = useState(true);
  const [loading, setLoading] = useState(false);
  const token = sessionStorage.getItem("user_token");

  useEffect(() => {
    const fetchProfile = async () => {
      if (token) {
        try {
          const profileResponse = await axios.get(
            `${config.base_url}/api/v1/app/profile/`,
            { headers: { "Authorization": `Token ${token}` } }
          );
          setProfile({
            ...profileResponse.data,
            skills: Array.isArray(profileResponse.data.skills)
              ? profileResponse.data.skills.join(", ")
              : profileResponse.data.skills,
          });
        } catch (error) {
          console.error("Error fetching profile:", error);
        }
      }
    };
    fetchProfile();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData();
    formData.append("job", parseInt(id));
    formData.append("resume", resume);
    formData.append("cover_letter", coverLetter);
    formData.append("skills", profile.skills);
    formData.append("experience", profile.experience);
    formData.append("education", profile.education);

    try {
      await axios.post(
        `${config.base_url}/api/v1/app/applications/`,
        formData,
        { headers: { "Authorization": `Token ${token}` } }
      );
      setSubmissionStatus("Application submitted successfully!");
      setIsOpen(false);
      alert("Application Submitted successfully!");
      navigate("/applied-jobs")
    } catch (error) {
      console.error("Error submitting application:", error);
      setSubmissionStatus("Error submitting application. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDrawerClose = (isDrawerOpen) => {
    setIsOpen(isDrawerOpen);
    if (!isDrawerOpen) navigate(`/job/${id}`); // Navigate to /candidate if the drawer is closed
  };

  if (loading) {
    return <BarLoader className="mb-4" width={"100%"} color="#36d7b7" />;
  }

  return (
    <Drawer open={isOpen} onOpenChange={handleDrawerClose}>
      <DrawerContent className="h-full overflow-hidden">
        <DrawerHeader>
          <DrawerTitle>Application Form</DrawerTitle>
        </DrawerHeader>
        
        <ScrollArea className="h-[calc(100vh-150px)] overflow-y-auto">
          <form className="flex flex-col p-4 space-y-4" onSubmit={handleSubmit}>
            <label htmlFor="resume">Resume</label>
            <Input type="file" id="resume" onChange={(e) => setResume(e.target.files[0])} required />
            {profile.resume && (
              <a href={`${config.base_url}${profile.resume}`} target="_blank" rel="noopener noreferrer">
                View Resume
              </a>
            )}
            
            <label htmlFor="coverLetter">Cover Letter</label>
            <Textarea
              id="coverLetter"
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              placeholder="Cover Letter"
            />
            
            <label htmlFor="skills">Skills</label>
            <Textarea
              id="skills"
              value={profile.skills}
              onChange={(e) => setProfile({ ...profile, skills: e.target.value })}
              placeholder="Skills"
            />
            
            <label htmlFor="experience">Experience</label>
            <Textarea
              id="experience"
              value={profile.experience}
              onChange={(e) => setProfile({ ...profile, experience: e.target.value })}
              placeholder="Experience"
            />

            <label htmlFor="education">Education</label>
            <Textarea
              id="education"
              value={profile.education}
              onChange={(e) => setProfile({ ...profile, education: e.target.value })}
              placeholder="Education"
            />
            
            <Button type="submit" className="mt-4">
              Apply
            </Button>
          </form>
        </ScrollArea>
        
        <DrawerFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default ApplicationForm;
