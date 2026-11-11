const encode = new TextEncoder();
const xml = (value) => [...String(value ?? "")]
  .filter((character) => {
    const code = character.charCodeAt(0);
    return code === 0x09 || code === 0x0a || code === 0x0d || code > 0x1f;
  })
  .join("")
  .replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&apos;" })[character]);

const crc32 = (bytes) => {
  let crc = 0xffffffff;
  for (const byte of bytes) {
    crc ^= byte;
    for (let bit = 0; bit < 8; bit += 1) crc = (crc >>> 1) ^ ((crc & 1) ? 0xedb88320 : 0);
  }
  return (crc ^ 0xffffffff) >>> 0;
};

// XLSX is a ZIP of XML documents. Stored entries keep this small export dependency-free.
const zip = (files) => {
  const chunks = [];
  const directory = [];
  let offset = 0;
  for (const [name, content] of Object.entries(files)) {
    const filename = encode.encode(name);
    const data = encode.encode(content);
    const crc = crc32(data);
    const local = new Uint8Array(30 + filename.length);
    const localView = new DataView(local.buffer);
    localView.setUint32(0, 0x04034b50, true);
    localView.setUint16(4, 20, true);
    localView.setUint16(6, 0x800, true);
    localView.setUint16(12, 33, true);
    localView.setUint32(14, crc, true);
    localView.setUint32(18, data.length, true);
    localView.setUint32(22, data.length, true);
    localView.setUint16(26, filename.length, true);
    local.set(filename, 30);

    const central = new Uint8Array(46 + filename.length);
    const centralView = new DataView(central.buffer);
    centralView.setUint32(0, 0x02014b50, true);
    centralView.setUint16(4, 20, true);
    centralView.setUint16(6, 20, true);
    centralView.setUint16(8, 0x800, true);
    centralView.setUint16(14, 33, true);
    centralView.setUint32(16, crc, true);
    centralView.setUint32(20, data.length, true);
    centralView.setUint32(24, data.length, true);
    centralView.setUint16(28, filename.length, true);
    centralView.setUint32(42, offset, true);
    central.set(filename, 46);
    chunks.push(local, data);
    directory.push(central);
    offset += local.length + data.length;
  }
  const end = new Uint8Array(22);
  const endView = new DataView(end.buffer);
  endView.setUint32(0, 0x06054b50, true);
  endView.setUint16(8, directory.length, true);
  endView.setUint16(10, directory.length, true);
  endView.setUint32(12, directory.reduce((size, item) => size + item.length, 0), true);
  endView.setUint32(16, offset, true);
  return new Blob([...chunks, ...directory, end], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
};

export const downloadHuaweiLedger = (projects, filename = "Huawei-project-ledger.xlsx") => {
  const rows = [["Project ID", "Project Name", "Country", "Region", "Industry Sector", "Status", "Voltage", "Architecture", "Standards", "Additional Specification"]];
  projects.forEach((project) => {
    const specifications = Object.fromEntries(project.specs ?? []);
    const additional = (project.specs ?? []).filter(([label]) => !["Voltage", "Architecture", "Standards"].includes(label));
    rows.push([project.id, project.title, project.country, project.region, project.sector, project.status, specifications.Voltage, specifications.Architecture, specifications.Standards, additional.map(([label, value]) => `${label}: ${value}`).join("; ")]);
  });
  const sheetData = rows.map((row, rowIndex) => `<row r="${rowIndex + 1}">${row.map((value, columnIndex) => `<c r="${String.fromCharCode(65 + columnIndex)}${rowIndex + 1}" t="inlineStr"${rowIndex === 0 ? ' s="1"' : ""}><is><t xml:space="preserve">${xml(value)}</t></is></c>`).join("")}</row>`).join("");
  const namespace = "http://schemas.openxmlformats.org/spreadsheetml/2006/main";
  const relationships = "http://schemas.openxmlformats.org/package/2006/relationships";
  const documentRelationships = "http://schemas.openxmlformats.org/officeDocument/2006/relationships";
  const files = {
    "[Content_Types].xml": `<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/><Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/><Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/></Types>`,
    "_rels/.rels": `<Relationships xmlns="${relationships}"><Relationship Id="rId1" Type="${documentRelationships}/officeDocument" Target="xl/workbook.xml"/></Relationships>`,
    "xl/workbook.xml": `<workbook xmlns="${namespace}" xmlns:r="${documentRelationships}"><sheets><sheet name="Project Ledger" sheetId="1" r:id="rId1"/></sheets></workbook>`,
    "xl/_rels/workbook.xml.rels": `<Relationships xmlns="${relationships}"><Relationship Id="rId1" Type="${documentRelationships}/worksheet" Target="worksheets/sheet1.xml"/><Relationship Id="rId2" Type="${documentRelationships}/styles" Target="styles.xml"/></Relationships>`,
    "xl/styles.xml": `<styleSheet xmlns="${namespace}"><fonts count="2"><font><sz val="11"/><name val="Calibri"/></font><font><b/><sz val="11"/><name val="Calibri"/></font></fonts><fills count="2"><fill><patternFill patternType="none"/></fill><fill><patternFill patternType="gray125"/></fill></fills><borders count="1"><border/></borders><cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs><cellXfs count="2"><xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/><xf numFmtId="0" fontId="1" fillId="0" borderId="0" xfId="0" applyFont="1"/></cellXfs><cellStyles count="1"><cellStyle name="Normal" xfId="0" builtinId="0"/></cellStyles></styleSheet>`,
    "xl/worksheets/sheet1.xml": `<worksheet xmlns="${namespace}"><dimension ref="A1:J${rows.length}"/><sheetViews><sheetView workbookViewId="0"><pane ySplit="1" topLeftCell="A2" activePane="bottomLeft" state="frozen"/></sheetView></sheetViews><cols><col min="1" max="1" width="19" customWidth="1"/><col min="2" max="2" width="34" customWidth="1"/><col min="3" max="9" width="23" customWidth="1"/><col min="10" max="10" width="36" customWidth="1"/></cols><sheetData>${sheetData}</sheetData><autoFilter ref="A1:J${rows.length}"/></worksheet>`,
  };
  const url = URL.createObjectURL(zip(files));
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
};
