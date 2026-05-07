/* =============================================
   MATERIAL STOCK SYSTEM — style.css
============================================= */

* { margin:0; padding:0; box-sizing:border-box; }

body {
  font-family: 'Sarabun','Segoe UI',sans-serif;
  font-size: 15px;
  background: #f0f4f8;
  color: #2d3748;
  min-height: 100vh;
}

/* ---- HEADER ---- */
.header {
  background: #1a3a5c;
  color: white;
  padding: 18px 0;
  box-shadow: 0 2px 8px rgba(0,0,0,.18);
}
.header-content {
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 20px;
}
.header h1 { font-size:22px; font-weight:700; }
.header p  { font-size:12px; opacity:.65; margin-top:3px; }

/* ---- TABS NAV ---- */
.tabs-nav {
  background: white;
  border-bottom: 1px solid #e2e8f0;
  position: sticky;
  top: 0;
  z-index: 100;
}
.tabs-inner {
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  gap: 4px;
}
.tab-btn {
  padding: 14px 18px;
  background: none;
  border: none;
  border-bottom: 3px solid transparent;
  font-size: 14px;
  font-weight: 600;
  color: #718096;
  cursor: pointer;
  transition: all .2s;
  font-family: inherit;
  white-space: nowrap;
}
.tab-btn:hover  { color: #1a3a5c; background: #f7fafc; }
.tab-btn.active { color: #1a3a5c; border-bottom-color: #1a3a5c; }

/* ---- CONTAINER ---- */
.container {
  max-width: 1100px;
  margin: 0 auto;
  padding: 24px 20px;
}

/* ---- TAB CONTENT ---- */
.tab-content { display: none; }
.tab-content.active { display: block; }

/* ---- CARD ---- */
.card {
  background: white;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  padding: 20px 24px;
  margin-bottom: 20px;
  box-shadow: 0 1px 4px rgba(0,0,0,.05);
}
.card h2 {
  font-size: 15px;
  font-weight: 700;
  color: #2d3748;
  margin-bottom: 16px;
}

/* ---- STATS GRID ---- */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 14px;
  margin-bottom: 20px;
}
.stat-card {
  background: white;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  padding: 16px 18px;
  box-shadow: 0 1px 3px rgba(0,0,0,.05);
}
.stat-card.warning { border-left: 4px solid #e53e3e; }
.stat-card.info    { border-left: 4px solid #3182ce; }
.stat-label { font-size:12px; color:#718096; margin-bottom:6px; }
.stat-value { font-size:20px; font-weight:700; color:#1a3a5c; }
.stat-value.green { color: #276749; }
.stat-card.warning .stat-value { color:#e53e3e; }
.stat-card.info    .stat-value { color:#2b6cb0; }

/* ---- FORM GRID ---- */
.form-grid { display:grid; gap:12px; }
.form-grid-5 { grid-template-columns: repeat(5,1fr); }
.form-grid-3 { grid-template-columns: repeat(3,1fr); }

.form-group { display:flex; flex-direction:column; gap:5px; }
.form-group label {
  font-size: 12px;
  font-weight: 600;
  color: #4a5568;
}
.form-group input,
.form-group select {
  padding: 9px 12px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 14px;
  color: #2d3748;
  background: #f7fafc;
  outline: none;
  transition: border-color .2s;
  font-family: inherit;
}
.form-group input:focus,
.form-group select:focus {
  border-color: #1a3a5c;
  background: white;
}

/* ---- BUTTONS ---- */
.btn-primary {
  padding: 9px 22px;
  background: #1a3a5c;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  font-family: inherit;
  transition: background .2s, transform .1s;
}
.btn-primary:hover  { background: #2c5282; }
.btn-primary:active { transform: scale(.97); }

.btn-outline {
  padding: 7px 16px;
  background: white;
  color: #4a5568;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  font-family: inherit;
  transition: background .2s;
}
.btn-outline:hover { background: #f7fafc; }

/* ---- TABLE HEADER ---- */
.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 14px;
  flex-wrap: wrap;
  gap: 10px;
}
.table-header h2 { margin-bottom: 0; }
.table-header input,
.table-header select {
  padding: 8px 12px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 13px;
  outline: none;
  font-family: inherit;
  background: #f7fafc;
  transition: border-color .2s;
}
.table-header input:focus,
.table-header select:focus { border-color: #1a3a5c; }

/* ---- TABLE ---- */
.table-wrapper { overflow-x: auto; }

table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
}
th {
  text-align: left;
  padding: 10px 12px;
  background: #f7fafc;
  border-bottom: 1px solid #e2e8f0;
  font-size: 11px;
  font-weight: 700;
  color: #718096;
  text-transform: uppercase;
  letter-spacing: .4px;
  white-space: nowrap;
}
td {
  padding: 11px 12px;
  border-bottom: 1px solid #edf2f7;
  color: #2d3748;
  vertical-align: middle;
}
tbody tr:last-child td { border-bottom: none; }
tbody tr:hover { background: #f7fafc; }

/* ---- BADGE ---- */
.badge {
  display: inline-block;
  padding: 3px 10px;
  border-radius: 20px;
  font-size: 11px;
  font-weight: 700;
}
.badge.ok    { background:#c6f6d5; color:#276749; }
.badge.low   { background:#fed7d7; color:#c53030; }
.badge.in    { background:#bee3f8; color:#1a5276; }
.badge.out   { background:#feebc8; color:#7b341e; }

/* ---- ACTION BUTTONS IN TABLE ---- */
.btn-edit {
  padding: 3px 10px;
  background: #ebf8ff;
  color: #2b6cb0;
  border: 1px solid #bee3f8;
  border-radius: 6px;
  font-size: 12px;
  cursor: pointer;
  margin-right: 5px;
  font-family: inherit;
}
.btn-edit:hover { background: #bee3f8; }

.btn-delete {
  padding: 3px 10px;
  background: #fff5f5;
  color: #c53030;
  border: 1px solid #fed7d7;
  border-radius: 6px;
  font-size: 12px;
  cursor: pointer;
  font-family: inherit;
}
.btn-delete:hover { background: #fed7d7; }

/* ---- SUMMARY FOOTER ---- */
.summary-footer {
  margin-top: 16px;
  padding: 14px 16px;
  background: #f7fafc;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  font-size: 14px;
  display: flex;
  gap: 32px;
  flex-wrap: wrap;
}
.summary-footer span { font-weight: 700; color: #1a3a5c; }

/* ---- EMPTY STATE ---- */
.empty-state {
  text-align: center;
  padding: 40px;
  color: #a0aec0;
  display: none;
}
.empty-state p:first-child { font-size:36px; margin-bottom:8px; }
.empty-state p:last-child  { font-size:14px; }

/* ---- RESPONSIVE ---- */
@media (max-width: 768px) {
  .stats-grid   { grid-template-columns: repeat(2,1fr); }
  .form-grid-5,
  .form-grid-3  { grid-template-columns: 1fr; }
  .table-header { flex-direction: column; align-items: flex-start; }
}
@media (max-width: 480px) {
  .stats-grid { grid-template-columns: 1fr; }
  .tabs-inner { overflow-x: auto; padding-bottom: 4px; }
}

/* ---- PRINT ---- */
@media print {
  /* ซ่อนส่วนที่ไม่ต้องพิมพ์ */
  .tabs-nav         { display: none !important; }
  .btn-primary      { display: none !important; }
  .btn-outline      { display: none !important; }
  .btn-edit         { display: none !important; }
  .btn-delete       { display: none !important; }
  .header           { display: none !important; }
  #tab-stock  .card:first-of-type { display: none !important; } /* ฟอร์มเพิ่มวัสดุ */
  #tab-movement .card:first-of-type { display: none !important; } /* ฟอร์มบันทึก */
  .table-header input,
  .table-header select { display: none !important; }

  /* แสดงทุก tab ตอนพิมพ์ */
  .tab-content { display: block !important; }

  /* ตาราง */
  table { font-size: 11px; }
  th, td { padding: 6px 8px; }

  body { background: white; }
  .card { box-shadow: none; border: 1px solid #ccc; margin-bottom: 12px; }
  .stats-grid { grid-template-columns: repeat(4, 1fr); }
}
