import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { ScrollArea } from '../ui/scroll-area';
import axios from 'axios';
import config from "../../functions/config";
import { useNavigate } from "react-router-dom";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "../ui/sheet";
import { FaBuilding, FaLock } from "react-icons/fa";

const CompanyProfile = () => {
  const [openSheet, setOpenSheet] = useState(null);
  const [profile, setProfile] = useState({
    company_name: '',
    company_photo: null,
    id: null,
  });
  const [photo, setPhoto] = useState();
  const [changes, setChanges] = useState({});
  const token = sessionStorage.getItem("user_token");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleOpenSheet = (sheetName) => setOpenSheet(sheetName);
  const handleCloseSheet = () => setOpenSheet(null);

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

  const fetchProfile = async () => {
    try {
      if (token) {
        const response = await axios.get(`${config.base_url}/api/v1/app/manage-company-profile/`, {
          headers: {
            'Authorization': `Token ${token}`,
          }
        });
        const fetchedProfile = response.data;
        setProfile({ ...fetchedProfile, id: fetchedProfile.id });
        setPhoto(`${config.base_url}${fetchedProfile.company_photo}`);
      }
    } catch (error) {
      console.error('Error fetching company profile:', error);
    }
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    for (const key in changes) {
      formData.append(key, changes[key]);
    }
    setLoading(true);
    try {
      await axios.put(`${config.base_url}/api/v1/app/manage-company-profile/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Token ${token}`,
        },
      });
      alert("Company profile updated successfully!");
      setChanges({});
      handleCloseSheet();
      fetchProfile();
      // sessionStorage.setItem("Comprofile","updated")
      sessionStorage.setItem("Companyphoto",photo)
    } catch (error) {
      console.error("Error updating company profile:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (photo) {
      // setPhotos(`${config.base_url}${profile.photo}`);
      // console.log(`${config.base_url}${profile.photo}`); // Check the photo URL
      sessionStorage.setItem("Companyphoto",photo)
    }
  }, [profile]);

  useEffect(() => {
    fetchProfile();  // Only call fetchProfile once on component mount
  }, [token]);

  return (
    <div className="flex flex-wrap gap-4 justify-center">
      {/* Buttons to open each profile section */}
      <Button
        variant="outline"
        onClick={() => handleOpenSheet("companyInfo")}
        className="flex flex-col items-center justify-center w-96 h-80 font-bold text-lg md:w-96 md:h-64 sm:w-60 sm:h-52"
      >
        <FaBuilding style={{ fontSize: "3rem" }} className="text-[3rem] mb-2" />
        Company Info & Photo
      </Button>

      {/* Change Password Button */}
      <Button
        variant="outline"
        onClick={() => navigate('/company-password-change')}
        className="flex flex-col items-center justify-center w-96 h-80 font-bold text-lg md:w-96 md:h-64 sm:w-60 sm:h-52"
      >
        <FaLock style={{ fontSize: "3rem" }} className="text-[3rem] mb-2" />
        Change Password
      </Button>

      {/* Company Info Sheet */}
      <Sheet open={openSheet === "companyInfo"} onOpenChange={setOpenSheet}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Company Profile</SheetTitle>
            <SheetDescription>Update your company information and upload a company photo.</SheetDescription>
          </SheetHeader>
          <ScrollArea orientation="horizontal" className="h-[calc(100vh-150px)] overflow-y-auto">
            <div className="grid gap-4 py-4">
              <Label htmlFor="company_name" className="text-right">Company Name</Label>
              <Input
                id="company_name"
                type="text"
                name="company_name"
                value={profile.company_name}
                onChange={handleChange}
                placeholder="Enter your company name"
              />

              <Label htmlFor="company_photo" className="text-right">Company Photo</Label>
              <Input
                id="company_photo"
                type="file"
                accept="image/*"
                name="company_photo"
                onChange={handleFileChange}
              />
              {photo && (
                <img
                  src={photo}
                  alt="Company"
                  style={{ width: '100px', height: '100px', borderRadius: '5px' }}
                />
              )}
            </div>
            <Button onClick={handleSubmit} className="mt-4">
              Save Profile
            </Button>
          </ScrollArea>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default CompanyProfile;











