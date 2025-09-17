import { i18n, } from "@/tools/i18n.js";

const exportToExcel = function (e, basename) {
    let table = findTable(e);
    if (!table) return;

    basename = getBasename(basename, table);
    let rows = table.querySelectorAll('tr:not([data-no-export])');
    if (!rows.length) return;

    let { headers, data } = extractDataFromRows(rows);

    import("xlsx")
        .then((XLSX) => {
            const workbook = XLSX.utils.book_new();
            const worksheet = XLSX.utils.json_to_sheet(data, headers);
            XLSX.utils.book_append_sheet(workbook, worksheet, basename);
            XLSX.writeFile(workbook, basename + '.xlsx', { compression: true });
        })
        .catch((error) => {
            console.error("Error al cargar la librería XLSX:", error);
        });
};

function findTable(e) {
    let context = e?.target || e;
    let table = null;

    while (context) {
        table = context.querySelector('table:not([data-no-export]), [data-exportable]');
        if (table || !context.parentNode) break;
        context = context.parentNode;
    }

    return table;
}

function getBasename(basename, table) {
    if (!basename) {
        basename = table.getAttribute('data-download-name') || i18n('downloaded-table');
    }

    return basename;
}

function extractDataFromRows(rows) {
    let headers = [];
    let data = [];
    rows.forEach((row, index) => {
        let rowData = {};
        extractRowData(row, headers, rowData, index);
        if (index !== 0) {
            data.push(rowData);
        }
    });
    return { headers, data };
}

function extractRowData(row, headers, rowData, index) {
    [...row.querySelectorAll('td:not([data-no-export]), th:not([data-no-export])')].every((td, cellIndex) => {
        let text = getCleanedText(td);
        if (index === 0) {
            if (!text) return false;
            headers.push(text);
        } else {
            let header = headers[cellIndex];
            if (header) {
                rowData[header] = text;
            }
        }
        return true;
    });
}

function getCleanedText(td) {
    let tdClean = document.createElement('td');
    tdClean.innerHTML = td.innerHTML;
    tdClean.querySelectorAll('[data-no-export]').forEach(e => e.remove());
    let text = tdClean.textContent.trim();
    return text === '--' ? '' : text;
}

export { exportToExcel };
