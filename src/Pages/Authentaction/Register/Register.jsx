import React, { useState } from "react";
import { useForm } from "react-hook-form";
import useAuth from "../../../Hooks/useAuth";
import { Link } from "react-router";
import SocialLogin from "../SocialLogin/SocialLogin";
import axios from 'axios';


const Register = () => {
  const { createUser, updateUserProfile } = useAuth({});

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [profilePic, setProfilePic] = useState('')

  const onSubmit = (data) => {
    console.log(data);

    createUser(data.email, data.password)
      .then((result) => {
        console.log(result.user);

        // update userinfo in the database

        // update user profile in firebase
        const userProfile = {
          displayName : data.name,
          photoURL: profilePic
        }
        updateUserProfile(userProfile)
          .then(() => {
              console.log('Profile name pic updated');
          })
          .catch(error =>{
              console.error(error);
          })
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleImageUpload = async(e) =>{
   const image = e.target.files[0]
   console.log(image);

   const formData = new FormData();
   formData.append('image', image)

    const imageUploadUrl = `https://api.imgbb.com/1/upload?&key=${import.meta.env.VITE_image_upload_key}`
   const res = await axios.post(imageUploadUrl, formData)
   setProfilePic(res.data.data.url);
  }
  return (
    <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
      <h1 className="text-3xl text-center p-8 font-bold">Create an account!</h1>
      <div className="card-body">
        <form onSubmit={handleSubmit(onSubmit)}>
          <fieldset className="fieldset">

            {/* name */}
            <label className="label">Name</label>
            <input
              type="text"
              {...register("name", { required: true })}
              className="input"
              placeholder="Your Name"
            />
            {/* image */}
            <label className="label">Photo</label>
            <input
              type="file"
              onChange={handleImageUpload}
              // {...register("name", { required: true })}
              className="input"
              placeholder="Your Profile Picture"
            />
            {errors.email?.type === "required" && (
              <p className="text-red-400">Name is required</p>
            )}

            {/* email */}
            <label className="label">Email</label>
            <input
              type="email"
              {...register("email", { required: true })}
              className="input"
              placeholder="Email"
            />
            {errors.email?.type === "required" && (
              <p className="text-red-400">Email is required</p>
            )}

            {/* password */}
            <label className="label">Password</label>
            <input
              type="password"
              {...register("password", { required: true, minLength: 6 })}
              className="input"
              placeholder="Password"
            />
            {errors.password?.type === "required" && (
              <p className="text-red-500">Password is required</p>
            )}
            {errors.password?.type === "minLength" && (
              <p className="text-red-500">
                Password must be 6 characters or longer
              </p>
            )}

            <button className="btn bg-yellow-300 mt-4">Register</button>
          </fieldset>
          <p>
            <small>
              Already have an account?{" "}
              <Link to="/login" className="text-blue-500 btn btn-link">
                Login
              </Link>
            </small>
          </p>
        </form>
        <SocialLogin />
      </div>
    </div>
  );
};

export default Register;
