import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { RiDeleteBin6Line } from "react-icons/ri";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import { ScrollArea } from '../ui/scroll-area'
import axios from 'axios'
import config from "../../functions/config";
import { useNavigate } from "react-router-dom";
import { FaUser, FaTools, FaGraduationCap, FaSchool } from "react-icons/fa";
import PopOver from "./PopOver";

const UserProfile = () => {
  const [openSheet, setOpenSheet] = useState(null);
  const [skills, setSkills] = useState([""]);
  const navigate=useNavigate();
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');


  const handleOpenSheet = (sheetName) => setOpenSheet(sheetName);
  const handleCloseSheet = () => setOpenSheet(null);

  const [profile, setProfile] = useState({
    resume: null,
    skills: [],
    experience: '',
    education: '',
    ug_cgpa: '',
    tenth_percentage: '',
    twelfth_percentage: '',
    diploma: '',
    photo: null,
    username: '',
  });
  const [changes, setChanges] = useState({});
  const token = sessionStorage.getItem("user_token");
  const [loading, setLoading] = useState(false);
  const [photos,setPhotos]=useState(null);

  const fetchProfile = async () => {
    if (token) {
      try {
        const response = await axios.get(
          `${config.base_url}/api/v1/app/profile/`,
          {
            headers: {
              'Authorization': `Token ${token}`,
            },
          }
        );
        setProfile(response.data);
        console.log(profile)
        // setPhotos(`${config.base_url}${profile.photo}`);

        console.log(photos)
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    }
  };
  useEffect(() => {
    if (profile && profile.photo) {
      setPhotos(`${config.base_url}${profile.photo}`);
      console.log(`${config.base_url}${profile.photo}`); // Check the photo URL
      sessionStorage.setItem("Userphoto",`${config.base_url}${profile.photo}`)
    }
  }, [profile]);

  useEffect(() => {
    fetchProfile();
  }, [token]);  // Only run on component mount
  

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });
    setChanges({ ...changes, [name]: value });
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setProfile({ ...profile, [name]: files[0] });
    setChanges({ ...changes, [name]: files[0] });
  };

  const validateSkills = (skills) => {
    return skills.every(skill => skill.trim() !== ''); // Ensure all skills are non-empty after trimming
};

  const handleSkillChange = (index, e) => {
    if (profile.skills.length > 0 && profile.skills[profile.skills.length - 1].trim() === '') {
    }
    const updatedSkills = [...profile.skills];
    updatedSkills[index] = e.target.value;
    setProfile({ ...profile, skills: updatedSkills });
    setChanges({ ...changes, skills: updatedSkills });
  };

  const addSkill = () => {
    const updatedSkills = [...profile.skills, ''];
    setProfile({ ...profile, skills: updatedSkills });

    // Track changes in the skills field
    setChanges({
        ...changes,
        skills: updatedSkills
    });
  };

  const removeSkill = (index) => {
    const updatedSkills = profile.skills.filter((_, i) => i !== index);
    setProfile({ ...profile, skills: updatedSkills });
    setChanges({ ...changes, skills: updatedSkills });
  };

  const handleSubmit = async () => {
    // e.preventDefault();
    if (!validateSkills(profile.skills)) {
      setAlertOpen(true);
      setAlertMessage('Please remove empty skills or fill them out before submitting.');
      return; // Prevent submission if there are empty skills
  }

    const formData = new FormData();

    if (changes.skills) {
      formData.append('skills', JSON.stringify(changes.skills));
  }

    for (const key in changes) {
      // formData.append(key, changes[key]);
      if (key !== 'skills') {
        formData.append(key, changes[key]);
    }
  }
    setLoading(true);
    try {
      await axios.put(`${config.base_url}/api/v1/app/profile/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Token ${token}`,
        },
      });
      setAlertMessage("Profile updated successfully!");
      setAlertOpen(true);
      setChanges({});
      fetchProfile();
      sessionStorage.setItem("profile","updated")
    } catch (error) {
      console.error("Error updating profile:", error);
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="flex flex-wrap gap-4 justify-center  " >
    {/* <PopOver /> */}
      {/* Buttons to open each profile section */}
      
<Button
  variant="outline"
  onClick={() => handleOpenSheet("profileInfo")}
  className="flex flex-col items-center justify-center w-96 h-80 font-bold text-lg md:w-96 md:h-64 sm:w-60 sm:h-52"
>
  <FaUser className="text-6xl mb-2 " />
  Resume, Profile Photo, and Username
</Button>

<Button
  variant="outline"
  onClick={() => handleOpenSheet("skills")}
  className="flex flex-col items-center justify-center w-96 h-80 font-bold text-lg md:w-72 md:h-64 sm:w-60 sm:h-52"
>
  <FaTools className="text-4xl mb-2" />
  Skills
</Button>

<Button
  variant="outline"
  onClick={() => handleOpenSheet("experienceEducation")}
  className="flex flex-col items-center justify-center w-96 h-80 font-bold text-lg md:w-72 md:h-64 sm:w-60 sm:h-52"
>
  <FaGraduationCap className="text-4xl mb-2" />
  Experience and Education
</Button>

<Button
  variant="outline"
  onClick={() => handleOpenSheet("academicDetails")}
  className="flex flex-col items-center justify-center w-96 h-80 font-bold text-lg md:w-96 md:h-64 sm:w-60 sm:h-52"
>
  <FaSchool className="text-4xl mb-2" />
  UG CGPA, 10th %, 12th %, and Diploma
</Button>

      {/* Resume, Profile Photo, and Username Sheet */}
      <Sheet open={openSheet === "profileInfo"} onOpenChange={setOpenSheet}>
        <SheetTrigger asChild>
          {/* <Button variant="outline">Open Profile Info</Button> */}
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Profile Information</SheetTitle>
            <SheetDescription>Upload your resume and profile photo, and enter your username.</SheetDescription>
          </SheetHeader>
          <ScrollArea orientation="horizontal" className="h-[calc(100vh-150px)] overflow-y-auto">
          <div className="grid gap-4 py-4">
            <Label htmlFor="resume" className="text-right">Resume</Label>
            <Input id="resume" type="file" accept=".pdf,.docx" name="resume" onChange={handleFileChange} />
            {profile.resume && (
                <a href={`${config.base_url}${profile.resume}`} target="_blank" rel="noopener noreferrer">
                  View Resume
                </a>
              )}
            <Label htmlFor="profilePhoto" className="text-right">Profile Photo</Label>
            <Input id="profilePhoto" type="file" accept="image/*" name="photo" onChange={handleFileChange} />
            {profile.photo ? (
  <img 
    src={`${config.base_url}${profile.photo}`} 
    alt="Profile" 
    style={{ width: '100px', borderRadius: '5px' }} 
  />
) : (
  <p>No profile photo available.</p>
)}
            <Label htmlFor="username" className="text-right">Email</Label>
            <Input id="username" type="text" placeholder="Enter your Email" name="username" value={profile.username} onChange={handleChange}/>
            <Button type="button" onClick={() => navigate('/changepass')}>Change Password</Button>
          </div>
         
          <SheetFooter>
            <SheetClose asChild>
              <Button type="submit" onClick={handleSubmit}>Save changes</Button>
            </SheetClose>
          </SheetFooter>
           </ScrollArea>
        </SheetContent>
      </Sheet>

      {/* Skills Sheet */}
      <Sheet open={openSheet === "skills"} onOpenChange={handleCloseSheet}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Skills</SheetTitle>
            <SheetDescription>Manage your skills below.</SheetDescription>
          </SheetHeader>
          <ScrollArea orientation="horizontal" className="h-[calc(100vh-150px)] overflow-y-auto">
          <div>
            <h3>Skills</h3>
            
            {profile.skills.length > 0 ? (
              profile.skills.map((skill, index) => (

                <div 
  key={index} 
  className="relative flex items-center   rounded-md p-2 mb-2 shadow-sm"
>
  <Input
    type="text"
    value={skill}
    onChange={(e) => handleSkillChange(index, e)}
    className="flex-1 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md"
  />
  <button
    type="button"
    onClick={() => removeSkill(index)}
    className="absolute right-3 text-gray-500 hover:text-red-500 focus:outline-none"
  >
    <RiDeleteBin6Line />
  </button>
  
</div>




              ))
            ) : (
              <p>No skills added yet. Click '+ Add Skill' to start adding skills.</p>
            )}
            <br />
            <Button onClick={addSkill}>+ Add Skill</Button><br/><br/>
            
          </div>
          <SheetClose asChild>
            <Button type="button" onClick={handleSubmit}>Save changes</Button>
          </SheetClose>
          </ScrollArea>
        </SheetContent>
      
      </Sheet>

      {/* Experience and Education Sheet */}
      <Sheet open={openSheet === "experienceEducation"} onOpenChange={setOpenSheet}>
        <SheetTrigger asChild>
          {/* <Button variant="outline">Open Experience & Education</Button> */}
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Experience and Education</SheetTitle>
            <SheetDescription>Provide your experience and education details.</SheetDescription>
          </SheetHeader>
          <div className="grid gap-4 py-4">
            <Label htmlFor="experience" className="text-right">Experience</Label>
            <Input id="experience" type="text" placeholder="Add your experience" name="experience" value={profile.experience} onChange={handleChange}/>
            <Label htmlFor="education" className="text-right">Education</Label>
            <Input id="education" type="text" placeholder="Add your education details" name="education" value={profile.education} onChange={handleChange} />
          </div>
          <SheetFooter>
            <SheetClose asChild>
              <Button type="submit" onClick={handleSubmit}>Save changes</Button>
            </SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      {/* UG CGPA, 10th %, 12th %, and Diploma Sheet */}
      <Sheet open={openSheet === "academicDetails"} onOpenChange={setOpenSheet}>
        <SheetTrigger asChild>
          {/* <Button variant="outline">Open Academic Details</Button> */}
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Academic Details</SheetTitle>
            <SheetDescription>Enter your academic performance details here.</SheetDescription>
          </SheetHeader>
          <div className="grid gap-4 py-4">
            <Label htmlFor="ugCgpa" className="text-right">UG CGPA</Label>
            <Input id="ugCgpa" type="text" placeholder="Enter UG CGPA" name="ug_cgpa" value={profile.ug_cgpa} onChange={handleChange}/>
            <Label htmlFor="tenthPercentage" className="text-right">10th %</Label>
            <Input id="tenthPercentage" type="text" placeholder="Enter 10th grade percentage" name="tenth_percentage" value={profile.tenth_percentage} onChange={handleChange}/>
            <Label htmlFor="twelfthPercentage" className="text-right">12th %</Label>
            <Input id="twelfthPercentage" type="text" placeholder="Enter 12th grade percentage" name="twelfth_percentage" value={profile.twelfth_percentage} onChange={handleChange} />
            <Label htmlFor="diploma" className="text-right">Diploma (optional)</Label>
            <Input id="diploma" type="text" placeholder="Enter diploma details" name="diploma" value={profile.diploma} onChange={handleChange}/>
          </div>
          <SheetFooter>
            <SheetClose asChild>
              <Button type="submit" onClick={handleSubmit}>Save changes</Button>
            </SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>
      <AlertDialog open={alertOpen} onOpenChange={setAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Notification</AlertDialogTitle>
            <AlertDialogDescription>{alertMessage}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel asChild>
              <Button variant="outline">Close</Button>
            </AlertDialogCancel>
            <AlertDialogAction asChild>
              <Button onClick={() => setAlertOpen(false)}>Got it</Button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default UserProfile;