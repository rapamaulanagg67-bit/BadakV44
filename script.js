const P=[20,30,70,100,130,190,399,4999];let selected=null,working=false,filter="all";
let d=JSON.parse(localStorage.getItem("badakV4")||'{"name":"Badak User","avatar":"🦏","phone":"","history":[]}');
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const save=()=>localStorage.setItem("badakV4",JSON.stringify(d));
function toast(t){$("#toast").textContent=t;$("#toast").classList.add("show");clearTimeout(window.tt);window.tt=setTimeout(()=>$("#toast").classList.remove("show"),2200)}
function closeSplash(){if($("#splash").classList.contains("hide"))return;$("#splash").classList.add("hide");setTimeout(()=>{$("#splash").remove();$("#app").classList.remove("hidden")},420)}
$("#skip").onclick=closeSplash;$("#introVideo").onended=closeSplash;setTimeout(closeSplash,4000);

function packages(){ $("#packages").innerHTML=P.map(x=>`<button class="package ${selected===x?"selected":""}" data-p="${x}"><b>${x.toLocaleString("id-ID")}</b><small>BADAK</small><em>✓</em></button>`).join("");$$(".package").forEach(b=>b.onclick=()=>{selected=+b.dataset.p;$("#chosen").textContent=`${selected.toLocaleString("id-ID")} Badak dipilih`;packages()})}
packages();

function page(id){$$(".page").forEach(x=>x.classList.toggle("active",x.id===id));$$(".nav").forEach(x=>x.classList.toggle("active",x.dataset.page===id));if(id==="history")renderHistory();if(id==="profile")renderProfile()}
$$(".nav").forEach(x=>x.onclick=()=>page(x.dataset.page));

$("#phone").oninput=e=>e.target.value=e.target.value.replace(/\D/g,"").slice(0,15);
$("#confirm").onclick=()=>{if(working)return;if(!selected)return toast("Pilih paket Badak terlebih dahulu.");let n=$("#phone").value;if(n.length<9)return toast("Silahkan isi nomor terlebih dahulu.");d.phone=n;save();process()};

function process(){working=true;$("#process").classList.remove("hidden");$("#confirm").disabled=true;$("#confirm").textContent="SEDANG DIPROSES...";let n=0;$("#procTitle").textContent=`Memproses ${selected} Badak...`;let timer=setInterval(()=>{n++;$("#procNumber").textContent=n;$("#percent").textContent=n+"%";$("#bar").style.width=n+"%";if(n<35)$("#procMsg").textContent="Menyiapkan proses...";else if(n<70)$("#procMsg").textContent="BADAK sedang diproses...";else if(n<100)$("#procMsg").textContent="Menyelesaikan proses...";else{$("#procMsg").textContent="Proses selesai dengan sukses.";$("#procTitle").textContent="BADAK SUKSES ✅";$$(".steps span").forEach(x=>x.classList.add("done"));clearInterval(timer);addHistory("sukses");toast("BADAK SUKSES ✅");setTimeout(()=>{$("#confirm").disabled=false;$("#confirm").textContent="KONFIRMASI →";working=false},900)}},28)}

function addHistory(status){d.history.unshift({id:Date.now(),package:selected,phone:d.phone,status,time:new Date().toLocaleString("id-ID",{dateStyle:"short",timeStyle:"short"})});d.history=d.history.slice(0,50);save();stats()}
function stats(){let h=d.history,ok=h.filter(x=>x.status==="sukses").length;$("#totalStat").textContent=h.length;$("#successStat").textContent=ok;$("#failedStat").textContent=h.filter(x=>x.status==="gagal").length;$("#pTotal").textContent=h.length;$("#pSuccess").textContent=ok;$("#pPackages").textContent=new Set(h.map(x=>x.package)).size}
function mask(n){return n?n.slice(0,3)+"••••"+n.slice(-3):"-"}
function renderHistory(){let h=d.history.filter(x=>filter==="all"||x.status===filter);$("#historyList").innerHTML=h.length?h.map(x=>`<div class="historyItem"><div class="hi">${x.status==="sukses"?"✅":"❌"}</div><div class="hinfo"><b>${x.package.toLocaleString("id-ID")} BADAK</b><small>${mask(x.phone)} • ${x.time}</small></div><span class="hs ${x.status==="sukses"?"ok":"bad"}">${x.status==="sukses"?"BADAK SUKSES":"BADAK GAGAL"}</span></div>`).join(""):'<div class="empty">Belum ada riwayat.</div>'}
$$(".filter").forEach(b=>b.onclick=()=>{$$(".filter").forEach(x=>x.classList.remove("active"));b.classList.add("active");filter=b.dataset.filter;renderHistory()});

function renderProfile(){$("#welcomeName").textContent=d.name;$("#profileName").textContent=d.name;$("#avatar").textContent=d.avatar;$("#profilePhone").textContent=d.phone?"+62 "+d.phone:"Nomor belum diatur";stats()}
renderProfile();stats();

function nameModal(){$("#nameInput").value=d.name;$("#modal").classList.remove("hidden")}
$("#nameBtn").onclick=nameModal;$("#nameBtn2").onclick=nameModal;
$("#close").onclick=()=>$("#modal").classList.add("hidden");
$("#saveName").onclick=()=>{let n=$("#nameInput").value.trim();if(!n)return toast("Nama tidak boleh kosong.");d.name=n;save();renderProfile();$("#modal").classList.add("hidden");toast("Nama berhasil diubah.")};
$("#avatarBtn").onclick=()=>$("#avatarModal").classList.remove("hidden");$("#closeAvatar").onclick=()=>$("#avatarModal").classList.add("hidden");
$$(".avatars button").forEach(b=>b.onclick=()=>{d.avatar=b.textContent;save();renderProfile();$("#avatarModal").classList.add("hidden");toast("Avatar berhasil diubah.")});
$("#clearBtn").onclick=()=>{if(confirm("Hapus semua riwayat?")){d.history=[];save();stats();renderHistory();toast("Riwayat dihapus.")}};

$("#settingsBtn").onclick=()=>$("#settings").classList.remove("hidden");$("#closeSettings").onclick=()=>$("#settings").classList.add("hidden");
$("#fx").onchange=e=>document.body.classList.toggle("noFx",!e.target.checked);
$("#dark").onchange=e=>document.body.classList.toggle("ultra",e.target.checked);
