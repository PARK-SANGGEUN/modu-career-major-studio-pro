
const $ = (id)=>document.getElementById(id);
let current = null;
let compare = [];
const colors = ["#dbeafe","#dcfce7","#fae8ff","#ffedd5","#fee2e2","#e0f2fe","#ede9fe","#fef9c3"];
const cats = ["전체", ...Array.from(new Set(CAREERS.map(c=>c.category)))];

function art(c, big=false){
  const hue = Math.abs([...c.title].reduce((a,ch)=>a+ch.charCodeAt(0),0)) % 360;
  const coat = c.category.includes("보건") ? "M60 68 h68 v70 h-68z" :
               c.category.includes("공공") ? "M58 70 h72 v68 h-72z" :
               c.category.includes("문화") || c.category.includes("미디어") ? "M52 76 h82 v58 h-82z" :
               c.category.includes("스포츠") ? "M64 78 h60 v56 h-60z" : "M58 74 h72 v62 h-72z";
  const tool = c.title.includes("의사")||c.title.includes("간호") ? `<path d="M142 75c28 0 28 48 0 48s-28-48 0-48z" fill="none" stroke="hsl(${hue},80%,42%)" stroke-width="7"/><path d="M142 123v22" stroke="hsl(${hue},80%,42%)" stroke-width="7"/>` :
               c.title.includes("AI")||c.title.includes("데이터")||c.title.includes("개발") ? `<rect x="128" y="80" width="58" height="42" rx="8" fill="#fff" stroke="hsl(${hue},80%,42%)" stroke-width="6"/><path d="M139 100h36M151 88v24M163 88v24" stroke="hsl(${hue},80%,42%)" stroke-width="4"/><circle cx="139" cy="134" r="5" fill="hsl(${hue},80%,42%)"/>` :
               c.title.includes("건축")||c.title.includes("도시") ? `<path d="M132 136V80l48 18v38" fill="#fff" stroke="hsl(${hue},80%,42%)" stroke-width="6"/><path d="M144 105h20M144 120h20" stroke="hsl(${hue},80%,42%)" stroke-width="5"/>` :
               c.title.includes("소방") ? `<path d="M140 70c24 22 9 56-15 66 42 3 66-26 43-66 3 20-12 25-28 0z" fill="hsl(${hue},90%,55%)"/>` :
               c.title.includes("경찰")||c.title.includes("법") ? `<path d="M151 76l34 13c-4 35-14 51-34 62-20-11-30-27-34-62z" fill="#fff" stroke="hsl(${hue},80%,42%)" stroke-width="6"/>` :
               c.title.includes("디자이너")||c.title.includes("작가")||c.title.includes("영상") ? `<rect x="130" y="82" width="48" height="54" rx="9" fill="#fff" stroke="hsl(${hue},80%,42%)" stroke-width="6"/><path d="M142 123l26-26M161 94l10 10" stroke="#ff4f9a" stroke-width="6"/>` :
               c.title.includes("스포츠")||c.title.includes("운동") ? `<circle cx="154" cy="105" r="24" fill="#fff" stroke="hsl(${hue},80%,42%)" stroke-width="6"/><path d="M134 105h40M154 83v44" stroke="hsl(${hue},80%,42%)" stroke-width="4"/>` :
               c.title.includes("스마트팜")||c.title.includes("식품")||c.title.includes("농") ? `<path d="M142 132c2-35 26-48 52-40-7 31-26 43-52 40z" fill="#bbf7d0" stroke="hsl(${hue},80%,35%)" stroke-width="5"/><path d="M142 132c-2-31-20-43-45-36 5 27 22 39 45 36z" fill="#dcfce7" stroke="hsl(${hue},80%,35%)" stroke-width="5"/>` :
               `<rect x="130" y="88" width="58" height="46" rx="11" fill="#fff" stroke="hsl(${hue},80%,42%)" stroke-width="6"/><path d="M143 106h31M143 120h23" stroke="hsl(${hue},80%,42%)" stroke-width="5"/>`;
  const motion = `<path d="M24 142c34 10 72 9 108 0 28-7 49-8 76 1" fill="none" stroke="#cbd5e1" stroke-width="5" stroke-linecap="round"/><path class="move" d="M42 47h28M32 62h23M183 55h22" stroke="hsl(${hue},80%,55%)" stroke-width="5" stroke-linecap="round"/>`;
  return `<svg viewBox="0 0 220 170" role="img" aria-label="${c.title} 일러스트">
    <defs><linearGradient id="g${hue}" x1="0" x2="1"><stop stop-color="hsl(${hue},95%,64%)"/><stop offset="1" stop-color="hsl(${(hue+60)%360},95%,55%)"/></linearGradient>
    <style>.move{animation:dash 1.8s ease-in-out infinite}@keyframes dash{50%{transform:translateX(10px);opacity:.35}}</style></defs>
    <circle cx="94" cy="48" r="20" fill="url(#g${hue})"/><path d="${coat}" fill="#ffffff" stroke="hsl(${hue},80%,42%)" stroke-width="6" stroke-linejoin="round"/>
    <path d="M62 90c-18 7-28 22-31 45M126 90c17 8 26 22 30 45" fill="none" stroke="hsl(${hue},80%,42%)" stroke-width="7" stroke-linecap="round"/>
    ${tool}${motion}
  </svg>`;
}

