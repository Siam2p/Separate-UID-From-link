import React, { useEffect, useRef, useState } from 'react'
import toast, { Toaster } from 'react-hot-toast';
import { MdContentPaste } from "react-icons/md";
import { GrClearOption } from "react-icons/gr";

export default function LickToID() {

  const [links, setLinks] = useState('');
  const [uids, setUids] = useState([]);

  const [uidBox, setUidBox] = useState(false);

  const number = useRef()
  const textAreaRef = useRef()

  // console.log(links);

  function lineCounter() {
    const lines = links.split('\n');
    return lines.map((line, index) => (
      <div key={index} className="text-gray-500 select-none">{index + 1}</div>
    ));
  }


  useEffect(() => {
    const textArea = textAreaRef.current;
    const lineNumbers = number.current;
    if (!textArea || !lineNumbers) return;

    const onTextAreaScroll = () => {
      lineNumbers.scrollTop = textArea.scrollTop;
    };
    const onNumberScroll = () => {
      textArea.scrollTop = lineNumbers.scrollTop;
    };

    textArea.addEventListener('scroll', onTextAreaScroll);
    lineNumbers.addEventListener('scroll', onNumberScroll);

    return () => {
      textArea.removeEventListener('scroll', onTextAreaScroll);
      lineNumbers.removeEventListener('scroll', onNumberScroll);
    };
  }, []);





  function SeparateUID(event) {
    event.preventDefault();
    const formEl = event.currentTarget;
    const formData = new FormData(formEl);
    const linksInput = formData.get('links');
    const linksArray = linksInput.split('\n').map(link => link.trim()).filter(link => link !== '');
    const extractedUIDs = linksArray.map(link => {
      try {
        const url = new URL(link);
        const pathnameParts = url.pathname.split('/').filter(part => part !== '');
        if (pathnameParts[0] === 'profile.php') {
          const idParam = url.searchParams.get('id');
          return idParam ? idParam : 'No UID found';
        } else {
          return pathnameParts[0] ? pathnameParts[0] : 'No UID found';
        }
      } catch (error) {
        console.error('Error extracting UID: ' + error.message);
        return 'Invalid URL';
      }
    });
    setUids(extractedUIDs);
    setUidBox(true);
  }

  function copyToClipboard() {
    const uidsText = uids.join('\n');
    navigator.clipboard.writeText(uidsText)
      .then(() => {
        toast.success('UIDs copied to clipboard!');
        setUidBox(false);
      })
      .catch(err => {
        toast.error('Failed to copy UIDs: ' + err.message);
      });
  }

  function pasteFromClipboard() {
    navigator.clipboard.readText()
      .then(text => setLinks(text))
      .catch(err => {
        toast.error('Failed to paste from clipboard: ' + err.message);
      });
  }



  return (
    <section className='w-full h-full flex flex-col px-10 py-5 items-center gap-5'>
      <h1 className='text-2xl font-semibold text-blue-600'>Separate UID From link</h1>
      <Toaster />
      <form className='flex flex-col items-center gap-6 w-full max-w-lg' onSubmit={SeparateUID}>
        <label className='flex flex-col items-center gap-2 w-80'>
          Facebook Profile Links list:
          <div className="relative flex border w-full h-70 border-gray-500 p-2 rounded-md text-sm">
            <div
              ref={number}
              className="h-full overflow-y-auto overflow-x-hidden">{lineCounter()}

            </div>
            <textarea
              ref={textAreaRef}
              placeholder="Enter links here..." name='links' className='resize-none w-full px-1 outline-0 whitespace-nowrap overflow-x-auto' onChange={(e) => setLinks(e.target.value)}
              value={links}>
            </textarea>
            <button type='button' className="absolute right-2 top-2 p-1 cursor-pointer rounded-md bg-blue-300 opacity-60" onClick={()=> links ? setLinks("") : pasteFromClipboard()} >{!links ? <MdContentPaste size={20} /> : <GrClearOption size={20} />}</button>
          </div>
        </label>
        <button type="submit" className='bg-blue-500 px-5 py-2 text-white font-semibold shadow-2xl rounded-xl hover:bg-blue-600 cursor-pointer transition-all disabled:opacity-50'
        disabled = {!links}>Separate UID</button>

        {
        uidBox && links && (<div className="w-full max-w-lg flex flex-col gap-3 items-center">
          <h2 className='text-lg font-medium text-green-700'>Extracted UIDs:</h2>
          <div className="w-80 flex flex-col gap-2 items-center border p-3 rounded-md">
            <span className='text-gray-500'>Total UIDs: {uids.length}</span>
            <textarea
              readOnly
              value={uids.join('\n')}
              className='w-full max-w-lg h-70 p-2 border border-gray-300 rounded-md resize-none outline-0 cursor-copy'
            ></textarea>
          </div>
          <button type="button" onClick={copyToClipboard} className='bg-green-500 px-5 py-2 rounded-xl text-white shadow-2xl hover:bg-green-600 cursor-pointer'>Copy UIDs</button>
        </div>)}
      </form>
    </section>
  )
}
