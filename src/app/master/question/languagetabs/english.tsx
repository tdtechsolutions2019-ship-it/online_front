import Editor from '@/components/Editor/suneditor'
import Input from '@/components/form/input/InputField'
import Label from '@/components/form/Label'
import Select from '@/components/form/Select'
import { commonTitle } from '@/helper/commontitle'
import { ChevronDownIcon } from '@/icons'
import React from 'react'

function English({ formik, index, language, isviewMode }: any) {


    console.log("11111111111", language)
    const handleCopyFromEnglish = (checked: boolean) => {

        if (!checked) return;

        const englishData = formik.values.translations?.[0];

        formik.setFieldValue(`translations[${index}].question`, englishData.question);
        formik.setFieldValue(`translations[${index}].option1`, englishData.option1);
        formik.setFieldValue(`translations[${index}].option2`, englishData.option2);
        formik.setFieldValue(`translations[${index}].option3`, englishData.option3);
        formik.setFieldValue(`translations[${index}].option4`, englishData.option4);

    };

    console.log("formik222222", formik.values)
    return (
        <div className='p-4'>
            {language.name !== 'English' &&
                <div className='flex items-center gap-5'>
                    <Label>Same as English</Label>
                    <input
                        type="checkbox"
                        name="sameasenglish"
                        disabled={isviewMode}
                        onChange={(e) => {
                            const checked = e.target.checked;

                            formik.setFieldValue(`translations[${index}].sameasenglish`, checked);
                            handleCopyFromEnglish(checked);
                        }}
                        checked={formik.values.translations?.[index]?.sameasenglish}
                    />
                </div>}
            <div className='grid grid-cols-[10%_auto] gap-5'>

                <Label>
                    {commonTitle.Questions} <span className='text-red-700 ms-2'>*</span>
                </Label>

                <div>
                    <Editor
                        value={formik.values.translations?.[index]?.question || ""}
                        onChange={(val: any) => formik.setFieldValue(`translations[${index}].question`, val)}
                        disabled={isviewMode}
                    />

                    <span className="text-red-500 ms-3 text-sm font-bold">
                        {formik.touched?.translations?.[index]?.question &&
                            formik.errors?.translations?.[index]?.question}
                    </span>
                </div>
            </div>
            <div className='space-y-5'>
                {formik.values.question_type === '2' ? (<>

                    <div className='grid grid-cols-[10%_25%] gap-5 items-center'>
                        <Label>{commonTitle.Option1}</Label>
                        <Input
                            type="text"
                            name={`translations[${index}].option1`}
                            onChange={formik.handleChange}
                              disabled={isviewMode}
                            value={formik.values.translations?.[index]?.option1 || ""}
                        />
                    </div>

                    {/* OPTION 2 */}
                    <div className='grid grid-cols-[10%_25%] gap-5 items-center'>
                        <Label>{commonTitle.Option2}</Label>
                        <Input
                            type="text"
                            name={`translations[${index}].option2`}
                            onChange={formik.handleChange}
                            value={formik.values.translations?.[index]?.option2 || ""}
                            disabled={isviewMode}
                        />
                    </div>

                </>
                ) : formik.values.question_type === '3' ? '' : (
                    <>
                        {/* OPTION 1 */}
                        <div className='grid grid-cols-[10%_25%] gap-5 items-center'>
                            <Label>{commonTitle.Option1}</Label>
                            <Input
                                type="text"
                                name={`translations[${index}].option1`}
                                onChange={formik.handleChange}
                                    value={formik.values.translations?.[index]?.option1 || ""}
                                    disabled={isviewMode}
                            />
                        </div>

                        {/* OPTION 2 */}
                        <div className='grid grid-cols-[10%_25%] gap-5 items-center'>
                            <Label>{commonTitle.Option2}</Label>
                            <Input
                                type="text"
                                name={`translations[${index}].option2`}
                                onChange={formik.handleChange}
                                    value={formik.values.translations?.[index]?.option2 || ""}
                                    disabled={isviewMode}
                            />
                        </div>

                        {/* OPTION 3 */}
                        <div className='grid grid-cols-[10%_25%] gap-5 items-center'>
                            <Label>{commonTitle.Option3}</Label>
                            <Input
                                type="text"
                                name={`translations[${index}].option3`}
                                onChange={formik.handleChange}
                                    value={formik.values.translations?.[index]?.option3 || ""}
                                    disabled={isviewMode}
                            />
                        </div>

                        {/* OPTION 4 */}
                        <div className='grid grid-cols-[10%_25%] gap-5 items-center'>
                            <Label>{commonTitle.Option4}</Label>
                            <Input
                                type="text"
                                name={`translations[${index}].option4`}
                                onChange={formik.handleChange}
                                    value={formik.values.translations?.[index]?.option4 || ""}
                                    disabled={isviewMode}
                            />
                        </div>

                        {/* ANSWER */}

                    </>
                )}


            </div>
        </div>
    )
}

export default English
