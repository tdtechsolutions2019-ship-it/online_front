import { count } from "console";
import * as Yup from "yup";

export const CountrySchema = Yup.object({
  country_name: Yup.string()
    .required("Please enter the country name"),

  country_code: Yup.string()
    .required("Please enter country code "),

  currency_code: Yup.string()
    .required("Please enter currency code "),

  status: Yup.string()
    .required("Please enter status"),
});

export const StateSchema = Yup.object({
  country_id: Yup.string()
    .required("Please select a country"),
  states: Yup.array()
    .of(
      Yup.object({
        state_name: Yup.string()
          .required("Please enter the state name"),
        gst_code: Yup.string()
          .required("Please enter the state code"),
        status: Yup.string()
          .required("Please enter status"),
      })
    ),


})

export const RetestSchema = Yup.object({
  passingMarks: Yup.string()
    .required("Please enter the passing marks"),
  totalMarks: Yup.string()
    .required("Please enter the total marks"),

})

export const SettingSchema = Yup.object({
startDate: Yup.date()
  .required("Please select the exam schedule start date")
  .test(
    "is-greater",
    "Start date must be after end date",
    function (value) {
      const { endDate } = this.parent;
      if (!value || !endDate) return true; // skip if empty
      return new Date(value) > new Date(endDate);
    }
  ),

endDate: Yup.date()
  .required("Please select the exam schedule end date"),
  adminReportEmail: Yup.string()
    .required("Please enter the admin exam report email")
    .email("Please enter a valid email address"),
  isCentralHead: Yup.boolean()
    .oneOf([true], "Please select if it is Central Head"),
  adminEmail: Yup.string()
    .required("Please enter the admin email")
    .email("Please enter a valid email address"),
})

export const RoleSchema = Yup.object({
  role_name: Yup.string()
    .required("Please enter the role name"),
  role_code: Yup.string()
    .required("Please enter the role code")
    .min(2, "Role code must be at least 2 characters")
    .max(4, "Role code must be at most 4 characters"),
})


export const centerInfoSchema = Yup.object({
  center_name: Yup.string()
    .required("Please enter the center name"),
  center_code: Yup.string()
    .required("Please enter the center code"),
  email: Yup.string()
    .required("Please enter the email")
    .email("Please enter a valid email address"),
  contact_person1: Yup.string()
    .required("Please enter the contact person 1"),
  mobile: Yup.string()
    .required("Please enter the mobile number")
})


export const signInSchema = Yup.object({
  email: Yup.string()
    .email("Invalid email format")
    .required("Email is required")
    .trim(),

  password: Yup.string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters")
    .max(20, "Password must not exceed 20 characters")
});

export const resetPassword = Yup.object({
  email: Yup.string()
    .email("Invalid email format")
    .required("Email is required")
    .trim(),

  password: Yup.string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters")
    .max(20, "Password must not exceed 20 characters"),

  confirm_password: Yup.string()
    .required("Confirm Password is required")
    .oneOf([Yup.ref("password")], "Passwords must match"),
})


export const userPageSchema = Yup.object({
  center_name: Yup.string()
    .required("Center name is required"),

  role: Yup.string()
    .required("Role is required"),

  first_name: Yup.string()
    .required("First name is required"),

  last_name: Yup.string()
    .required("Last name is required"),

  email: Yup.string()
    .required("Email is required"),
  usertype: Yup.string()
    .required("Usertype is required"),
    username: Yup.string()
    .required("Username is required"),
});

export const subjectPageSchema = Yup.object({
  subject_name: Yup.string()
    .required("Subject name is required"),
  description: Yup.string()
    .required("Description is required"),
});

export const coursePageSchema = Yup.object({
  course_name: Yup.string()
    .required("Course name is required"),
  course_code: Yup.string()
    .required("Course code is required"),
});


export const studentPageSchema = Yup.object({
  identity_no: Yup.string()
    .required("Identity number is required"),

  center_code: Yup.string()
    .required("Center code is required"),

  student_name: Yup.string()
    .required("Student name is required"),

  course_code: Yup.string()
    .required("Course code is required"),

  joining_time: Yup.string()
    .required("Joining month/year is required"),

  registration_time: Yup.string()
    .required("Registration month/year is required"),


  parents_email: Yup.string()
    .email("Invalid email format")
    ,

  parents_contact: Yup.string()
  
    .matches(/^[0-9]{10}$/, "Enter valid 10-digit number"),

});

export const examScheduleSchema = Yup.object({


  exam_date: Yup.string()
    .required("Exam date is required"),

  center_id: Yup.string()
    .required("Exam Center is required"),

});