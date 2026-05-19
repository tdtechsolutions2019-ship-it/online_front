
"use client"
import Input from '@/components/form/input/InputField';
import Label from '@/components/form/Label';
import Select from '@/components/form/Select';

import Button from '@/components/ui/button/Button';
import { Api } from '@/helper/api';
import { createData, readData, updateData } from '@/helper/axios';
import { commonTitle, statecommonTitle } from '@/helper/commontitle';
import Loader from '@/helper/loader';
import { ChevronDownIcon } from '@/icons';
import { useFormik } from 'formik';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify';
import LanguageTabs from '../languageTabs';

type Translation = {
  language_id: number;
  question: string;
  option1: string;
  option2: string;
  option3: string;
  option4: string;
  sameasenglish: boolean; // 👈 better as boolean
};

type FormValues = {
  question_type: string;
  subject_id: string; // or number (depends on your API)
  weightage: string;  // or number
  status: string;
  answer: string;
  translations: Translation[];
};

const languages = [
  { id: 1, name: "English" },
  { id: 2, name: "Gujarati" },
  { id: 3, name: "Hindi" },
];
const initialValues: FormValues = {
  question_type: "",
  subject_id: "",
  weightage: "",
  status: "",
  answer: "",

  translations: languages.map((lang) => ({
    language_id: lang.id,
    question: "",
    option1: "",
    option2: "",
    option3: "",
    option4: "",
    sameasenglish: false,

  })),

}

