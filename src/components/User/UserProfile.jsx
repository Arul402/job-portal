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
// import '../../assets/degree.png'
import { ScrollArea } from '../ui/scroll-area'
import axios from 'axios'
import config from "../../functions/config";
import { useNavigate } from "react-router-dom";
import { FaUser, FaTools, FaGraduationCap, FaSchool, FaLock } from "react-icons/fa";
import PopOver from "./PopOver";
import degreeImage from '../../assets/degree.png';
import SchoolImage from '../../assets/school.png'
import ToolsImage from '../../assets/skills.png'
import LockImage from '../../assets/lock.png'
import PersonImage from '../../assets/person.png'

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
      
{/* <Button
  variant="outline"
  onClick={() => handleOpenSheet("profileInfo")}
  className="flex flex-col items-center justify-center w-96 h-80 font-bold text-lg md:w-96 md:h-64 sm:w-60 sm:h-52"
>
  <FaUser className="text-9xl mb-2 " />
  Resume, Profile Photo, and Username
</Button> */}

<Button
  variant="outline"
  onClick={() => handleOpenSheet("profileInfo")}
  className="flex flex-col items-center justify-center w-96 h-80 font-bold text-lg md:w-96 md:h-64 sm:w-60 sm:h-52"
  
>
  {/* <FaUser 
  // className="text-10xl mb-4"
className="iconbuttons"
   />   */}
   <img src={PersonImage} className="w-24 h-24 rounded-full" />
   {/* <img src="data:image/png;base64,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" className="w-20 h-20"/> */}
  <span className="text-lg">Profile Info</span>  {/* Text kept as is */}
</Button>


<Button
  variant="outline"
  onClick={() => handleOpenSheet("skills")}
  className="flex flex-col items-center justify-center w-96 h-80 font-bold text-lg md:w-72 md:h-64 sm:w-60 sm:h-52"
>
  {/* <FaTools className="text-4xl mb-2" /> */}
  <img src={ToolsImage} className="w-24 h-24 rounded-full" />
  {/* <img src="data:image/png;base64,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" className="w-20 h-20"/> */}
  Skills
</Button>

<Button
  variant="outline"
  onClick={() => handleOpenSheet("experienceEducation")}
  className="flex flex-col items-center justify-center w-96 h-80 font-bold text-lg md:w-72 md:h-64 sm:w-60 sm:h-52"
>
  {/* <FaGraduationCap className="text-4xl mb-2" /> */}
  {/* <img src="data:image/png;base64,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" className="w-20 h-20" /> */}
  <img src={degreeImage} className="w-24 h-24 rounded-full" />
  Experience and Education
</Button>

<Button
  variant="outline"
  onClick={() => handleOpenSheet("academicDetails")}
  className="flex flex-col items-center justify-center w-96 h-80 font-bold text-lg md:w-96 md:h-64 sm:w-60 sm:h-52"
>
  {/* <FaSchool className="text-6xl mb-2 " /> */}
  <img src={SchoolImage} className="w-24 h-24 rounded-full" />
  {/* <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSIBI7e0Yli45YlQ7IpUxG54vP6NaXxWx99eQ&s" className="w-20 h-20"/> */}
  Academic Details
</Button>

