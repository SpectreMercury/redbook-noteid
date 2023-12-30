"use client"

import { SnackbarProvider, enqueueSnackbar } from 'notistack';
import { useState, FormEvent } from 'react';

interface IApiResponse {
  data: string;
  errmsg: string;
  status: Number;
}

export default function Home() {
  const [shortUrl, setShortUrl] = useState<string>('');
  const [longUrl, setLongUrl] = useState<string>('');
  const [noteId, setNodeId] = useState<string>('');
  
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const regex = /http:\/\/xhslink\.com\/\S+/; // Make sure your regex is defined
    const match = shortUrl.match(regex);

    if (!match) {
      alert('无效的URL');
      return;
    }

    // Since match is not null, use the first match in the array
    let usefulURL = match[0];

    try {
      const response = await fetch(`/api/resolve?url=${encodeURIComponent(usefulURL)}`);
      const data: IApiResponse = await response.json();
      if (data.data) {
        enqueueSnackbar("获取笔记ID成功", {variant: 'success'})
        setLongUrl(data.data);
        let endPoint = data.data.split('/')[5];
        let params = endPoint.split('?')[0]
        setNodeId(params)
      } else {
        alert(data.errmsg || '未知错误');
      }
    } catch (error) {
      alert('请求错误');
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(noteId);
      enqueueSnackbar("笔记ID已复制到剪贴板", { variant: 'success' });
    } catch (error) {
      enqueueSnackbar("复制到剪贴板失败", { variant: 'error' });
    }
  };



  return (
    <SnackbarProvider
      autoHideDuration={2000} 
    >
      <div className='h-full flex flex-col justify-center items-center'>
        <div className=' text-red-400 font-extrabold text-4xl'>小红书笔记ID获取</div>
          <form onSubmit={handleSubmit} className='flex flex-col justify-center'>
            <input
              type="text"
              className='h-16 w-[288px] border rounded-lg my-8 px-4'
              value={shortUrl}
              onChange={(e) => setShortUrl(e.target.value)}
              placeholder="输入转发内容"
            />
            <button className='h-16 w-[288px] bg-red-400 text-white rounded-lg' type="submit">获取长链接</button>
          </form>
          <div className='mt-8 flex gap-4 items-center'>
            {longUrl && <p>{noteId}</p>}
            <div onClick={async() => {
              await copyToClipboard()
            }}>
              <svg xmlns="http://www.w3.org/2000/svg" height="24" width="16" viewBox="0 0 448 512"><path d="M384 336H192c-8.8 0-16-7.2-16-16V64c0-8.8 7.2-16 16-16l140.1 0L400 115.9V320c0 8.8-7.2 16-16 16zM192 384H384c35.3 0 64-28.7 64-64V115.9c0-12.7-5.1-24.9-14.1-33.9L366.1 14.1c-9-9-21.2-14.1-33.9-14.1H192c-35.3 0-64 28.7-64 64V320c0 35.3 28.7 64 64 64zM64 128c-35.3 0-64 28.7-64 64V448c0 35.3 28.7 64 64 64H256c35.3 0 64-28.7 64-64V416H272v32c0 8.8-7.2 16-16 16H64c-8.8 0-16-7.2-16-16V192c0-8.8 7.2-16 16-16H96V128H64z"/></svg>
            </div>
          </div>
      </div>
    </SnackbarProvider>
  );
}
