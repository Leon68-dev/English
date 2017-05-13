function test() {
    Alert('function test()');
}

function hideAll() {
    $("#frmVerbs").hide();
    $("#frmVerbs").submit(function () {
        return false;
    });

    $("#frmWords").hide();
    $("#frmWords").submit(function () {
        return false;
    });

    $("#frmVerbs").hide();
    $("#frmVerbs").submit(function () {
        return false;
    });

    $("#frmList").hide();
    $("#frmList").submit(function () {
        return false;
    });

    $("#frmBackup").hide();
    $("#frmBackup").submit(function () {
        return false;
    });

    $("#frmAddWord").hide();
    $("#frmAddWord").submit(function () {
        return false;
    });
}

function checkedValue(val) {
    if (val == 1)
        return "checked";
    else
        return "";
}

function addStrValue(value_text, value_text2, id, isChecked) {

    var value_t = "";
    if (value_text && value_text != "undefined")
        value_t = value_text;

    if (value_text2 && value_text2 != "undefined")
        value_t += ("<br> - " + value_text2);

    var str = "<tr><td style='text-align:center'><input type='checkbox' style='zoom:4' onclick='onClickCheckBox(this);' value ='" + id + "' " + checkedValue(isChecked) + " ></td><td>" + value_t + "</td></tr>";
    $("#gridWords > tbody:last").after(str);
}

function getToastCountItems(itemsFound) {
    if (getSearchText() != "") {
        if (itemsFound > 0)
            window.plugins.toast.showShortBottom("There are " + itemsFound + " items");
        else
            window.plugins.toast.showShortBottom("Data didn't find");
    }
}

function setGridWordsBody(wordType) {
    $("#searchText").val("");
    clearTBody();
    currentWordType = wordType;
    var db = openDatabase();
    db.transaction(function (tx) {
        if (wordType == NEW) {
            tx.executeSql("select * from vrows where code = " + NEW + " order by id desc;", [], function (tx, res) {
                var cnt = res.rows.length;
                for (i = 0; i < cnt; i++) {
                    addStrValue(res.rows.item(i).value_w, res.rows.item(i).value_w2, res.rows.item(i).id, res.rows.item(i).is_checked);
                }
                getToastCountItems(cnt);
            },function(tx, error) {
                console.log('SELECT error: ' + error.message);
            });
        } else if (wordType == CHK) {
            tx.executeSql("select * from vrows where is_checked = 1 order by id desc;", [], function (tx, res) {
                var cnt = res.rows.length;
                for (i = 0; i < cnt; i++) {
                    addStrValue(res.rows.item(i).value_w, res.rows.item(i).value_w2, res.rows.item(i).id, res.rows.item(i).is_checked);
                }
                getToastCountItems(cnt);
            }, function (tx, error) {
                console.log('SELECT error: ' + error.message);
            });
        } else {
            tx.executeSql("select * from vrows where code = " + wordType + " order by value_w desc;", [], function (tx, res) {
                var cnt = res.rows.length;
                for (i = 0; i < cnt; i++) {
                    addStrValue(res.rows.item(i).value_w, res.rows.item(i).value_w2, res.rows.item(i).id, res.rows.item(i).is_checked);
                }
                getToastCountItems(cnt);
            }, function (tx, error) {
                console.log('SELECT error: ' + error.message);
            });
        }
    });
}

function onClickCheckBox(param) {
    var id = param.value;
    var isChecked = param.checked;

    var db = openDatabase();
    db.transaction(function (tx) {
        var chk = 0;
        if(isChecked == true)
            chk = 1;
        tx.executeSql("update words set is_checked = " + chk + " where id = " + id);
    });
}

function onClickButton(index) {
    currentForm = index;
    showCurrentForm(currentForm);
}

function clearTBody() {
    var table = document.getElementById("gridWords");
    for (var i = table.rows.length - 1; i >= 0; i--) {
        table.deleteRow(i);
    }
}

function getSearchText() {
    var str = $("#searchText").val().toLowerCase();
    return str;
}

