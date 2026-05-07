// =============================================
//  MATERIAL STOCK SYSTEM — script.js
// =============================================
//
//  โครงสร้างข้อมูล:
//
//  materials[] → รายการวัสดุทั้งหมด
//  {
//    id, name, size, unit, price, initQty
//  }
//
//  movements[] → ประวัติรับ/จ่ายวัสดุ
//  {
//    id, materialId, type('IN'|'OUT'),
//    qty, date, company, note
//  }
// =============================================


// ===== โหลดข้อมูลจาก LocalStorage =====
let materials = JSON.parse(localStorage.getItem('materials')) || [];
let movements = JSON.parse(localStorage.getItem('movements')) || [];
let matNextId = parseInt(localStorage.getItem('matNextId')) || 1;
let movNextId = parseInt(localStorage.getItem('movNextId')) || 1;

const LOW_STOCK = 10; // จำนวนที่ถือว่า "ใกล้หมด"


// ===== บันทึกลง LocalStorage =====
function save() {
  localStorage.setItem('materials', JSON.stringify(materials));
  localStorage.setItem('movements', JSON.stringify(movements));
  localStorage.setItem('matNextId', matNextId);
  localStorage.setItem('movNextId', movNextId);
}


// =============================================
//  คำนวณสต็อคคงเหลือของวัสดุแต่ละชิ้น
//  = สต็อคเริ่มต้น + รับเข้า - จ่ายออก
// =============================================
function calcStock(matId) {
  const mat = materials.find(m => m.id === matId);
  if (!mat) return 0;
  const totalIn  = movements
    .filter(mv => mv.materialId === matId && mv.type === 'IN')
    .reduce((s, mv) => s + mv.qty, 0);
  const totalOut = movements
    .filter(mv => mv.materialId === matId && mv.type === 'OUT')
    .reduce((s, mv) => s + mv.qty, 0);
  return mat.initQty + totalIn - totalOut;
}


// =============================================
//  ฟอร์แมตตัวเลข (ใส่ , และทศนิยม 2 ตำแหน่ง)
// =============================================
function fmt(n) {
  return n.toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}
function fmtInt(n) {
  return n.toLocaleString('th-TH');
}


// =============================================
//  SWITCH TAB
// =============================================
function switchTab(id) {
  document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));
  document.querySelectorAll('.tab-btn').forEach(el => el.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  // highlight ปุ่ม tab
  const idx = ['tab-stock','tab-movement','tab-summary','tab-expense'].indexOf(id);
  document.querySelectorAll('.tab-btn')[idx].classList.add('active');

  // รีเฟรชข้อมูล tab ที่เปิด
  if (id === 'tab-stock')    { renderMaterials(); updateStats(); }
  if (id === 'tab-movement') { renderMovements(); populateMaterialSelect(); }
  if (id === 'tab-summary')  renderSummary();
  if (id === 'tab-expense')  renderExpense();
}


// =============================================
//  TAB 1 — เพิ่มวัสดุ
// =============================================
function addMaterial() {
  const name  = document.getElementById('m-name').value.trim();
  const size  = document.getElementById('m-size').value.trim();
  const unit  = document.getElementById('m-unit').value.trim();
  const price = parseFloat(document.getElementById('m-price').value);
  const qty   = parseInt(document.getElementById('m-qty').value);

  if (!name)           return alert('⚠️ กรุณากรอกชื่อวัสดุ');
  if (!unit)           return alert('⚠️ กรุณากรอกหน่วย');
  if (isNaN(price) || price < 0) return alert('⚠️ กรุณากรอกราคาให้ถูกต้อง');
  if (isNaN(qty)   || qty   < 0) return alert('⚠️ กรุณากรอกสต็อคเริ่มต้นให้ถูกต้อง');

  materials.push({ id: matNextId++, name, size, unit, price, initQty: qty });
  save();
  renderMaterials();
  updateStats();

  // ล้างฟอร์ม
  ['m-name','m-size','m-unit','m-price','m-qty'].forEach(id => document.getElementById(id).value = '');
  document.getElementById('m-name').focus();
}


// ===== แก้ไขวัสดุ =====
function editMaterial(id) {
  const mat = materials.find(m => m.id === id);
  if (!mat) return;

  const name  = prompt('ชื่อวัสดุ:', mat.name);
  if (name === null) return;
  const size  = prompt('ขนาด / สเปค:', mat.size);
  if (size === null) return;
  const unit  = prompt('หน่วย:', mat.unit);
  if (unit === null) return;
  const price = parseFloat(prompt('ราคา/หน่วย (฿):', mat.price));
  if (isNaN(price)) return alert('⚠️ ราคาไม่ถูกต้อง');

  mat.name = name.trim();
  mat.size = size.trim();
  mat.unit = unit.trim();
  mat.price = price;
  save();
  renderMaterials();
  updateStats();
  renderSummary();
  renderExpense();
}


