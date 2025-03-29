import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import axios from "axios";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { BASE_URL } from "@/util/url";
import { userLoggedIn } from "@/store/userSlice";

const Login = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [isLoading, setLoading] = useState(false)
  const [tabValue, setTabValue] = useState('signup')
  const [loginInput, setLoginInput] = useState({ email: "", password: "" });
  const [signupInput, setSignUpInput] = useState({
    name: "",
    email: "",
    password: "",
  });
  const changeInputHandler = (e, type) => {
    const { name, value } = e.target;

    if (type === "signup") {
      setSignUpInput((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    
    } else {
      setLoginInput((prevState) => ({
        ...prevState,
        [name]: value,
      }));
   
    }
  };
  const HandleRegistration = async(type) => {
    const inputData = type === "signup" ? signupInput : loginInput;
    if(type === "signup"){
      try {
        setLoading(true)
        const res = await axios.post(`${BASE_URL}/user/register`, {...inputData}, {withCredentials: true});
    
        setLoading(false)
        if(res.data.success){
          toast.success(res.data.message)
          setLoginInput({email:inputData.email,password:inputData.password})
          setSignUpInput({name:"",email:"",password:""})
          setTabValue("login")
        }
      } catch (error) {
        setLoading(false)
        console.log(error)
        const errorMessage = error.response?.data?.message || "Something went wrong. Please try again.";
    
        
        toast.error(errorMessage);
      }
    } else {
      try {
        setLoading(true)
        const res = await axios.post(`${BASE_URL}/user/login`, {...inputData}, {withCredentials: true});
        setLoading(false)
        if(res.data.success){
          toast.success(res.data.message)
        
          dispatch(userLoggedIn(res.data.user))
          navigate("/")
        }
   
      } catch (error) {
        setLoading(false)
        console.log(error)
        const errorMessage = error.response?.data?.message || "Something went wrong. Please try again.";
    
        console.error("Error:", errorMessage);
        toast.error(errorMessage);
      }
    }
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen ">
      <Tabs value={tabValue} onValueChange={setTabValue} className="sm:w-[350px] md:w-[400px] ">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="signup">SignUp</TabsTrigger>
          <TabsTrigger value="login">Login</TabsTrigger>
        </TabsList>
        <TabsContent value="signup">
          <Card>
            <CardHeader>
              <CardTitle className="text-center">SignUp</CardTitle>
              <CardDescription className="text-center">
                Create an account to start learning or teaching.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="space-y-1">
                <Label htmlFor="name">Name</Label>
                <Input
                  onChange={(e) => changeInputHandler(e, "signup")}
                  name="name"
                  value={signupInput.name}
                  type="text"
                  id="name"
                  placeholder="John Doe"
                  required
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="email">Email</Label>
                <Input
                  name="email"
                  onChange={(e) => changeInputHandler(e, "signup")}
                  value={signupInput.email}
                  type="email"
                  id="email"
                  placeholder="john@example.com"
                  required
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="password">Password</Label>
                <Input
                  name="password"
                  onChange={(e) => changeInputHandler(e, "signup")}
                  value={signupInput.password}
                  type="password"
                  id="password"
                  placeholder="********"
                  required
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={() => {HandleRegistration("signup")}} 
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating Account...
                  </>
                ) : (
                  "SignUp"
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="login">
          <Card>
            <CardHeader>
              <CardTitle className="text-center">Login</CardTitle>
              <CardDescription className="text-center">
                Access your courses and learning materials.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="space-y-1">
                <Label htmlFor="email">Email</Label>
                <Input
                  name="email"
                  onChange={(e) => changeInputHandler(e, "login")}
                  value={loginInput.email}
                  id="email"
                  type="email"
                  placeholder="john@example.com"
                  required
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="password">Password</Label>
                <Input
                  name="password"
                  onChange={(e) => changeInputHandler(e, "login")}
                  value={loginInput.password}
                  id="password"
                  type="password"
                  placeholder="********"
                  required
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={() => {HandleRegistration("login")}} 
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Logging in...
                  </>
                ) : (
                  "Login"
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Login;