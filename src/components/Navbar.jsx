import { Menu, LibraryBig, LogOutIcon } from "lucide-react";
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "./ui/button";

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
  SheetTrigger
} from "@/components/ui/sheet";
import { useDispatch, useSelector } from "react-redux";
import { BASE_URL } from "@/util/url";
import { toast } from "sonner";
import { userLoggedOut } from "@/store/userSlice";
import axios from "axios";

const Navbar = () => {
  const user = useSelector((state)=>state.user)
  const dispatch=useDispatch()
  const navigate=useNavigate()
  const HandleLogout=async()=>{
    try {
      const response=await axios.get(`${BASE_URL}/user/logout`,{withCredentials:true})
      dispatch(userLoggedOut())
      navigate('/auth')
      toast.success(response.data.message)
    } catch (error) {
      toast.error(error.message)
      console.log(error)
    }
  }

  return (
    <div className="h-16 p-4 dark:bg-[#0A0A0A] bg-white border-b dark:border-b-gray-800 border-b-gray-200 fixed top-0 left-0 right-0 duration-300 z-50 w-full">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
   
        <Link to="/" className="flex items-center gap-2">
          <LibraryBig size={28} />
          <h1 className="font-extrabold text-xl md:text-2xl">Pdf to XML</h1>
        </Link>

       
        <div className="hidden md:flex items-center gap-8">
         <UserMenu HandleLogout={HandleLogout} /> 
      
        </div>

  
        <div className="flex md:hidden items-center gap-2">
         
          <MobileMenu user={user} HandleLogout={HandleLogout} />
        </div>
      </div>
    </div>
  );
};

const UserMenu = ({HandleLogout}) => (
  <DropdownMenu>
    <DropdownMenuTrigger>
      <Avatar>
        <AvatarImage src="https://github.com/shadcn.png" alt="User avatar" />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
    </DropdownMenuTrigger>
    <DropdownMenuContent>
      <Link to="/my-learning">
        <DropdownMenuLabel>My Conversions</DropdownMenuLabel>
      </Link>
      
      <DropdownMenuItem onClick={HandleLogout} className='flex items-center text-red-600'>
        <LogOutIcon color="red" size={12} className="mr-2" />
        Log Out
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
);

const AuthButtons = () => (
  <div className="flex items-center gap-3">
    <Link to="/auth">
    <Button variant="outline">Login</Button>
    </Link>
 <Link to="/auth">
 <Button>Sign Up</Button>
 </Link>
   
  </div>
);

const MobileMenu = ({ user ,HandleLogout}) => (
  <Sheet>
    <SheetTrigger asChild>
      <Button size="icon" className="rounded-full" variant="outline">
        <Menu />
      </Button>
    </SheetTrigger>
    <SheetContent side="right">
      <SheetHeader className="mb-2">
        <SheetTitle>PDF to XML</SheetTitle>
      </SheetHeader>
      <div className="flex flex-col gap-6 mx-10">
        {user&& (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
            <Avatar>
  <AvatarFallback>
    {user?.name?.charAt(0).toUpperCase()}
  </AvatarFallback>
</Avatar>

              <span className="font-medium">{user.name}</span>
            </div>
            <nav className="flex flex-col space-y-2">
              <Link to="/my-learning" className="py-2 px-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors">My Conversions</Link>
        
              <button onClick={HandleLogout} className="text-left py-2 px-3 flex items-center gap-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors text-red-500">
                <LogOutIcon size={14}/> 
                Log Out
              </button>
            </nav>
          </div>
        ) }
      </div>
      <SheetFooter className="mt-auto">
        <SheetClose asChild>
          <Button variant="outline" className="w-full">Close Menu</Button>
        </SheetClose>
      </SheetFooter>
    </SheetContent>
  </Sheet>
);

export default Navbar;
