import { Box } from '@mui/material'
import React, { useState } from 'react'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import English from '../languagetabs/english';
function LanguageTabs({ formik, languages, isviewMode }: any) {
    const [value, setValue] = useState('1');

    const handleChange = (event: React.SyntheticEvent, newValue: string) => {
        setValue(newValue);
    };
    console.log("languages", languages)
    return (
        <>
            <Tabs>
                <TabList>
                    {languages?.map((lang: any) => (
                        <Tab key={lang.id}>{lang.name}</Tab>
                    ))}
                </TabList>

                {languages?.map((lang: any, index: any) => (
                    <TabPanel key={lang.id}>
                        <English formik={formik} index={index} language={lang} isviewMode={isviewMode} />
                    </TabPanel>
                ))}
            </Tabs>
        </>
    )
}

export default LanguageTabs
