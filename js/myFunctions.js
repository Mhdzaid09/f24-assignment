function readFileAsDataURL(file){
  return new Promise((res,rej)=>{
    if(!file) return res(null);
    const fr=new FileReader();
    fr.onload=()=>res(fr.result);
    fr.onerror=()=>rej("file read error");
    fr.readAsDataURL(file);
  });
}

function validateAppData(data){
  const errors=[];
  const nameRe=/^[A-Za-z]+$/;
  if(!data.name||!nameRe.test(data.name)) errors.push("اسم التطبيق يجب أن يكون أحرف إنجليزية فقط");
  if(!data.manufacturer||!nameRe.test(data.manufacturer)) errors.push("اسم الشركة يجب أن يكون أحرف إنجليزية فقط");
  try{ new URL(data.website); }catch(e){ errors.push("رابط الموقع غير صحيح"); }
  if(!data.category) errors.push("اختر مجال الاستخدام");
  if(!data.description||data.description.length<5) errors.push("اكتب شرح مختصر");
  return errors;
}

function getApps(){
  const raw=localStorage.getItem('appsList');
  if(!raw) return [];
  try{ return JSON.parse(raw);}catch(e){return[];}
}
function saveApps(arr){ localStorage.setItem('appsList',JSON.stringify(arr)); }
function addAppObject(obj){
  const arr=getApps();
  arr.push(obj);
  saveApps(arr);
}

function renderAppsTable($body){
  const apps=getApps();
  $body.empty();
  if(apps.length===0){
    $body.append('<tr><td colspan="6">لا يوجد تطبيقات بعد.</td></tr>');
    return;
  }
  apps.forEach((app,idx)=>{
    const tr=$(`
      <tr>
        <td><button class="show-details" data-idx="${idx}">عرض</button></td>
        <td>${app.name}</td>
        <td>${app.manufacturer}</td>
        <td>${app.isFree?'مجاني':'مدفوع'}</td>
        <td>${app.category}</td>
        <td><a href="${app.website}" target="_blank">زيارة</a></td>
      </tr>
    `);
    const det=$(`
      <tr class="details-row" style="display:none;">
        <td colspan="6">
          <div class="details">
            <p><strong>شرح:</strong> ${escapeHtml(app.description)}</p>
            ${app.logo?`<img src="${app.logo}" alt="logo">`:''}
            ${app.audio?`<audio controls src="${app.audio}"></audio>`:''}
            ${app.video?`<video controls width="300" src="${app.video}"></video>`:''}
          </div>
        </td>
      </tr>
    `);
    $body.append(tr).append(det);
  });
  $('.show-details').off('click').on('click',function(){
    const row=$(this).closest('tr').next('.details-row');
    row.toggle();
  });
}

function escapeHtml(t){ return $('<div>').text(t).html(); }

function seedExampleApps(){
  if(getApps().length===0){
    saveApps([{name:"SampleApp",manufacturer:"SampleCo",website:"https://example.com",isFree:true,category:"Education",description:"تطبيق تجريبي",logo:null,audio:null,video:null}]);
  }
}
