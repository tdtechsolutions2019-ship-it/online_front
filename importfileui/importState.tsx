import Input from '@/components/form/input/InputField'
import Label from '@/components/form/Label'
import Button from '@/components/ui/button/Button'
import React, { useRef, useState } from 'react'
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import Link from 'next/link';

function ImportState({ onImport, onClose ,templateUrl,error,setError}: any) {
    const [file, setFile] = useState<File | null>(null);
    const [selectedFile, setselectedFile] = useState<File | null>(null);
    
    const fileref = useRef(null as any);
    const hanleChange = (e: any) => {
        console.log("eeee", e.target.files[0])
        const seletecFile = e.target.files[0];
        setFile(seletecFile);
        if (!seletecFile) return;

        setselectedFile(seletecFile);
        const allowFileTypes = ['csv', 'xlsx', 'xls'];
        const fileext = seletecFile.name.split('.').pop();
        if (!allowFileTypes.includes(fileext || "")) {
            setError('Please select a valid file type (csv, xlsx, xls)');
            e.target.value = '';
            return
        }

        const maxsize = 2 * 1024 * 1024;
        if (seletecFile.size > maxsize) {
            setError('Please select a file less than 2MB');
            e.target.value = '';
            return
        }
        setError(null);
        setFile(seletecFile);
    }

    const handleImport = () => {
        if (!file) return setError("Please select a file");
        onImport(file);
    };
    console.log("file", error)
    const handleRemove =()=>{
        setFile(null);
        setselectedFile(null);
        setError(null);

        if(fileref.current){

            fileref.current.value = '';
        }
    }
    return (
        <div >
            <div className='flex items-center border-b space-y-3.5 justify-between'>
                <Label className='text-[20px]'>Bulk Import</Label>
                <a href={templateUrl} download={true} className='w-50 mb-5 px-4 py-2 text-sm bg-brand-500 text-white shadow-theme-xs hover:bg-brand-600 disabled:bg-brand-300 inline-flex items-center justify-center font-medium gap-2 rounded-lg transition ' >Download Template</a>
            </div>

            <div>
                <Label className='text-[15px] mt-3'>Add File</Label>
                <div className="space-y-4 ">
                    <Input ref={fileref} type="file" className='mt-3' onChange={hanleChange} accept=".csv, .xlsx" />
                    {selectedFile ? (
                        <p className='text-gray-500 space-x-2'><span className='font-bold '>Selected:</span> {selectedFile.name} <span className='font-bold cursor-pointer'><DeleteOutlinedIcon onClick={handleRemove} color='error' /></span></p>
                    ) : ""}

                    {error && <p className='text-red-500'>{error}</p>}
                </div>
            </div>


            <div className="gap-3 pb-4 mt-6" style={{ display: "flex", justifyContent: "center" }}>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={onClose}
                    className="!rounded-lg !normal-case !px-4"
                >
                    Cancel
                </Button>

                <Button
                    size="sm"
                    variant="primary"
                    onClick={handleImport}
                    className="!rounded-lg !normal-case !px-4 !shadow-none"
                >
                    Import
                </Button>
            </div>
        </div>
    )
}

export default ImportState