// ===== ลบวัสดุ =====
function deleteMaterial(id) {
  const hasMove = movements.some(mv => mv.materialId === id);
  if (hasMove) {
    if (!confirm('⚠️ วัสดุนี้มีประวัติการเคลื่อนไหว ถ้าลบจะหายทั้งหมด ยืนยันไหม?')) return;
    movements = movements.filter(mv => mv.materialId !== id);
  } else {
    if (!confirm('❓ ยืนยันการลบวัสดุนี้?')) return;
  }
  materials = materials.filter(m => m.id !== id);
  save();
  renderMaterials();
  updateStats();
}


// ===== แสดงตารางวัสดุ =====
function renderMaterials() {
  const keyword = (document.getElementById('search-material')?.value || '').toLowerCase();
  const list = materials.filter(m =>
    m.name.toLowerCase().includes(keyword) ||
    (m.size || '').toLowerCase().includes(keyword)
  );

  const tbody  = document.getElementById('tbody-materials');
  const tbl    = document.getElementById('tbl-materials');
  const empty  = document.getElementById('empty-materials');

  if (!list.length) {
    tbl.style.display = 'none';
    empty.style.display = 'block';
    return;
  }
  tbl.style.display = 'table';
  empty.style.display = 'none';

  tbody.innerHTML = list.map((m, i) => {
    const stock = calcStock(m.id);
    const val   = stock * m.price;
    const isLow = stock <= LOW_STOCK;
    return `<tr>
      <td style="color:#718096">${i + 1}</td>
      <td><strong>${m.name}</strong></td>
      <td>${m.size || '-'}</td>
      <td>${m.unit}</td>
      <td><strong>${fmtInt(stock)}</strong></td>
      <td>฿${fmt(m.price)}</td>
      <td>฿${fmt(val)}</td>
      <td>${isLow
        ? '<span class="badge low">⚠️ ต่ำ</span>'
        : '<span class="badge ok">✅ ปกติ</span>'}</td>
      <td>
        <button class="btn-edit"   onclick="editMaterial(${m.id})">✏️ แก้ไข</button>
        <button class="btn-delete" onclick="deleteMaterial(${m.id})">🗑️ ลบ</button>
      </td>
    </tr>`;
  }).join('');
}


// ===== อัปเดตสถิติ (Tab 1) =====
function updateStats() {
  const total    = materials.length;
  const totalVal = materials.reduce((s, m) => s + calcStock(m.id) * m.price, 0);
  const lowCount = materials.filter(m => calcStock(m.id) <= LOW_STOCK).length;

  document.getElementById('st-total-items').textContent = `${fmtInt(total)} รายการ`;
  document.getElementById('st-total-value').textContent = `฿${fmt(totalVal)}`;
  document.getElementById('st-low-stock').textContent   = `${lowCount} รายการ`;
  document.getElementById('st-movements').textContent   = `${fmtInt(movements.length)} ครั้ง`;
}


// =============================================
//  TAB 2 — รับ / จ่ายวัสดุ
// =============================================

// เติม dropdown วัสดุ
function populateMaterialSelect() {
  const sel = document.getElementById('mv-material');
  const cur = sel.value;
  sel.innerHTML = '<option value="">-- เลือกวัสดุ --</option>';
  materials.forEach(m => {
    const stock = calcStock(m.id);
    sel.innerHTML += `<option value="${m.id}">${m.name}${m.size ? ' (' + m.size + ')' : ''} — คงเหลือ ${fmtInt(stock)} ${m.unit}</option>`;
  });
  if (cur) sel.value = cur;
}

// แสดง/ซ่อนช่องบริษัท
function toggleCompanyField() {
  const type = document.getElementById('mv-type').value;
  document.getElementById('field-company').style.opacity = type === 'IN' ? '1' : '.45';
}