function init(){
  $("careerCount").textContent = CAREERS.length;
  $("cat").innerHTML = cats.map(c=>`<option>${c}</option>`).join("");
  $("chips").innerHTML = cats.map((c,i)=>`<button class="${i==0?'on':''}" data-cat="${c}">${c}</button>`).join("");
  $("chips").addEventListener("click", e=>{ if(e.target.dataset.cat){ $("cat").value=e.target.dataset.cat; document.querySelectorAll(".chips button").forEach(b=>b.classList.toggle("on", b.dataset.cat==e.target.dataset.cat)); render(); }});
  ["q","cat","sort"].forEach(id=>$(id).addEventListener("input", render));
  $("resetBtn").onclick=()=>{ $("q").value=""; $("cat").value="전체"; render(); };
  $("gridBtn").onclick=()=>{ $("cards").classList.remove("compact"); $("gridBtn").classList.add("active"); $("compactBtn").classList.remove("active"); };
  $("compactBtn").onclick=()=>{ $("cards").classList.add("compact"); $("compactBtn").classList.add("active"); $("gridBtn").classList.remove("active"); };
  $("themeBtn").onclick=()=>document.body.classList.toggle("darktone");
  $("closeModal").onclick=()=> $("modal").close();
  $("addCompare").onclick=()=>{ if(current) addCompare(current); };
  $("printOne").onclick=()=>{ if(current) printReport([current]); };
  $("printBtn").onclick=()=> printReport(compare.length?compare:filtered().slice(0,3));
  $("clearCompare").onclick=()=>{ compare=[]; renderCompare(); };
  $("saveMemo").onclick=saveMemo; $("loadMemo").onclick=loadMemo; $("exportMemo").onclick=exportMemo;
  render();
}
function filtered(){
  const q = $("q").value.trim().toLowerCase();
  let arr = CAREERS.filter(c=>{
    const catOK = $("cat").value==="전체" || c.category===$("cat").value;
    const hay = [c.title,c.category,c.summary,...c.majors,...c.s2015,...c.s2022,...c.keywords].join(" ").toLowerCase();
    return catOK && (!q || hay.includes(q));
  });
  if($("sort").value==="title") arr.sort((a,b)=>a.title.localeCompare(b.title,"ko"));
  if($("sort").value==="category") arr.sort((a,b)=>a.category.localeCompare(b.category,"ko"));
  return arr;
}
function render(){
  const arr = filtered();
  $("resultCount").textContent = arr.length;
  $("cards").innerHTML = arr.slice(0,96).map((c,i)=>{
    const col = colors[i%colors.length];
    return `<article class="card" style="--cardGlow:${col}">
      <span class="tag">${c.category}</span>
      <h3>${c.title}</h3>
      <div class="art">${art(c)}</div>
      <p>${c.summary}</p>
      <div class="pillbox">${c.majors.slice(0,3).map(m=>`<span class="pill">${m}</span>`).join("")}</div>
      <div class="card-actions"><button data-open="${i}">상세 팝업</button><button data-compare="${i}" class="dark">비교 담기</button></div>
    </article>`;
  }).join("") || `<div class="glass"><h3>검색 결과가 없습니다.</h3><p>다른 키워드나 계열을 선택해 보세요.</p></div>`;
  $("cards").querySelectorAll("[data-open]").forEach(btn=>btn.onclick=()=>openModal(arr[Number(btn.dataset.open)]));
  $("cards").querySelectorAll("[data-compare]").forEach(btn=>btn.onclick=(e)=>{e.stopPropagation(); addCompare(arr[Number(btn.dataset.compare)]);});
}
function openModal(c){
  current=c;
  $("modalCat").textContent=c.category; $("modalTitle").textContent=c.title; $("modalSummary").textContent=c.summary;
  $("modalArt").innerHTML=art(c,true);
  $("modalMajors").innerHTML=c.majors.map(m=>`<span class="pill">${m}</span>`).join("");
  $("modalCurriculum").innerHTML=[...c.curriculum, ...c.learn.map(x=>"배우는 내용: "+x)].map(x=>`<li>${x}</li>`).join("");
  $("modal2015").innerHTML=c.s2015.map(s=>`<span class="pill">${s}</span>`).join("");
  $("modal2022").innerHTML=c.s2022.map(s=>`<span class="pill">${s}</span>`).join("");
  $("modal").showModal();
}
function addCompare(c){
  if(compare.find(x=>x.title===c.title)) return renderCompare();
  if(compare.length>=4) compare.shift();
  compare.push(c); renderCompare();
}
function renderCompare(){
  $("compareBox").innerHTML = compare.length ? compare.map(c=>`<div class="compare-item"><b>${c.title}</b><br><small>${c.majors.slice(0,2).join(" · ")}</small></div>`).join("") : `<p>아직 선택된 직업이 없습니다.</p>`;
}
function saveMemo(){ localStorage.setItem("careerMemo", JSON.stringify({student:$("student").value,teacher:$("teacher").value,memo:$("memo").value,compare})); alert("상담 메모가 저장되었습니다."); }
function loadMemo(){ const d=JSON.parse(localStorage.getItem("careerMemo")||"{}"); $("student").value=d.student||""; $("teacher").value=d.teacher||""; $("memo").value=d.memo||""; compare=d.compare||[]; renderCompare(); }
function exportMemo(){ const blob=new Blob([$("memo").value],{type:"text/plain;charset=utf-8"}); const a=document.createElement("a"); a.href=URL.createObjectURL(blob); a.download="상담메모.txt"; a.click(); URL.revokeObjectURL(a.href); }
function printReport(items){
  const memo = $("memo").value.replaceAll("<","&lt;");
  $("reportContent").innerHTML = `<div class="report-card"><h2>상담 기본 정보</h2><p>학생: ${$("student").value||"미기재"} / 상담교사: ${$("teacher").value||"미기재"}</p><p>${memo||"상담 메모가 입력되지 않았습니다."}</p></div>` +
  items.map(c=>`<div class="report-card"><h2>${c.title}</h2><p><b>계열</b> ${c.category}</p><p>${c.summary}</p><div class="report-grid"><div><h3>관련 학과</h3><p>${c.majors.join(" · ")}</p><h3>대학 커리큘럼</h3><ul>${c.curriculum.map(x=>`<li>${x}</li>`).join("")}</ul></div><div><h3>배우는 내용</h3><ul>${c.learn.map(x=>`<li>${x}</li>`).join("")}</ul><h3>2015 개정</h3><p>${c.s2015.join(" · ")}</p><h3>2022 개정</h3><p>${c.s2022.join(" · ")}</p></div></div></div>`).join("");
  window.print();
}
init();