function onClickButtonFind() {
    clearTBody();
    var db = openDatabase();
    db.transaction(function (tx) {
        if (currentWordType == ALL) {
            tx.executeSql("select * from vrows where (value_w like'%" + getSearchText() + "%' or value_w2 like'%" + getSearchText() + "%') order by value_w desc;", [], function (tx, res) {
                var cnt = res.rows.length;
                for (i = 0; i < cnt; i++) {
                    addStrValue(res.rows.item(i).value_w, res.rows.item(i).value_w2, res.rows.item(i).id, res.rows.item(i).is_checked);
                }
                getToastCountItems(cnt);
            }, function (tx, error) {
                console.log('SELECT error: ' + error.message);
            });
        } else if (currentWordType == NEW) {
            tx.executeSql("select * from vrows where code = " + NEW + " and (value_w like'%" + getSearchText() + "%' or value_w2 like'%" + getSearchText() + "%') order by id desc;", [], function (tx, res) {
                var cnt = res.rows.length;
                for (i = 0; i < cnt; i++) {
                    addStrValue(res.rows.item(i).value_w, res.rows.item(i).value_w2, res.rows.item(i).id, res.rows.item(i).is_checked);
                }
                getToastCountItems(cnt);
            }, function (tx, error) {
                console.log('SELECT error: ' + error.message);
            });
        } else if (currentWordType == CHK) {
            tx.executeSql("select * from vrows where is_checked = 1 and (value_w like'%" + getSearchText() + "%' or value_w2 like'%" + getSearchText() + "%') order by id desc;", [], function (tx, res) {
                var cnt = res.rows.length;
                for (i = 0; i < cnt; i++) {
                    addStrValue(res.rows.item(i).value_w, res.rows.item(i).value_w2, res.rows.item(i).id, res.rows.item(i).is_checked);
                }
                getToastCountItems(cnt);
            }, function (tx, error) {
                console.log('SELECT error: ' + error.message);
            });
        } else {
            tx.executeSql("select * from vrows where code = " + currentWordType + " and (value_w like'%" + getSearchText() + "%' or value_w2 like'%" + getSearchText() + "%') order by value_w desc;", [], function (tx, res) {
                var cnt = res.rows.length;
                for (i = 0; i < cnt; i++) {
                    addStrValue(res.rows.item(i).value_w, res.rows.item(i).value_w2, res.rows.item(i).id, res.rows.item(i).is_checked);
                }
                getToastCountItems(cnt);
            }, function (tx, error) {
                console.log('SELECT error: ' + error.message);
            });
        }
    });
}

function addZerro(param) {
    if (param < 10)
        return ('0' + param);
    return param;
}

function dateFormat() {
    var today = new Date();
    var dt = today.getFullYear()
        + '-'
        + addZerro(today.getMonth() + 1)
        + '-'
        + addZerro(today.getDate())
        + '_'
        + addZerro(today.getHours())
        + '-'
        + addZerro(today.getMinutes())
        + '-'
        + addZerro(today.getSeconds())
        + '-'
        + today.getMilliseconds();
    return dt;
}

function failFiles(error) {
    if (error.code == FileError.NOT_FOUND_ERR) alert("Message : NOT_FOUND_ERR")
    else if (error.code == FileError.SECURITY_ERR) alert("Message : SECURITY_ERR")
    else if (error.code == FileError.ABORT_ERR) alert("Message : ABORT_ERR")
    else if (error.code == FileError.NOT_READABLE_ERR) alert("Message : NOT_READABLE_ERR")
    else if (error.code == FileError.ENCODING_ERR) alert("Message : ENCODING_ERR")
    else if (error.code == FileError.NO_MODIFICATION_ALLOWED_ERR) alert("Message : NO_MODIFICATION_ALLOWED_ERR")
    else if (error.code == FileError.INVALID_STATE_ERR) alert("Message : INVALID_STATE_ERR")
    else if (error.code == FileError.SYNTAX_ERR) alert("Message : SYNTAX_ERR")
    else if (error.code == FileError.INVALID_MODIFICATION_ERR) alert("Message :  INVALID_MODIFICATION_ERR")
    else if (error.code == FileError.QUOTA_EXCEEDED_ERR) alert("Message : QUOTA_EXCEEDED_ERR")
    else if (error.code == FileError.PATH_EXISTS_ERR) alert("Message : PATH_EXISTS_ERR")

    showCurrentForm(BTN_BACKUP);
}

