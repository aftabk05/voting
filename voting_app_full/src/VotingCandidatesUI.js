import React, { useState, useEffect, useRef } from "react";

export default function VotingCandidatesUI() {
  const COLUMN_LABELS = [
    "stays here",
    "out of town",
    "recently out of town",
    "dead",
  ];

  const [candidates, setCandidates] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(50);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("/extracted_candidates.json")
      .then(r => r.json())
      .then(d => setCandidates(d.map(x => ({...x, selectionIndex:null}))));
  }, []);

  const filtered = candidates.filter(c => c.name.toLowerCase().includes(search.toLowerCase()));
  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const pageItems = filtered.slice((currentPage - 1)*perPage, currentPage*perPage);

  const setSelection = (id, idx) => {
    setCandidates(prev => prev.map(p => p.id===id? {...p,selectionIndex:idx}:p));
  };

  const exportCSV = () => {
    let rows = ["id,name,selection"];
    candidates.forEach(c=>{
      rows.push(`${c.id},"${c.name.replace('"','""')}",${c.selectionIndex!=null?COLUMN_LABELS[c.selectionIndex]:""}`);
    });
    let blob = new Blob([rows.join("\n")],{type:"text/csv"});
    let a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "voting_export.csv";
    a.click();
  };

  return (
    <div style={{padding:"20px"}}>
      <h2>Voting List</h2>
      <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search..." />
      <button onClick={exportCSV}>Export CSV</button>

      {pageItems.map(c=>(
        <div key={c.id} style={{display:"flex", gap:"10px", padding:"5px"}}>
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
