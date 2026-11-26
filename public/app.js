const $=id=>document.getElementById(id);
const label=m=>`${String(Math.floor(m/60)).padStart(2,'0')}:${String(m%60).padStart(2,'0')}`;
let fixture;
async function api(input){
 const r=await fetch('/api/check',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(input)});
 if(!r.ok)throw Error('Could not complete the check. Please try again.');
 return r.json();
}
function show(result){
 const box=$('result');
 box.className='result '+(result.available?'available':result.reasonCode.startsWith('INVALID')||result.reasonCode==='PAST_START'?'invalid':'unavailable');
 $('decision').textContent=result.available?'Available':result.reasonCode.startsWith('INVALID')||result.reasonCode==='PAST_START'?'Check your input':'Unavailable';
 $('message').textContent=result.message;
 $('reason-code').textContent=result.reasonCode;
}
function clear(){ $('result').className='result';$('decision').textContent='Ready to check';$('message').textContent='Choose a start time and duration to see the result.';$('reason-code').textContent=''; }
$('checker').addEventListener('submit',async e=>{
 e.preventDefault(); const value=$('start').value;const [h,m]=value.split(':').map(Number);
 const input={start:value?h*60+m:null,duration:$('duration').value.trim()===''?null:Number($('duration').value),blocked:$('blocked').checked};
 $('check').disabled=true;
 try{show(await api(input));}catch(error){show({available:false,reasonCode:'INVALID_REQUEST',message:error.message});}
 finally{$('check').disabled=false;}
});
for(const id of ['start','duration','blocked'])$(id).addEventListener('input',clear);
async function init(){
 try{const r=await fetch('/api/fixture');if(!r.ok)throw Error();fixture=await r.json();
  for(const b of fixture.bookings){const row=document.createElement('div');row.className='booking';const bar=document.createElement('div');bar.className='line';const text=document.createElement('div');const time=document.createElement('strong');time.textContent=`${label(b.start)} - ${label(b.end)}`;const caption=document.createElement('p');caption.textContent='Existing fictional booking';text.append(time,caption);row.append(bar,text);$('bookings').append(row);}
 }catch{$('bookings').textContent='Schedule could not be loaded. Refresh to try again.';}
}
$('run-tests').addEventListener('click',async()=>{
 $('run-tests').disabled=true;$('test-rows').replaceChildren();$('test-summary').textContent='Running identical acceptance cases...';
 try{const cases=await (await fetch('/cases.json')).json();const before=JSON.stringify(await(await fetch('/api/fixture')).json());let pass=0;
 for(const t of cases){let observed;let ok;
  if(t.operation==='integrity'){observed={unchanged:JSON.stringify(await(await fetch('/api/fixture')).json())===before};ok=observed.unchanged;}
  else{observed=await api(t.input);ok=observed.available===t.expected.available&&observed.reasonCode===t.expected.reasonCode;}
  if(ok)pass++;const tr=document.createElement('tr');for(const v of [t.id,t.case,t.expected.reasonCode||'UNCHANGED',observed.reasonCode||(observed.unchanged?'UNCHANGED':'CHANGED'),ok?'PASS':'FAIL']){const td=document.createElement('td');td.textContent=v;tr.append(td);}tr.lastChild.className=ok?'pass':'fail';$('test-rows').append(tr);
 }
 $('test-summary').textContent=`${pass} / ${cases.length} passed. Existing bookings unchanged: ${JSON.stringify(await(await fetch('/api/fixture')).json())===before?'yes':'no'}.`;
 }catch{$('test-summary').textContent='Tests could not complete. Check that the local server is running.';}
 finally{$('run-tests').disabled=false;}
});
init();