function exportDatabase() {
    var r = confirm('Would you like to export data?');
    if (r == true) {
        var source = cordova.file.dataDirectory + "";
        source = source.replace("/files/", "/databases/") + model_dbname;
        var destination = cordova.file.externalRootDirectory;
        window.resolveLocalFileSystemURL(source, function (fs) {
            window.resolveLocalFileSystemURL(destination, function (directoryEntry) {
                var filename = 'english_' + dateFormat() + '.db';
                fs.copyTo(directoryEntry, filename, function () { }, failFiles);
                fs.copyTo(directoryEntry, model_dbname_backup, function () {
                    showCurrentForm(BTN_ALL_WORDS);
                    alert("Export ok");
                }, failFiles);
            }, failFiles);
        }, failFiles);
    } else {
        showCurrentForm(BTN_BACKUP);
    }
}

function importDatabase() {
    var r = confirm('Would you like to import data?');
    if (r == true) {
        var source = cordova.file.externalRootDirectory + model_dbname_backup;
        var destination = cordova.file.dataDirectory + "";
        destination = destination.replace("/files/", "/databases/");
        window.resolveLocalFileSystemURL(source, function (fs) {
            window.resolveLocalFileSystemURL(destination, function (directoryEntry) {
                fs.copyTo(directoryEntry, model_dbname, function () {
                    showCurrentForm(BTN_ALL_WORDS);
                    alert("Import ok");
                }, failFiles);
            }, failFiles);
        }, failFiles);
    } else {
        showCurrentForm(BTN_BACKUP);
    }
}

function setDataToSelect() {
    $('#selectedGroups').empty();
    selectTypes(function (res) {
        var cnt = res.rows.length;
        if (cnt > 0) {
            for (var i = 0; i < cnt; i++) {
                $('#selectedGroups').append('<option value=' + res.rows.item(i).id + '>' + res.rows.item(i).name + '</option>');
            }
            $('#selectedGroups').val(res.rows.item(0).id).selectmenu("refresh");
        }
    });
}

function saveNewWord() {
    var value_w = $("#inputEnglishWord").val();
    var value_w2 = $("#inputRussianWord").val();
    var id_type = $("#selectedGroups").val();

    if (value_w && value_w2) {
        updateWordById(0, value_w, value_w2, 0, function (res) {
            selectMaxWordsID(function (res) {
                if (res && res.rows && res.rows.length) {
                    var id_words = res.rows.item(i).maxID;
                    insertRelation(id_words, id_type, function (res3) {
                        $("#inputEnglishWord").val('');
                        $("#inputRussianWord").val('');
                        showCurrentForm(BTN_ADD_WORD);
                        window.plugins.toast.showShortBottom("Data was saved");
                    });
                }
            });
        })
    } else {
        $("#inputEnglishWord").val('');
        $("#inputRussianWord").val('');
        showCurrentForm(BTN_ADD_WORD);
        window.plugins.toast.showShortBottom("Data was not saved");
    }
}

function cancelNewWord() {
    $("#inputEnglishWord").val('');
    $("#inputRussianWord").val('');
    showCurrentForm(BTN_ADD_WORD);
    window.plugins.toast.showShortBottom("Data was canceled");
}

