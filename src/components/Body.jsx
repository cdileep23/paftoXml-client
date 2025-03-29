import React, { useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import Navbar from "@/components/Navbar";



import axios from "axios";
import { useDispatch, useSelector } from "react-redux";

import { BASE_URL } from "@/util/url";
import { userLoggedIn } from "@/store/userSlice";

const Body = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const user = useSelector((store) => store.user);
  const isAuthRoute = location.pathname.includes("/auth");

  const fetchUser = async () => {
    if (user) return;
    try {
      const response = await axios.get(`${BASE_URL}/user/profile`, {
        withCredentials: true,
      });
      dispatch(userLoggedIn(response.data.user));
    } catch (error) {
      if (error.response?.status === 401) {
        navigate("/auth");
      }
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      {!isAuthRoute && <Navbar />}
      <main className={isAuthRoute ? "" : "pt-16 flex-grow"}>
        <div className="container mx-auto px-4">
          <Outlet />
        </div>
      </main>
      
    </div>
  );
};

export default Body;
