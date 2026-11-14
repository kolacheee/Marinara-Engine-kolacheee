const B="http://127.0.0.1:7871",H={"content-type":"application/json",origin:B};
const r=await fetch(B+"/api/professor-mari/workspace/prompt",{method:"POST",headers:H,body:JSON.stringify({chatId:process.argv[2],message:process.argv[3],debugMode:true,context:{source:"settings",capability:"create"}})});
const t=await r.text();for(const c of t.split("\n\n")){const d=c.replace(/^data: ?/m,"");try{const e=JSON.parse(d);if(!["token","draft","reasoning"].includes(e.type))console.log(e.type,JSON.stringify(e.data).slice(0,400))}catch{}}