const QuestionEditForm = () => {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { id } = params;
  const searchParams = useSearchParams();
  const mode = searchParams.get("mode");
  const isViewMode = mode === "view";
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false)

  const formik =
    useFormik({
      initialValues,
      validationSchema: '',
      onSubmit: async (value, action) => {

        console.log("value", value);
        try {
          setLoading(true)
          const payload = {
            ...value
          };
          console.log("payload", payload)

          const res = await updateData(
            `${Api.updatequestion}/${id}`,
            payload,
          );
          console.log("res------>>", res)
          if (res.status === 200) {
            toast.success(res.message);

            action.resetForm();

            router.push("/master/question");
          }
        } catch (error) {
          console.log("API Error", error);
          toast.error("Failed to add state");
        }
        finally {
          setLoading(false)
        }
      }
    });

  const getCountry = async () => {
    try {
      setLoading(true);
      const res = await readData(`${Api.getquestionById}/${id}`, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log("res in question", res)

      if (res.status === 200) {
        const data = res.data;
        console.log("formik11111111", data)
        const updatedTranslations = languages.map((lang) => {
          const existing = data.translations?.find(
            (t: any) => t.language_id === lang.id
          );

          return {
            language_id: lang.id,
            question: existing?.question || "",
            option1: existing?.option1 || "",
            option2: existing?.option2 || "",
            option3: existing?.option3 || "",
            option4: existing?.option4 || "",
            sameasenglish: existing?.sameasenglish === '1' ? true : false,
          };
        });

        formik.setValues({
          question_type: data.question_type || "",
          subject_id: data.subject_id || "",
          weightage: data.weightage || "",
          status: data.status || "",
          answer: data.answer || "",
          translations: updatedTranslations,
        });

      } else if (res.status === 400) {
        toast.error(res.message);
      }

    } catch (error) {
      console.log("Fetch Error", error);
    }
    finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (id) {
      getCountry();
    }
  }, [id]);
  console.log("formik11111111", formik.values)

  const questiontype = [
    { value: '1', label: "Multiple Choice Question" },
    { value: '2', label: "True/False Question" },
    { value: '3', label: "Descriptive Questions" },
  ]
  const subjects = [
    { value: '1', label: "English" },
    { value: '2', label: "Hindi" },
    { value: '3', label: "Maths" },
  ]
  const weightages = [
    { value: 'Easy', label: "Easy" },
    { value: 'Moderate', label: "Moderate" },
    { value: 'Difficult', label: "Difficult" },
  ]
  const statusoption = [
    { label: "Active", value: "1" },
    { label: "Inactive", value: "0" }
  ];
  const answer = [
    { value: "option1", label: "Option 1" },
    { value: "option2", label: "Option 2" },
    { value: "option3", label: "Option 3", disabled: formik.values.question_type === '2' ? true : false },
    { value: "option4", label: "Option 4", disabled: formik.values.question_type === '2' ? true : false },
  ]
  return (
    <>
      <div>
        {loading && (
          <div className="absolute inset-0 flex justify-center items-center bg-white/70 dark:bg-black/50 z-50">
            <Loader />
          </div>
        )}
        <form onSubmit={formik.handleSubmit} className='bg-white shadow-lg rounded-xl p-6 space-y-5' >
          <h2 className="text-2xl font-semibold text-gray-700 py-3">
            {isViewMode ? "View" : "Edit"} Question
          </h2>
          <div className='grid grid-cols-[10%_25%] gap-5 '>
            <div>
              <Label >{commonTitle.Questiontype}<span className="text-red-500">*</span></Label>
            </div>
            <div className='relative '>
              <Select
                options={questiontype}
                value={formik.values.question_type}
                onChange={(value) =>
                  formik.setFieldValue(`question_type`, value)
                }
                disable={isViewMode}
                placeholder="Select"
                className="dark:bg-dark-900 "
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2">
                <ChevronDownIcon />
              </span>
            </div>

          </div>
          <div className='grid grid-cols-[10%_25%] gap-5 '>

            <div>
              <Label >{commonTitle.Subject}<span className="text-red-500">*</span></Label>
            </div>
            <div className='relative '>
              <Select
                options={subjects}
                value={formik.values.subject_id}
                onChange={(value) =>
                  formik.setFieldValue(`subject_id`, value)
                }
                disable={isViewMode}
                placeholder="Select"
                className="dark:bg-dark-900 "
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2">
                <ChevronDownIcon />
              </span>
            </div>
          </div>

          <div className='grid grid-cols-[10%_25%] gap-5 '>

            <div>
              <Label >{commonTitle.Weightage}<span className="text-red-500">*</span></Label>
            </div>
            <div className='relative '>
              <Select
                options={weightages}
                value={formik.values.weightage}
                onChange={(value) =>
                  formik.setFieldValue(`weightage`, value)
                }
                disable={isViewMode}
                placeholder="Select"
                className="dark:bg-dark-900 "
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2">
                <ChevronDownIcon />
              </span>
            </div>

          </div>
          <div className='grid grid-cols-[10%_25%] gap-5 '>

            <div>
              <Label >{commonTitle.Status}<span className="text-red-500">*</span></Label>
            </div>
            <div className='relative '>
              <Select
                options={statusoption}
                value={formik.values.status}
                onChange={(value) =>
                  formik.setFieldValue(`status`, value)
                }
                disable={isViewMode}
                placeholder="Select"
                className="dark:bg-dark-900 "
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2">
                <ChevronDownIcon />
              </span>
            </div>

          </div>
          {formik.values.question_type !== '3' &&
            <div className='grid grid-cols-[10%_25%] gap-5'>
              <div>
                <Label>{commonTitle.Answer}</Label>
              </div>

              <div className='relative'>
                <Select
                  options={answer}
                  value={formik.values.answer || ""}
                  onChange={(value) =>
                    formik.setFieldValue(`answer`, value)
                  }
                  disable={isViewMode}
                  placeholder="Select"
                  className="dark:bg-dark-900"
                />

                <span className="absolute right-3 top-1/2 -translate-y-1/2">
                  <ChevronDownIcon />
                </span>
              </div>
            </div>}

          <LanguageTabs formik={formik} languages={languages} isviewMode={isViewMode} />

          <div className='flex gap-5'>
            {!isViewMode && (
              <Button size="sm" type="submit">
                Save
              </Button>
            )}

            <Button size="sm" onClick={() => {
              router.push("/master/question");
            }} variant="outline">
              Cancel
            </Button>
          </div>
        </form>
      </div>

    </>
  )
}

export default QuestionEditForm
