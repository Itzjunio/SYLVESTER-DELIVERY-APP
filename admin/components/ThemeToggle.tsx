'use client';
import { useEffect, useState } from 'react';
export default function ThemeToggle(){ const [dark, setDark] = useState(false); useEffect(()=>{ if(dark) document.documentElement.classList.add('dark'); else document.documentElement.classList.remove('dark'); }, [dark]); return <button onClick={()=>setDark(!dark)} className='px-3 py-2 rounded-md bg-gray-100'>{dark ? 'Dark' : 'Light'}</button> }