// เพิ่มรายการเคลื่อนไหว
function addMovement() {
  const type    = document.getElementById('mv-type').value;
  const matId   = parseInt(document.getElementById('mv-material').value);
  const qty     = parseInt(document.getElementById('mv-qty').value);
  const date    = document.getElementById('mv-date').value;
  const company = document.getElementById('mv-company').value.trim();
  const note    = document.getElementById('mv-note').value.trim();

  if (!matId)          return alert('⚠️ กรุณาเลือกวัสดุ');
  if (isNaN(qty) || qty <= 0) return alert('⚠️ กรุณากรอกจำนวนให้ถูกต้อง');
  if (!date)           return alert('⚠️ กรุณาเลือกวันที่');
  if (type === 'IN' && !company) return alert('⚠️ กรุณากรอกชื่อบริษัทผู้ส่ง');

  // ตรวจสต็อคกรณีจ่ายออก
  if (type === 'OUT') {
    const stock = calcStock(matId);
    if (qty > stock) return alert(`⚠️ สต็อคไม่พอ! คงเหลือ ${fmtInt(stock)} ชิ้น`);
  }

  movements.push({ id: movNextId++, materialId: matId, type, qty, date, company, note });
  save();
  renderMovements();
  renderMaterials();
  updateStats();
  populateMaterialSelect();

  // ล้างฟอร์ม (ยกเว้น type และ date เพราะมักกรอกต่อเนื่อง)
  document.getElementById('mv-material').value = '';
  document.getElementById('mv-qty').value      = '';
  document.getElementById('mv-company').value  = '';
  document.getElementById('mv-note').value     = '';
}

// ลบรายการเคลื่อนไหว
function deleteMovement(id) {
  if (!confirm('❓ ยืนยันการลบรายการนี้?')) return;
  movements = movements.filter(mv => mv.id !== id);
  save();
  renderMovements();
  renderMaterials();
  updateStats();
  populateMaterialSelect();
}

// แสดงตารางประวัติ
function renderMovements() {
  const typeFilter = document.getElementById('filter-mv-type')?.value || '';
  const keyword    = (document.getElementById('search-movement')?.value || '').toLowerCase();

  let list = [...movements].reverse(); // ล่าสุดขึ้นก่อน
  if (typeFilter) list = list.filter(mv => mv.type === typeFilter);
  if (keyword)    list = list.filter(mv => {
    const mat = materials.find(m => m.id === mv.materialId);
    return (mat?.name || '').toLowerCase().includes(keyword) ||
           (mv.company || '').toLowerCase().includes(keyword) ||
           (mv.note    || '').toLowerCase().includes(keyword);
  });

  const tbody = document.getElementById('tbody-movements');
  const tbl   = document.getElementById('tbl-movements');
  const empty = document.getElementById('empty-movements');

  if (!list.length) {
    tbl.style.display = 'none';
    empty.style.display = 'block';
    return;
  }
  tbl.style.display = 'table';
  empty.style.display = 'none';

  tbody.innerHTML = list.map((mv, i) => {
    const mat  = materials.find(m => m.id === mv.materialId);
    const name = mat ? mat.name : '(ลบแล้ว)';
    const size = mat?.size || '-';
    const unit = mat?.unit || '-';
    const badge = mv.type === 'IN'
      ? '<span class="badge in">📥 รับเข้า</span>'
      : '<span class="badge out">📤 จ่ายออก</span>';
    return `<tr>
      <td style="color:#718096">${i + 1}</td>
      <td>${mv.date}</td>
      <td>${badge}</td>
      <td><strong>${name}</strong></td>
      <td>${size}</td>
      <td>${fmtInt(mv.qty)}</td>
      <td>${unit}</td>
      <td>${mv.company || '-'}</td>
      <td>${mv.note    || '-'}</td>
      <td><button class="btn-delete" onclick="deleteMovement(${mv.id})">🗑️</button></td>
    </tr>`;
  }).join('');
}


// =============================================
//  TAB 3 — สรุปคงเหลือ
// =============================================
function renderSummary() {
  const tbody = document.getElementById('tbody-summary');
  const tbl   = document.getElementById('tbl-summary');
  const empty = document.getElementById('empty-summary');
  const footer = document.getElementById('summary-footer');

  if (!materials.length) {
    tbl.style.display = 'none';
    empty.style.display = 'block';
    footer.innerHTML = '';
    return;
  }
  tbl.style.display = 'table';
  empty.style.display = 'none';

  let grandVal = 0;

  tbody.innerHTML = materials.map((m, i) => {
    const totalIn  = movements.filter(mv => mv.materialId === m.id && mv.type === 'IN').reduce((s, mv) => s + mv.qty, 0);
    const totalOut = movements.filter(mv => mv.materialId === m.id && mv.type === 'OUT').reduce((s, mv) => s + mv.qty, 0);
    const stock    = m.initQty + totalIn - totalOut;
    const val      = stock * m.price;
    const isLow    = stock <= LOW_STOCK;
    grandVal += val;

    return `<tr>
      <td style="color:#718096">${i + 1}</td>
      <td><strong>${m.name}</strong></td>
      <td>${m.size || '-'}</td>
      <td>${m.unit}</td>
      <td>${fmtInt(m.initQty)}</td>
      <td style="color:#1a5276">${fmtInt(totalIn)}</td>
      <td style="color:#7b341e">${fmtInt(totalOut)}</td>
      <td><strong>${fmtInt(stock)}</strong></td>
      <td>฿${fmt(m.price)}</td>
      <td>฿${fmt(val)}</td>
      <td>${isLow
        ? '<span class="badge low">⚠️ ต่ำ</span>'
        : '<span class="badge ok">✅ ปกติ</span>'}</td>
    </tr>`;
  }).join('');

  footer.innerHTML = `
    มูลค่าวัสดุคงเหลือทั้งหมด: <span>฿${fmt(grandVal)}</span>
    &nbsp;|&nbsp; จำนวนรายการ: <span>${materials.length} รายการ</span>
    &nbsp;|&nbsp; วัสดุใกล้หมด: <span style="color:#e53e3e">${materials.filter(m => calcStock(m.id) <= LOW_STOCK).length} รายการ</span>
  `;
}


