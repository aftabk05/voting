import React, { useState, useEffect } from "react";

export default function VotingCandidatesUI() {
  const COLUMN_LABELS = ["stays here","out of town","recently out of town","dead"];
  const [candidates, setCandidates] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(50);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("/extracted_candidates.json")
      .then(r => r.json())
      .then(d => setCandidates(d.map(x=>({...x,selectionIndex:null}))));
  }, []);

  const filtered = candidates.filter(c => c.name.toLowerCase().includes(search.toLowerCase()));
  const totalPages = Math.max(1, Math.ceil(filtered.length/perPage));
  const pageItems = filtered.slice((currentPage-1)*perPage, currentPage*perPage);

  const setSelection = (id,idx)=>{
    setCandidates(prev=>prev.map(p=>p.id===id?{...p,selectionIndex:idx}:p));
  };

  return (
    <div style={{padding:20}}>
      <h2>Voting List</h2>
      <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search..." />
      {pageItems.map(c=>(
        <div key={c.id} style={{display:'flex',gap:10,padding:5}}>
          <div style={{flex:1}}>{c.name}</div>
          {COLUMN_LABELS.map((l,idx)=>(
            <input type="radio" name={`r_${c.id}`} checked={c.selectionIndex===idx} onChange={()=>setSelection(c.id,idx)} />
          ))}
        </div>
      ))}
      <div>
        <button onClick={()=>setCurrentPage(p=>Math.max(1,p-1))}>Prev</button>
        <span>{currentPage}/{totalPages}</span>
        <button onClick={()=>setCurrentPage(p=>Math.min(totalPages,p+1))}>Next</button>
      </div>
    </div>
  );
}