<Button
        variant="outline"
        onClick={() => navigate('/changepass')}
        className="flex flex-col items-center justify-center w-96 h-80 font-bold text-lg md:w-96 md:h-64 sm:w-60 sm:h-52"
      >
        {/* <FaLock style={{ fontSize: "3rem" }} className="text-[3rem] mb-2" /> */}
        <img src={LockImage} className="w-24 h-24 rounded-full" />
        {/* <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAbFBMVEX///8BAQEAAAClpaWFhYWioqLh4eEtLS38/PwFBQXo6Og2Njbc3NwTExOZmZnMzMwkJCRbW1uwsLDs7OyNjY3GxsZ4eHhycnIeHh5OTk6+vr45OTlhYWF9fX309PSrq6vT09NSUlJCQkJpaWnSAD1uAAAFJ0lEQVR4nO2d63aqMBCFYbgFkAreai9a2/P+73iSoJVEKKCmCXZ/P3BVSFd29zBJSEo8DwAAAAAAAAAAAAAAAAAAAAAAAAAnmPLR9/UEYUIE4+jfy6/Y9CU2VMwWwYnF7HiSPYiLXjZb5UlBZ4okX82yh5AnWG+SWpd/ov4x2axtV+1GpEHxkyrOV2U+xd9XTg9RbfbM7Uu5QC7x8iDOJM/Mm6xEjwn//DRtMbCGnxI+TlWfd9gKfSJAOzwUZ4TG7cF2Va9jIw30/bZ78Pte5D4KGze2KzuGY9uevbSmlw6h9JI1CzsOEw35PKeu/NKacyifiw7AFATKPpr3yvPkYAdlziF69dg0ujiiigv6Mb+05xxaeJMROO+6BalxbLkZ594kJHYK5HGbSr/SugnpkDgB9m/UFodcVyo0nj5bLqG3ve3KD6LqaiUaY4uuKyrblR/CU0eSISqr9+dwFT6/VyW12syPT7ar309c0EU+kbbt1rPvi2brnWblsQwVscW69yOa+q3sqSn5hUt5CS4uDl5kr05pN/m1W9efbCzqvvZ5fCQ6phTsW55E7QNhYqqMrbjEhZV6D2afy7604gq9d0Ve/E6kXe1T7nY+jWSjp9hCodfW45S9Vy8Uvbuz4bJsZKXmg+A1LslvekgngZ0FwvqPcfbQp9Lljs1HMz2m8h5b9RRZyXu1EapEH79S16tgVSPmRNclpV1voR2JCxvFqHLXwiU1O5xCYPLzY215LhESm80LLX+xzuNYqd0Zn4pD7y3FvEOhF+uLbHtUSu7nkRf2PbaXp0O9mLO903l6TjT1mHbYDcWO4+VznB7MVvRqXslvhhvxbvQQiYx31psdcf7xaryu17FSR0VUzPrLSGaFWtDZG3Grefg2uKQyZubtxdZgLW+h2TsRUod3vyJ1SExksJa3oAUpDR/qxXpRg7W8GuZl6iNgSkco1KanKDNY0+tZa0Z8Dh8G7T81D92cOl1oPoyZbdloZd0cBgeah+GIsqHm4eVDDxfQE+L1Csek4d8kUkb2oxVSM0pdVQgPu4GHbvAXFCJKu4GHbvAXPHx8hYjSbuChG/wFDx9fIaK0G3joBo/roZx9WcaZrnCzjIey3OgKs1hMk7qxolb8S0xYfSV5qT0RLPJkKHmhlS3z5KsKXfinGjFNzXbty/FoDGrJU9kdc2GF1OyrXk2R6gsq69n5n1cGHyeblLL+saxYyfE1dILOGMzbl7xaUsvFwu4RCnX3T+tPqLxcL/bLClmlTVErwTaUziuJKrvZhonpmAEuXX8QkzQ2JTIvH27UdVBuN0zFDLxRD0esBjDDx0UbcXcPLS9zC0wL5BLtzrQFJgP0eLCvEB7CQ/c9fHyFiFJ4CA+h0LxCRCk8hIdQaF4hohQewkMoNK8QUQoP4SEUmleIKIWH8BAKzStElMJDeAiF5hUiSuEhPIRC8woRpfAQHkKheYWIUngID6HQvEJEKTyEh1BoXiGiFB7CQyg0rxBRCg/hIRSaV4gohYfw0K7CaOQ2h+OxvbNOQK1bxN3xkFqPUtNhavvN14+faRbd7265h3/SQ7vvZ2elSDWmso341VRafovSP7krtZl0k8pdrf/ZFSi2fPhh3+2bTUxtbwTB6vYi7dw9/ZaDfL+WyDOWXxQl9oYz1Ozzv1u9Y5RtIpIa7xqs0j5y5v2J8ed21NvnhrL9dGdT0iwKonsTRM5sNmPuvX8OvFGwxtCO6NPYaB0AAAAAAAAAAAAAAAAAAAAAAAC4I/8B24pSd1uXuxoAAAAASUVORK5CYII=" className="w-20 h-20"/> */}
        Change Password
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
            {/* <Button type="button" onClick={() => navigate('/changepass')}>Change Password</Button> */}
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