// =============================================
//  TAB 4 — สรุปค่าใช้จ่าย
// =============================================
function renderExpense() {
  // คำนวณยอดรับเข้าทั้งหมด
  const inMovements = movements.filter(mv => mv.type === 'IN');

  let totalIn  = 0;
  let totalOut = 0;

  inMovements.forEach(mv => {
    const mat = materials.find(m => m.id === mv.materialId);
    if (mat) totalIn += mv.qty * mat.price;
  });

  movements.filter(mv => mv.type === 'OUT').forEach(mv => {
    const mat = materials.find(m => m.id === mv.materialId);
    if (mat) totalOut += mv.qty * mat.price;
  });

  const stockVal = materials.reduce((s, m) => s + calcStock(m.id) * m.price, 0);

  document.getElementById('exp-total-in').textContent  = `฿${fmt(totalIn)}`;
  document.getElementById('exp-total-out').textContent = `฿${fmt(totalOut)}`;
  document.getElementById('exp-stock-val').textContent = `฿${fmt(stockVal)}`;

  // ---- สรุปแยกบริษัท ----
  const companyMap = {};
  inMovements.forEach(mv => {
    const mat = materials.find(m => m.id === mv.materialId);
    const key = mv.company || '(ไม่ระบุบริษัท)';
    if (!companyMap[key]) companyMap[key] = { count: 0, total: 0 };
    companyMap[key].count++;
    if (mat) companyMap[key].total += mv.qty * mat.price;
  });

  const companyList = Object.entries(companyMap).sort((a, b) => b[1].total - a[1].total);

  const tbodyC = document.getElementById('tbody-by-company');
  const emptyC = document.getElementById('empty-by-company');
  const tblC   = document.getElementById('tbl-by-company');

  if (!companyList.length) {
    tblC.style.display = 'none';
    emptyC.style.display = 'block';
  } else {
    tblC.style.display = 'table';
    emptyC.style.display = 'none';
    tbodyC.innerHTML = companyList.map(([name, d], i) => `<tr>
      <td style="color:#718096">${i + 1}</td>
      <td><strong>${name}</strong></td>
      <td>${fmtInt(d.count)} รายการ</td>
      <td><strong>฿${fmt(d.total)}</strong></td>
    </tr>`).join('');
  }

  // ---- รายละเอียดทุกรายการ IN ----
  const sorted = [...inMovements].sort((a, b) => b.date.localeCompare(a.date));
  const tbodyD = document.getElementById('tbody-expense-detail');
  const emptyD = document.getElementById('empty-expense-detail');
  const tblD   = document.getElementById('tbl-expense-detail');

  if (!sorted.length) {
    tblD.style.display = 'none';
    emptyD.style.display = 'block';
  } else {
    tblD.style.display = 'table';
    emptyD.style.display = 'none';
    tbodyD.innerHTML = sorted.map((mv, i) => {
      const mat   = materials.find(m => m.id === mv.materialId);
      const name  = mat ? mat.name : '(ลบแล้ว)';
      const size  = mat?.size  || '-';
      const unit  = mat?.unit  || '-';
      const price = mat?.price || 0;
      const total = mv.qty * price;
      return `<tr>
        <td style="color:#718096">${i + 1}</td>
        <td>${mv.date}</td>
        <td><strong>${name}</strong></td>
        <td>${size}</td>
        <td>${fmtInt(mv.qty)}</td>
        <td>${unit}</td>
        <td>฿${fmt(price)}</td>
        <td><strong>฿${fmt(total)}</strong></td>
        <td>${mv.company || '-'}</td>
        <td>${mv.note    || '-'}</td>
      </tr>`;
    }).join('');
  }
}


// =============================================
//  INIT — รันเมื่อโหลดหน้า
// =============================================
(function init() {
  // ตั้งวันที่วันนี้เป็น default
  const today = new Date().toISOString().split('T')[0];
  document.getElementById('mv-date').value = today;

  populateMaterialSelect();
  renderMaterials();
  updateStats();
  toggleCompanyField();
})();