/// <reference path="SExpReader.ts" />
window.onload = () => {
    var el = document.getElementById('content');
    
    var sread: SExpReader = new SExpReader();
   
    var txtFrom: HTMLTextAreaElement = document.getElementById("txtFrom") as HTMLTextAreaElement;
    var txtTo: HTMLTextAreaElement = document.getElementById("txtTo") as HTMLTextAreaElement;

    var chkAddPrefix: HTMLInputElement = document.getElementById("chkIsAddPrefix") as HTMLInputElement;
    
    var btn1 = document.getElementById("btnSexpToJSON");
    btn1.onclick = function () {
        var ar = sread.parseSexp(txtFrom.value, chkAddPrefix.checked);

        txtTo.value = JSON.stringify(ar);
    }

    var btn2 = document.getElementById("btnJSONToSexp");
    btn2.onclick = function () {
        var ar = JSON.parse(txtTo.value);

        txtFrom.value = sread.serializeSexp(ar, chkAddPrefix.checked);
    }

};