function showCurrentForm(index) {
    hideAll();
    switch (index) {
        case 0:
        case BTN_ALL_WORDS:
            setGridWordsBody(ALL);
            $("#frmList").show();
            break;
        case BTN_WORDS_PHRASES:
            $("#frmWords").show();
            break;
        case BTN_NEW_WORDS:
            setGridWordsBody(NEW);
            $("#frmList").show();
            break;
        case BTN_PHRASES:
            setGridWordsBody(PHRASES);
            $("#frmList").show();
            break;
        case BTN_ANY:
            setGridWordsBody(ANY);
            $("#frmList").show();
            break;
        case BTN_VERB:
            $("#frmVerbs").show();
            break;
        case BTN_VERBS:
            setGridWordsBody(VERB);
            $("#frmList").show();
            break;
        case BTN_VERBS_IRREG:
            setGridWordsBody(VERB_IRREG);
            $("#frmList").show();
            break;
        case BTN_HOUSE:
            setGridWordsBody(HOUSE);
            $("#frmList").show();
            break;
        case BTN_CLOTHING:
            setGridWordsBody(CLOTHING);
            $("#frmList").show();
            break;
        case BTN_FOOD:
            setGridWordsBody(FOOD);
            $("#frmList").show();
            break;
        case BTN_ADJECTIVE:
            setGridWordsBody(ADJECTIVE);
            $("#frmList").show();
            break;
        case BTN_OFFICE:
            setGridWordsBody(OFFICE);
            $("#frmList").show();
            break;
        case BTN_COLLOCATION:
            setGridWordsBody(COLLOCATION);
            $("#frmList").show();
            break;
        case BTN_TRANSPORT:
            setGridWordsBody(TRANSPORT);
            $("#frmList").show();
            break;
        case BTN_MONEY:
            setGridWordsBody(MONEY);
            $("#frmList").show();
            break;
        case BTN_NATURAL:
            setGridWordsBody(NATURAL);
            $("#frmList").show();
            break;
        case BTN_ANIMALS:
            setGridWordsBody(ANIMALS);
            $("#frmList").show();
            break;
        case BTN_REST:
            setGridWordsBody(REST);
            $("#frmList").show();
            break;
        case BTN_MEDICAL:
            setGridWordsBody(MEDICAL);
            $("#frmList").show();
            break;
        case BTN_IDIOM:
            setGridWordsBody(IDIOM);
            $("#frmList").show();
            break;
        case BTN_CRIME_PUNISHMENT:
            setGridWordsBody(CRIME_PUNISHMENT);
            $("#frmList").show();
            break;
        case BTN_PERSON_FAMILY:
            setGridWordsBody(PERSON_FAMILY);
            $("#frmList").show();
            break;
        case BTN_CHK_WORDS:
            setGridWordsBody(CHK);
            $("#frmList").show();
            break;
        case BTN_TONGUE_TWISTER:
            setGridWordsBody(TONGUE_TWISTER);
            $("#frmList").show();
            break;
        case BTN_BACKUP:
            $("#frmBackup").show();
            break;
        case BTN_BACKUP_EXPORT:
            exportDatabase();
            break;
        case BTN_BACKUP_IMPORT:
            importDatabase();
            break;
        case BTN_ADD_WORD:
            setDataToSelect();
            $("#frmAddWord").show();
            break;
        case BTN_ADD_WORD_SAVE:
            saveNewWord();
            break;
        case BTN_ADD_WORD_CANCEL:
            cancelNewWord()
            break;

        default:
    }
}

function onClickBack() {
    switch (currentForm) {
        case BTN_ADD_WORD:
        case BTN_WORDS_PHRASES:
        case BTN_NEW_WORDS:
        case BTN_ALL_WORDS:
        case BTN_CHK_WORDS:
        case BTN_BACKUP:
        case BTN_BACKUP_EXPORT:
        case BTN_BACKUP_IMPORT:
            currentForm = 0;
            showCurrentForm(currentForm);
            break;
        case BTN_PHRASES:
        case BTN_ANY:
        case BTN_VERB:
            currentForm = BTN_WORDS_PHRASES;
            showCurrentForm(currentForm);
            break;
        case BTN_VERBS:
            currentForm = BTN_VERB;
            showCurrentForm(currentForm);
            break;
        case BTN_VERBS_IRREG:
            currentForm = BTN_VERB;
            showCurrentForm(currentForm);
            break;
        case BTN_HOUSE:
        case BTN_CLOTHING:
        case BTN_FOOD:
        case BTN_ADJECTIVE:
        case BTN_OFFICE:
        case BTN_COLLOCATION:
        case BTN_TRANSPORT:
        case BTN_MONEY:
        case BTN_NATURAL:
        case BTN_ANIMALS:
        case BTN_REST:
        case BTN_MEDICAL:
        case BTN_IDIOM:
        case BTN_CRIME_PUNISHMENT:
        case BTN_PERSON_FAMILY:
            currentForm = BTN_WORDS_PHRASES;
            showCurrentForm(currentForm);
            break;
        default:
            navigator.app.exitApp();
    }
}