export interface SignupFields {
  name: string;
  email: string;
  password: string;
}

export interface SigninFields {
  email: string;
  password: string
}


export const validateSignup = (fields: SignupFields): string => {
  if (!fields.name.trim()) return "Full name is required";

  if (!fields.email.trim()) return "Email is required";

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(fields.email)) return "Enter a valid email address";

  if (!fields.password) return "Password is required";

  if (fields.password.length < 8)
    return "Password must be at least 8 characters";

  return "";
};
export const validateSignin = (fields: SigninFields): string => {
  if(!fields.email.trim()) return "Email is required";

   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(fields.email)) return "Enter a valid email address";

  if(!fields.password.trim()){
    return "Password required"
  }
  return "";

}