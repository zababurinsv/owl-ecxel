import XLSX from 'xlsx'
import FileReader from "filereader";

let excel = {}

excel['parseXlsx'] = parseXlsx
excel['readFile'] = readFile

function parseXlsx(obj){
    // const inputEle = document.createElementNS("http://www.w3.org/1999/xhtml", "input");
    return new Promise((resolve, reject) => {
        // inputEle.type = 'file'
        // inputEle.accept=".xlsx, .xls"
        // inputEle.addEventListener('change', onFileChosen)
        // inputEle.click()
            var file = obj
            var reader = new FileReader()
            reader.onload = (e) => {
                var data = e.target.result
                var fixedData = fixdata(data)
                var workbook = XLSX.read(btoa(fixedData), { type: 'base64' })
                let json = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]])
                resolve(json)
            }
            reader.readAsArrayBuffer(file)

        function fixdata(data) { // 文件流转BinaryString
            var o = ''
            var l = 0
            var w = 10240
            for(; l < data.byteLength / w; ++l) {
                o += String.fromCharCode.apply(null, new Uint8Array(data.slice(l * w, l * w + w)))
            }
            o += String.fromCharCode.apply(null, new Uint8Array(data.slice(l * w)))
            return o
        }
    })

}


function readFile(obj){
    return new Promise((resolve, reject) => {

      let  workbook = XLSX.readFile(obj);
        const sheet_name_list = workbook.SheetNames;
      resolve(XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]))
    })

}

export default excel
