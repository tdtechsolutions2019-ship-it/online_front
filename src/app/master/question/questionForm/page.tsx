
"use client"
import Input from '@/components/form/input/InputField';
import Label from '@/components/form/Label';
import Select from '@/components/form/Select';

import Button from '@/components/ui/button/Button';
import { Api } from '@/helper/api';
import { createData } from '@/helper/axios';
import { commonTitle, statecommonTitle } from '@/helper/commontitle';
import Loader from '@/helper/loader';
import { ChevronDownIcon } from '@/icons';
import { useFormik } from 'formik';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify';
import LanguageTabs from './languageTabs';
import { useDispatch, useSelector, useStore } from 'react-redux';
import { fetchSubjectIfNeeded } from '@/redux/services/commonAPIService';

const languages = [
  { id: 1, name: "English" },
  { id: 2, name: "Gujarati" },
  { id: 3, name: "Hindi" },
];
const initialValues = {
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
    sameasenglish: "",

  })),

}



const QuestionAddForm = () => {

  const router = useRouter();
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false)
  const dispatch = useDispatch();
  const store = useStore();
  const subject = useSelector((state: any) => state.subject.list);
  const formik =
    useFormik({
      initialValues,
      validationSchema: '',
      onSubmit: async (value, action) => {

        console.log("value", value);
        try {
          setLoading(true)
          const payload = {
            ...value,

          };
          console.log("payload", payload)

          const res = await createData(
            Api.addquetion,
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

  const questiontype = [
    { value: '1', label: "Multiple Choice Question" },
    { value: '2', label: "True/False Question" },
    { value: '3', label: "Descriptive Questions" },
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

  const subjectOption = subject.map((subject: any) => ({
    value: subject.id.toString(),
    label: subject.subject_name,
  }));

  useEffect(() => {
    if (!subject?.length) {
      fetchSubjectIfNeeded(dispatch, store?.getState);
    }
  }, []);
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
            Add Question
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
                options={subjectOption}
                value={formik.values.subject_id}
                onChange={(value) =>
                  formik.setFieldValue(`subject_id`, value)
                }
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
                  placeholder="Select"
                  className="dark:bg-dark-900"
                />

                <span className="absolute right-3 top-1/2 -translate-y-1/2">
                  <ChevronDownIcon />
                </span>
              </div>
            </div>}
          
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
                placeholder="Select"
                className="dark:bg-dark-900 "
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2">
                <ChevronDownIcon />
              </span>
            </div>

          </div>

          <LanguageTabs formik={formik} languages={languages} />

          <div className='flex gap-5'>
            <Button type='submit' size="sm" variant="primary">
              Save
            </Button>

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

export default QuestionAddForm
